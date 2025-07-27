// Test user creation script
// Run this with: node create-test-user.js

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // You'll need to add this to .env

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file');
  process.exit(1);
}

// Create admin client with service key
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'alice@example.com',
      password: 'password123',
      email_confirm: true // Skip email confirmation
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('Auth user created:', authData.user.id);

    // Create user in custom table
    const { data: userData, error: userError } = await supabaseAdmin
      .from('whs-users')
      .upsert([
        {
          id: authData.user.id,
          email: 'alice@example.com',
          display_name: 'Alice Wonder',
          password_hash: 'managed_by_supabase_auth',
          high_score: 1250,
          total_games_played: 15
        }
      ])
      .select()
      .single();

    if (userError) {
      console.error('Error creating user profile:', userError);
      return;
    }

    console.log('User profile created successfully!');
    console.log('You can now log in with:');
    console.log('Email: alice@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestUser();
