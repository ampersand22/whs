-- Update the sample user with the correct Supabase Auth user ID
-- First, get the auth user ID from Supabase dashboard, then run:

-- Replace 'YOUR_AUTH_USER_ID_HERE' with the actual UUID from Supabase Auth
UPDATE "whs-users" 
SET id = 'YOUR_AUTH_USER_ID_HERE'
WHERE email = 'alice@example.com';

-- Also update any related records
UPDATE "whs-game_scores" 
SET user_id = 'YOUR_AUTH_USER_ID_HERE'
WHERE user_id = (SELECT id FROM "whs-users" WHERE email = 'alice@example.com');

UPDATE "whs-monthly_leaderboards" 
SET user_id = 'YOUR_AUTH_USER_ID_HERE'
WHERE user_id = (SELECT id FROM "whs-users" WHERE email = 'alice@example.com');
