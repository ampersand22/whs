#!/usr/bin/env node

// Test script to verify production configuration
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Production Configuration...\n');

// Test 1: Environment Variables
console.log('1. Environment Variables:');
console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Found' : '❌ Missing');
console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing');
console.log('   EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL ? '✅ Found' : '❌ Missing');
console.log('   EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing');

// Test 2: Supabase Connection
console.log('\n2. Supabase Connection Test:');
const supabaseUrl = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test basic connection
    const { data, error } = await supabase
      .from('whs-users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('   Connection:', '❌ Failed -', error.message);
    } else {
      console.log('   Connection:', '✅ Success - Can connect to database');
    }
    
    // Test auth
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.log('   Auth System:', '❌ Failed -', authError.message);
    } else {
      console.log('   Auth System:', '✅ Working');
    }
    
  } catch (error) {
    console.log('   Connection:', '❌ Failed -', error.message);
  }
} else {
  console.log('   Connection:', '❌ Cannot test - Missing credentials');
}

// Test 3: App Configuration
console.log('\n3. App Configuration:');
try {
  const appConfig = await import('./app.config.js');
  const config = appConfig.default;
  
  console.log('   App Name:', config.expo.name);
  console.log('   Version:', config.expo.version);
  console.log('   iOS Build Number:', config.expo.ios.buildNumber);
  console.log('   Android Version Code:', config.expo.android.versionCode);
  console.log('   Bundle ID:', config.expo.ios.bundleIdentifier);
  console.log('   Supabase URL in config:', config.expo.extra.supabaseUrl ? '✅ Found' : '❌ Missing');
  console.log('   Supabase Key in config:', config.expo.extra.supabaseAnonKey ? '✅ Found' : '❌ Missing');
} catch (error) {
  console.log('   App Config:', '❌ Failed to load -', error.message);
}

console.log('\n✅ Production configuration test complete!');
console.log('\nNext steps:');
console.log('1. If all tests pass, you can build with: eas build --profile preview --platform ios');
console.log('2. If any tests fail, check your .env file and app.config.js');
