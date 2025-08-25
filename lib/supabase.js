import { createClient } from "@supabase/supabase-js";
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// Debug logging


if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and app.config.js');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
