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
            console.error('Error getting session:', error);
            set({ error: error.message, isLoading: false });
            return;
          }

          if (session?.user) {
            await get().setUserSession(session);
          }
          
          set({ isLoading: false });
        } catch (error) {
          console.error('Error initializing auth:', error);
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
          console.error('Error setting user session:', error);
          set({ error: error.message, isLoading: false });
        }
      },

      // Sign up new user
      signUp: async (email, password, displayName) => {
        try {
          set({ isLoading: true, error: null });

          // Sign up with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (authError) {
            set({ error: authError.message, isLoading: false });
            return { success: false, error: authError.message };
          }

          // If user is created, add to our users table
          if (authData.user) {
            const { error: dbError } = await supabase
              .from('whs-users')
              .insert({
                id: authData.user.id,
                email: authData.user.email,
                display_name: displayName,
                password_hash: 'handled_by_supabase_auth', // Placeholder since Supabase handles this
              });

            if (dbError) {
              console.error('Error creating user profile:', dbError);
              // Don't fail the signup if profile creation fails
            }
          }

          set({ isLoading: false });
          return { success: true, user: authData.user };
        } catch (error) {
          console.error('Error signing up:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
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
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          await get().setUserSession(data.session);
          return { success: true, user: data.user };
        } catch (error) {
          console.error('Error signing in:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
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
          console.error('Error signing out:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
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
            console.error('Error fetching user stats:', userError);
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
          console.error('Error fetching user stats:', error);
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
          console.error('Error updating profile:', error);
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Process game completion
      processGameCompletion: async (gameData) => {
        const { user } = get();
        if (!user?.id) return { success: false, error: 'No user logged in' };

        try {
          set({ isLoading: true, error: null });

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
            console.error('Error processing game completion:', error);
            set({ error: error.message, isLoading: false });
            return { success: false, error: error.message };
          }

          // Refresh user stats
          await get().fetchUserStats();
          set({ isLoading: false });

          return { 
            success: true, 
            data: data?.[0] || {} // Return the first result from the procedure
          };
        } catch (error) {
          console.error('Error processing game completion:', error);
          set({ error: error.message, isLoading: false });
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
            console.error('Error fetching recent scores:', error);
            return [];
          }

          return data || [];
        } catch (error) {
          console.error('Error fetching recent scores:', error);
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
            console.error('Error fetching user stars:', error);
            return [];
          }

          return data || [];
        } catch (error) {
          console.error('Error fetching user stars:', error);
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
