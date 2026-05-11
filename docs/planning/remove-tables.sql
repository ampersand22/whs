-- Remove all tables EXCEPT: whs-*, providers, jd-admin, jd-photos
-- Must drop in correct order due to foreign key constraints

-- First drop tables that depend on others (have foreign keys to church_users/churches)
DROP TABLE IF EXISTS live_stream_slides CASCADE;
DROP TABLE IF EXISTS live_stream_viewers CASCADE;
DROP TABLE IF EXISTS live_streams CASCADE;
DROP TABLE IF EXISTS event_attendees CASCADE;
DROP TABLE IF EXISTS event_templates CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS choir_songs CASCADE;
DROP TABLE IF EXISTS church_app_components CASCADE;
DROP TABLE IF EXISTS church_events CASCADE;
DROP TABLE IF EXISTS church_membership_requests CASCADE;
DROP TABLE IF EXISTS church_memberships CASCADE;
DROP TABLE IF EXISTS prayer_requests CASCADE;
DROP TABLE IF EXISTS user_privacy_settings CASCADE;
DROP TABLE IF EXISTS app_components CASCADE;

-- Then drop the base tables
DROP TABLE IF EXISTS church_users CASCADE;
DROP TABLE IF EXISTS churches CASCADE;
