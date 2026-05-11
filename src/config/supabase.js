import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase configuration from environment
const getSupabaseConfig = () => {
  // Method 1: From expo-constants (app.config.js extra)
  let supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
  let supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
  
  // Method 2: From process.env (for development)
  if (!supabaseUrl && typeof process !== 'undefined' && process.env) {
    supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  }
  
  return { supabaseUrl, supabaseAnonKey };
};

const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `Missing Supabase environment variables:
    - URL: ${supabaseUrl ? 'Found' : 'Missing'}
    - Key: ${supabaseAnonKey ? 'Found' : 'Missing'}
    - Constants available: ${!!Constants.expoConfig}
    - Extra available: ${!!Constants.expoConfig?.extra}`;
  
  if (__DEV__) {
    console.error(errorMessage);
    throw new Error(errorMessage);
  } else {
    console.warn('Creating dummy Supabase client due to missing environment variables');
  }
}

// Create Supabase client
const createSupabaseClient = () => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    
    // Return a mock client that won't crash the app
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      }),
    };
  }
};

export const supabase = createSupabaseClient();

// Auth event listener helper
export const setupAuthListener = (callback) => {
  try {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session);
      }
    );
    return subscription;
  } catch (error) {
    console.error('Failed to setup auth listener:', error);
    return { unsubscribe: () => {} };
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  } catch (error) {
    console.error('Failed to check authentication:', error);
    return false;
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};
