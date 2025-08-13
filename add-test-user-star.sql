-- Add a star to test user test123@gmail.com
-- This simulates them winning a monthly competition

-- First, let's find the user ID for test123@gmail.com
DO $$
DECLARE
    test_user_id UUID;
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    current_month INTEGER := EXTRACT(MONTH FROM CURRENT_DATE);
BEGIN
    -- Get the user ID for test123@gmail.com
    SELECT id INTO test_user_id 
    FROM "whs-users" 
    WHERE email = 'test123@gmail.com';
    
    -- Check if user exists
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'User test123@gmail.com not found!';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found user ID: %', test_user_id;
    
    -- Add a star for the current month (simulating monthly winner)
    INSERT INTO "whs-user_stars" (user_id, year, month, star_type)
    VALUES (test_user_id, current_year, current_month, 'monthly_winner')
    ON CONFLICT (user_id, year, month, star_type) DO NOTHING;
    
    -- Update the total_stars count in whs-users table
    UPDATE "whs-users"
    SET total_stars = (
        SELECT COUNT(*)
        FROM "whs-user_stars"
        WHERE user_id = test_user_id
    )
    WHERE id = test_user_id;
    
    -- Also add them to monthly_winners table for completeness
    INSERT INTO "whs-monthly_winners" (
        year, 
        month, 
        user_id, 
        display_name, 
        winning_score, 
        total_games, 
        average_score,
        star_awarded
    )
    SELECT 
        current_year,
        current_month,
        test_user_id,
        display_name,
        high_score,
        total_games_played,
        CASE 
            WHEN total_games_played > 0 THEN high_score::DECIMAL / total_games_played 
            ELSE 0 
        END,
        TRUE
    FROM "whs-users"
    WHERE id = test_user_id
    ON CONFLICT (year, month) DO NOTHING;
    
    RAISE NOTICE 'Successfully added star to test123@gmail.com for % %', current_year, current_month;
    
END $$;

-- Verify the results
SELECT 
    u.email,
    u.display_name,
    u.total_stars,
    us.year,
    us.month,
    us.star_type,
    us.awarded_at
FROM "whs-users" u
LEFT JOIN "whs-user_stars" us ON u.id = us.user_id
WHERE u.email = 'test123@gmail.com';
