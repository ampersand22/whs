import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Supabase configuration - using expo-constants to access app.config.js extra values
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// Debug logging (only in development)
if (__DEV__) {

}

// Graceful error handling for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `Missing Supabase environment variables:
    - URL: ${supabaseUrl ? 'Found' : 'Missing'}
    - Key: ${supabaseAnonKey ? 'Found' : 'Missing'}
    - Constants available: ${!!Constants.expoConfig}
    - Extra available: ${!!Constants.expoConfig?.extra}`;
  
  if (__DEV__) {
  }
  
  // In production, create a dummy client to prevent crashes
  // The app will show an error screen instead
  if (!__DEV__) {
  } else {
    throw new Error(errorMessage);
  }
}

// Create Supabase client with fallback values for production
const createSupabaseClient = () => {
  try {
    return createClient(
      supabaseUrl || 'https://dummy.supabase.co', 
      supabaseAnonKey || 'dummy-key',
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      }
    );
  } catch (error) {
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
        if (__DEV__) {
        }
        callback(event, session);
      }
    );
    return subscription;
  } catch (error) {
    return { unsubscribe: () => {} };
  }
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session?.user;
  } catch (error) {
    return false;
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user || null;
  } catch (error) {
    return null;
  }
};
