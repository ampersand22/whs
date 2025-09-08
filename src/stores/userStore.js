import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';

const useUserStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // User stats
      userStats: {
        highScore: 0,
        totalGamesPlayed: 0,
        totalStars: 0,
        monthlyRank: null,
        lastPlayed: null,
      },

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Initialize auth state
      initialize: async () => {
        try {
          set({ isLoading: true });
          
          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }

          if (session?.user) {
            await get().setUserSession(session);
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Set user session and fetch user data
      setUserSession: async (session) => {
        try {
          set({ 
            session, 
            user: session?.user || null, 
            isAuthenticated: !!session?.user,
            isLoading: true 
          });

          if (session?.user) {
            await get().fetchUserStats();
          } else {
            // Clear user stats when no session
            set({
              userStats: {
                highScore: 0,
                totalGamesPlayed: 0,
                totalStars: 0,
                monthlyRank: null,
                lastPlayed: null,
              }
            });
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
        }
      },

      // Sign up new user
      signUp: async (email, password, displayName) => {
        try {
          set({ isLoading: true, error: null });

          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (authError) {
            const friendlyError = get().getFriendlyAuthError(authError.message);
            set({ error: friendlyError, isLoading: false });
            return { success: false, error: friendlyError };
          }

          if (authData.user && authData.session) {
            const { error: dbError } = await supabase
              .from('whs-users')
              .insert({
                id: authData.user.id,
                email: authData.user.email,
                display_name: displayName,
                password_hash: 'handled_by_supabase_auth',
              });

            if (dbError) {
              console.warn('Profile creation failed:', dbError);
            }

            set({ 
              user: authData.user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          }

          set({ isLoading: false });
          return { success: true, user: authData.user };
        } catch (error) {
          const friendlyError = get().getFriendlyAuthError(error.message);
          set({ error: friendlyError, isLoading: false });
          return { success: false, error: friendlyError };
        }
      },

      // Sign in user
      signIn: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            const friendlyError = get().getFriendlyAuthError(error.message);
            set({ error: friendlyError, isLoading: false });
            return { success: false, error: friendlyError };
          }

          await get().setUserSession(data.session);
          return { success: true, user: data.user };
        } catch (error) {
          const friendlyError = get().getFriendlyAuthError(error.message);
          set({ error: friendlyError, isLoading: false });
          return { success: false, error: friendlyError };
        }
      },

      // Sign out user
      signOut: async () => {
        try {
          set({ isLoading: true, error: null });

          const { error } = await supabase.auth.signOut();
          
          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          // Clear all user data
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
            userStats: {
              highScore: 0,
              totalGamesPlayed: 0,
              totalStars: 0,
              monthlyRank: null,
              lastPlayed: null,
            }
          });

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Helper to convert technical errors to user-friendly messages
      getFriendlyAuthError: (errorMessage) => {
        const message = errorMessage.toLowerCase();
        
        if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
          return 'Invalid email or password. Please check your credentials and try again.';
        }
        if (message.includes('user already registered')) {
          return 'An account with this email already exists. Try signing in instead.';
        }
        if (message.includes('invalid email')) {
          return 'Please enter a valid email address.';
        }
        if (message.includes('password should be at least')) {
          return 'Password must be at least 6 characters long.';
        }
        if (message.includes('signup is disabled')) {
          return 'Account creation is currently disabled. Please try again later.';
        }
        if (message.includes('email not confirmed')) {
          return 'Please check your email and confirm your account before signing in.';
        }
        if (message.includes('too many requests')) {
          return 'Too many attempts. Please wait a moment before trying again.';
        }
        if (message.includes('network') || message.includes('fetch')) {
          return 'Network error. Please check your connection and try again.';
        }
        
        // Return original message if no match found
        return errorMessage;
      },

      // Fetch user stats from database
      fetchUserStats: async () => {
        const { user } = get();
        if (!user?.id) return;

        try {
          // Get user's basic stats
          const { data: userData, error: userError } = await supabase
            .from('whs-users')
            .select('high_score, total_games_played, total_stars, last_played')
            .eq('id', user.id)
            .single();

          if (userError) {
            return;
          }

          // Get user's current monthly rank
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1;

          const { data: rankData, error: rankError } = await supabase
            .rpc('get_enhanced_leaderboard', {
              p_year: currentYear,
              p_month: currentMonth,
              p_limit: 1000
            });

          let monthlyRank = null;
          if (!rankError && rankData) {
            const userRank = rankData.find(entry => entry.user_id === user.id);
            monthlyRank = userRank?.rank || null;
          }

          // Update user stats
          set({
            userStats: {
              highScore: userData?.high_score || 0,
              totalGamesPlayed: userData?.total_games_played || 0,
              totalStars: userData?.total_stars || 0,
              monthlyRank,
              lastPlayed: userData?.last_played || null,
            }
          });

        } catch (error) {
        }
      },

      // Update user profile
      updateProfile: async (updates) => {
        const { user } = get();
        if (!user?.id) return { success: false, error: 'No user logged in' };

        try {
          set({ isLoading: true, error: null });

          const { error } = await supabase
            .from('whs-users')
            .update(updates)
            .eq('id', user.id);

          if (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          // Refresh user stats
          await get().fetchUserStats();
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Process game completion
      processGameCompletion: async (gameData) => {
        const { user } = get();
        if (!user?.id) {
          return { success: false, error: 'No user logged in' };
        }

        try {
          // Don't set global loading state as it causes App.js to show loading screen
          // and unmount the GameScreen component
          // set({ isLoading: true, error: null });

          // Get user's display name
          const { data: userData } = await supabase
            .from('whs-users')
            .select('display_name')
            .eq('id', user.id)
            .single();

          const displayName = userData?.display_name || user.email;

          // Call the stored procedure to process game completion
          const { data, error } = await supabase
            .rpc('process_game_completion', {
              p_user_id: user.id,
              p_display_name: displayName,
              p_score: gameData.score,
              p_time_left: gameData.timeLeft,
              p_word_count: gameData.wordCount,
              p_words_found: gameData.wordsFound,
              p_game_duration: gameData.gameDuration || 300, // Default 5 minutes
            });

          if (error) {
            // Don't set global loading state
            // set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          // Refresh user stats
          await get().fetchUserStats();
          
          // Don't set global loading state
          // set({ isLoading: false });

          return { 
            success: true, 
            data: data?.[0] || {} // Return the first result from the procedure
          };
        } catch (error) {
          // Don't set global loading state
          // set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Get user's recent scores
      getRecentScores: async (limit = 10) => {
        const { user } = get();
        if (!user?.id) return [];

        try {
          const { data, error } = await supabase
            .from('whs-game_scores')
            .select('score, time_left, word_count, words_found, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

          if (error) {
            return [];
          }

          return data || [];
        } catch (error) {
          return [];
        }
      },

      // Get user's stars/achievements
      getUserStars: async () => {
        const { user } = get();
        if (!user?.id) return [];

        try {
          const { data, error } = await supabase
            .from('whs-user_stars')
            .select('year, month, star_type, awarded_at')
            .eq('user_id', user.id)
            .order('year', { ascending: false })
            .order('month', { ascending: false });

          if (error) {
            return [];
          }

          return data || [];
        } catch (error) {
          return [];
        }
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        userStats: state.userStats,
      }),
    }
  )
);

export default useUserStore;
