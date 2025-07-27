-- Clean Word Game Database Setup
-- This creates the schema without hardcoded test data
-- Users will be created automatically when they sign up through the app

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING TABLES (in correct order to handle dependencies)
-- ============================================

DROP TABLE IF EXISTS "whs-user_stars" CASCADE;
DROP TABLE IF EXISTS "whs-monthly_winners" CASCADE;
DROP TABLE IF EXISTS "whs-monthly_leaderboards" CASCADE;
DROP TABLE IF EXISTS "whs-game_scores" CASCADE;
DROP TABLE IF EXISTS "whs-users" CASCADE;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS process_month_end(INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS update_monthly_leaderboard(UUID, VARCHAR(100), INTEGER, TIMESTAMP WITH TIME ZONE) CASCADE;
DROP FUNCTION IF EXISTS process_game_completion(UUID, VARCHAR(100), INTEGER, INTEGER, INTEGER, TEXT[], INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_enhanced_leaderboard(INTEGER, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS cleanup_old_scores() CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Users table - IDs will match Supabase Auth user IDs
CREATE TABLE "whs-users" (
    id UUID PRIMARY KEY, -- Will match Supabase Auth user ID
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL DEFAULT 'managed_by_supabase_auth',
    high_score INTEGER DEFAULT 0,
    total_games_played INTEGER DEFAULT 0,
    total_stars INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_played TIMESTAMP WITH TIME ZONE
);

-- Game scores table
CREATE TABLE "whs-game_scores" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "whs-users"(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    time_left INTEGER NOT NULL,
    word_count INTEGER NOT NULL,
    words_found TEXT[],
    game_duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Monthly leaderboards table
CREATE TABLE "whs-monthly_leaderboards" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    user_id UUID NOT NULL REFERENCES "whs-users"(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    highest_score INTEGER NOT NULL,
    total_games INTEGER NOT NULL,
    average_score DECIMAL(8,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, month, user_id)
);

-- Monthly winners table
CREATE TABLE "whs-monthly_winners" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    user_id UUID NOT NULL REFERENCES "whs-users"(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    winning_score INTEGER NOT NULL,
    total_games INTEGER NOT NULL,
    average_score DECIMAL(8,2),
    star_awarded BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(year, month)
);

-- User achievements/stars table
CREATE TABLE "whs-user_stars" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "whs-users"(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    star_type VARCHAR(50) DEFAULT 'monthly_winner',
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, year, month, star_type)
);

-- ============================================
-- CREATE INDEXES
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
-- CREATE FUNCTIONS AND TRIGGERS
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
    
    IF winner_record IS NULL THEN
        RETURN;
    END IF;
    
    INSERT INTO "whs-monthly_winners" (
        year, month, user_id, display_name, winning_score, total_games, average_score
    )
    VALUES (
        target_year, target_month, winner_record.user_id, winner_record.display_name,
        winner_record.highest_score, winner_record.total_games, winner_record.average_score
    )
    ON CONFLICT (year, month) DO NOTHING;
    
    INSERT INTO "whs-user_stars" (user_id, year, month, star_type)
    VALUES (winner_record.user_id, target_year, target_month, 'monthly_winner')
    ON CONFLICT (user_id, year, month, star_type) DO NOTHING;
    
    UPDATE "whs-users"
    SET total_stars = (
        SELECT COUNT(*)
        FROM "whs-user_stars"
        WHERE user_id = winner_record.user_id
    )
    WHERE id = winner_record.user_id;
    
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
    game_year := EXTRACT(YEAR FROM p_game_date);
    game_month := EXTRACT(MONTH FROM p_game_date);
    
    SELECT AVG(score)::DECIMAL(8,2)
    INTO user_avg_score
    FROM "whs-game_scores"
    WHERE user_id = p_user_id
    AND EXTRACT(YEAR FROM created_at) = game_year
    AND EXTRACT(MONTH FROM created_at) = game_month;
    
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
        display_name = EXCLUDED.display_name,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Complete game processing
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
    SELECT high_score INTO current_high_score
    FROM "whs-users"
    WHERE id = p_user_id;
    
    IF current_high_score IS NULL OR p_score > current_high_score THEN
        is_high_score := TRUE;
    END IF;
    
    INSERT INTO "whs-game_scores" (
        user_id, score, time_left, word_count, words_found, game_duration
    )
    VALUES (
        p_user_id, p_score, p_time_left, p_word_count, p_words_found, p_game_duration
    )
    RETURNING id INTO new_score_id;
    
    UPDATE "whs-users"
    SET 
        high_score = GREATEST(COALESCE(high_score, 0), p_score),
        total_games_played = total_games_played + 1,
        last_played = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
    
    PERFORM update_monthly_leaderboard(p_user_id, p_display_name, p_score);
    
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
    
    RETURN QUERY
    SELECT 
        new_score_id,
        is_high_score,
        COALESCE(user_rank, 999999);
END;
$$ LANGUAGE plpgsql;

-- Get enhanced leaderboard
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

-- Clean up old scores
CREATE OR REPLACE FUNCTION cleanup_old_scores()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    current_deleted INTEGER;
    user_record RECORD;
BEGIN
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

-- ============================================
-- SETUP COMPLETE
-- ============================================

SELECT 'Clean database setup complete! Users will be created automatically when they sign up.' as status;
