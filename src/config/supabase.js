import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Supabase configuration - using expo-constants to access app.config.js extra values
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// Debug logging
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);
console.log('Constants.expoConfig.extra:', Constants.expoConfig?.extra);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and app.config.js');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic token refresh
    autoRefreshToken: true,
    // Persist auth session in AsyncStorage
    persistSession: true,
    // Detect session from URL (useful for web)
    detectSessionInUrl: false,
  },
});

// Auth event listener helper
export const setupAuthListener = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      callback(event, session);
    }
  );

  return subscription;
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session?.user;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};
