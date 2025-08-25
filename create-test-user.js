// Test user creation script
// Run this with: node create-test-user.js

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // You'll need to add this to .env

if (!supabaseUrl || !supabaseServiceKey) {
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
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'alice@example.com',
      password: 'password123',
      email_confirm: true // Skip email confirmation
    });

    if (authError) {
      return;
    }


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
      return;
    }


  } catch (error) {
  }
}

createTestUser();
