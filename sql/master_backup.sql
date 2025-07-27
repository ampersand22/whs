-- Word Game Master SQL File
-- This file contains the complete database schema and procedures
-- Run this file in Supabase SQL Editor to set up the entire database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DATABASE SCHEMA
-- ============================================

-- Users table
CREATE TABLE "whs-users" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    high_score INTEGER DEFAULT 0,
    total_games_played INTEGER DEFAULT 0,
    total_stars INTEGER DEFAULT 0, -- Accumulated stars from monthly wins
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_played TIMESTAMP WITH TIME ZONE
);

-- Game scores table - stores all individual game scores
CREATE TABLE "whs-game_scores" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "whs-users"(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    time_left INTEGER NOT NULL, -- seconds remaining when game ended
    word_count INTEGER NOT NULL, -- number of words found
    words_found TEXT[], -- array of words found during the game
    game_duration INTEGER, -- total game time in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Monthly leaderboards table - tracks monthly competitions
CREATE TABLE "whs-monthly_leaderboards" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL, -- 1-12
    user_id UUID NOT NULL REFERENCES "whs-users"(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL, -- denormalized for performance
    highest_score INTEGER NOT NULL, -- user's best score for this month
    total_games INTEGER NOT NULL, -- games played this month
    average_score DECIMAL(8,2), -- average score for this month
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one entry per user per month
    UNIQUE(year, month, user_id)
);

-- Monthly winners table - stores the winner of each month
CREATE TABLE "whs-monthly_winners" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL, -- 1-12
    user_id UUID NOT NULL REFERENCES "whs-users"(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    winning_score INTEGER NOT NULL,
    total_games INTEGER NOT NULL, -- games played that month
    average_score DECIMAL(8,2),
    star_awarded BOOLEAN DEFAULT TRUE, -- whether star was awarded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one winner per month
    UNIQUE(year, month)
);

-- User achievements/stars table - tracks all stars earned by users
CREATE TABLE "whs-user_stars" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "whs-users"(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    star_type VARCHAR(50) DEFAULT 'monthly_winner', -- for future expansion
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one star per user per month per type
    UNIQUE(user_id, year, month, star_type)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX "idx_whs-users_email" ON "whs-users"(email);
CREATE INDEX "idx_whs-users_high_score" ON "whs-users"(high_score DESC);
CREATE INDEX "idx_whs-game_scores_user_id" ON "whs-game_scores"(user_id);
CREATE INDEX "idx_whs-game_scores_created_at" ON "whs-game_scores"(created_at DESC);
CREATE INDEX "idx_whs-game_scores_score" ON "whs-game_scores"(score DESC);
CREATE INDEX "idx_whs-monthly_leaderboards_year_month" ON "whs-monthly_leaderboards"(year, month);
CREATE INDEX "idx_whs-monthly_leaderboards_score" ON "whs-monthly_leaderboards"(highest_score DESC);
CREATE INDEX "idx_whs-monthly_winners_year_month" ON "whs-monthly_winners"(year, month);
CREATE INDEX "idx_whs-user_stars_user_id" ON "whs-user_stars"(user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to update timestamps
CREATE TRIGGER "update_whs-users_updated_at" BEFORE UPDATE ON "whs-users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER "update_whs-monthly_leaderboards_updated_at" BEFORE UPDATE ON "whs-monthly_leaderboards"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORED PROCEDURES
-- ============================================

-- Process month-end: determine winner and award stars
CREATE OR REPLACE FUNCTION process_month_end(target_year INTEGER, target_month INTEGER)
RETURNS TABLE(
    winner_user_id UUID,
    winner_display_name VARCHAR(100),
    winning_score INTEGER,
    star_awarded BOOLEAN
) AS $$
DECLARE
    winner_record RECORD;
BEGIN
    -- Find the monthly winner
    SELECT 
        ml.user_id,
        ml.display_name,
        ml.highest_score,
        ml.total_games,
        ml.average_score
    INTO winner_record
    FROM "whs-monthly_leaderboards" ml
    WHERE ml.year = target_year AND ml.month = target_month
    ORDER BY ml.highest_score DESC, ml.average_score DESC, ml.total_games DESC
    LIMIT 1;
    
    -- If no winner found, return empty result
    IF winner_record IS NULL THEN
        RETURN;
    END IF;
    
    -- Insert winner record
    INSERT INTO "whs-monthly_winners" (
        year, month, user_id, display_name, winning_score, total_games, average_score
    )
    VALUES (
        target_year, target_month, winner_record.user_id, winner_record.display_name,
        winner_record.highest_score, winner_record.total_games, winner_record.average_score
    )
    ON CONFLICT (year, month) DO NOTHING;
    
    -- Award star to winner
    INSERT INTO "whs-user_stars" (user_id, year, month, star_type)
    VALUES (winner_record.user_id, target_year, target_month, 'monthly_winner')
    ON CONFLICT (user_id, year, month, star_type) DO NOTHING;
    
    -- Update user's total stars count
    UPDATE "whs-users"
    SET total_stars = (
        SELECT COUNT(*)
        FROM "whs-user_stars"
        WHERE user_id = winner_record.user_id
    )
    WHERE id = winner_record.user_id;
    
    -- Return winner information
    RETURN QUERY
    SELECT 
        winner_record.user_id,
        winner_record.display_name,
        winner_record.highest_score,
        TRUE as star_awarded;
END;
$$ LANGUAGE plpgsql;

-- Update monthly leaderboard after a game
CREATE OR REPLACE FUNCTION update_monthly_leaderboard(
    p_user_id UUID,
    p_display_name VARCHAR(100),
    p_score INTEGER,
    p_game_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
RETURNS VOID AS $$
DECLARE
    game_year INTEGER;
    game_month INTEGER;
    user_avg_score DECIMAL(8,2);
BEGIN
    -- Extract year and month from game date
    game_year := EXTRACT(YEAR FROM p_game_date);
    game_month := EXTRACT(MONTH FROM p_game_date);
    
    -- Calculate user's average score for this month
    SELECT AVG(score)::DECIMAL(8,2)
    INTO user_avg_score
    FROM "whs-game_scores"
    WHERE user_id = p_user_id
    AND EXTRACT(YEAR FROM created_at) = game_year
    AND EXTRACT(MONTH FROM created_at) = game_month;
    
    -- Update or insert monthly leaderboard entry
    INSERT INTO "whs-monthly_leaderboards" (
        year, month, user_id, display_name, highest_score, total_games, average_score
    )
    VALUES (
        game_year, game_month, p_user_id, p_display_name, p_score, 1, p_score
    )
    ON CONFLICT (year, month, user_id)
    DO UPDATE SET
        highest_score = GREATEST("whs-monthly_leaderboards".highest_score, EXCLUDED.highest_score),
        total_games = "whs-monthly_leaderboards".total_games + 1,
        average_score = user_avg_score,
        display_name = EXCLUDED.display_name, -- Update in case display name changed
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Complete game processing (save score and update leaderboards)
CREATE OR REPLACE FUNCTION process_game_completion(
    p_user_id UUID,
    p_display_name VARCHAR(100),
    p_score INTEGER,
    p_time_left INTEGER,
    p_word_count INTEGER,
    p_words_found TEXT[],
    p_game_duration INTEGER DEFAULT NULL
)
RETURNS TABLE(
    game_score_id UUID,
    is_new_high_score BOOLEAN,
    monthly_rank INTEGER
) AS $$
DECLARE
    new_score_id UUID;
    current_high_score INTEGER;
    is_high_score BOOLEAN := FALSE;
    user_rank INTEGER;
    game_year INTEGER;
    game_month INTEGER;
BEGIN
    -- Get current high score
    SELECT high_score INTO current_high_score
    FROM "whs-users"
    WHERE id = p_user_id;
    
    -- Check if this is a new high score
    IF current_high_score IS NULL OR p_score > current_high_score THEN
        is_high_score := TRUE;
    END IF;
    
    -- Save the game score
    INSERT INTO "whs-game_scores" (
        user_id, score, time_left, word_count, words_found, game_duration
    )
    VALUES (
        p_user_id, p_score, p_time_left, p_word_count, p_words_found, p_game_duration
    )
    RETURNING id INTO new_score_id;
    
    -- Update user stats
    UPDATE "whs-users"
    SET 
        high_score = GREATEST(COALESCE(high_score, 0), p_score),
        total_games_played = total_games_played + 1,
        last_played = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
    
    -- Update monthly leaderboard
    PERFORM update_monthly_leaderboard(p_user_id, p_display_name, p_score);
    
    -- Get user's current monthly rank
    game_year := EXTRACT(YEAR FROM CURRENT_TIMESTAMP);
    game_month := EXTRACT(MONTH FROM CURRENT_TIMESTAMP);
    
    WITH ranked_users AS (
        SELECT 
            user_id,
            ROW_NUMBER() OVER (ORDER BY highest_score DESC, average_score DESC) as rank
        FROM "whs-monthly_leaderboards"
        WHERE year = game_year AND month = game_month
    )
    SELECT rank INTO user_rank
    FROM ranked_users
    WHERE user_id = p_user_id;
    
    -- Return results
    RETURN QUERY
    SELECT 
        new_score_id,
        is_high_score,
        COALESCE(user_rank, 999999);
END;
$$ LANGUAGE plpgsql;

-- Get leaderboard with user stats
CREATE OR REPLACE FUNCTION get_enhanced_leaderboard(
    p_year INTEGER,
    p_month INTEGER,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    rank INTEGER,
    user_id UUID,
    display_name VARCHAR(100),
    highest_score INTEGER,
    total_games INTEGER,
    average_score DECIMAL(8,2),
    total_stars INTEGER,
    is_current_winner BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH ranked_leaderboard AS (
        SELECT 
            ROW_NUMBER() OVER (ORDER BY ml.highest_score DESC, ml.average_score DESC) as user_rank,
            ml.user_id,
            ml.display_name,
            ml.highest_score,
            ml.total_games,
            ml.average_score,
            u.total_stars,
            CASE 
                WHEN mw.user_id IS NOT NULL THEN TRUE 
                ELSE FALSE 
            END as is_winner
        FROM "whs-monthly_leaderboards" ml
        JOIN "whs-users" u ON ml.user_id = u.id
        LEFT JOIN "whs-monthly_winners" mw ON ml.user_id = mw.user_id 
            AND ml.year = mw.year AND ml.month = mw.month
        WHERE ml.year = p_year AND ml.month = p_month
        ORDER BY ml.highest_score DESC, ml.average_score DESC
        LIMIT p_limit
    )
    SELECT 
        user_rank::INTEGER,
        rl.user_id,
        rl.display_name,
        rl.highest_score,
        rl.total_games,
        rl.average_score,
        rl.total_stars,
        rl.is_winner
    FROM ranked_leaderboard rl;
END;
$$ LANGUAGE plpgsql;

-- Clean up old game scores (keep only last 100 per user)
CREATE OR REPLACE FUNCTION cleanup_old_scores()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    current_deleted INTEGER;
    user_record RECORD;
BEGIN
    -- For each user, keep only their latest 100 scores
    FOR user_record IN SELECT id FROM "whs-users" LOOP
        WITH old_scores AS (
            SELECT id
            FROM "whs-game_scores"
            WHERE user_id = user_record.id
            ORDER BY created_at DESC
            OFFSET 100
        )
        DELETE FROM "whs-game_scores"
        WHERE id IN (SELECT id FROM old_scores);
        
        GET DIAGNOSTICS current_deleted = ROW_COUNT;
        deleted_count := deleted_count + current_deleted;
    END LOOP;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
