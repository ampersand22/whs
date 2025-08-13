-- Simple version: Add star to test123@gmail.com for current month

-- Add star record
INSERT INTO "whs-user_stars" (user_id, year, month, star_type)
SELECT 
    id,
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER,
    'monthly_winner'
FROM "whs-users" 
WHERE email = 'test123@gmail.com'
ON CONFLICT (user_id, year, month, star_type) DO NOTHING;

-- Update total_stars count
UPDATE "whs-users"
SET total_stars = (
    SELECT COUNT(*)
    FROM "whs-user_stars"
    WHERE user_id = "whs-users".id
)
WHERE email = 'test123@gmail.com';

-- Check the result
SELECT email, display_name, total_stars 
FROM "whs-users" 
WHERE email = 'test123@gmail.com';
