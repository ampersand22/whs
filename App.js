import React, { useEffect, useState } from "react";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { View, Text, Dimensions } from "react-native";

// Screens
import StartScreen from "./src/screens/StartScreen";
import GameScreen from "./src/screens/GameScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

// Store
import useUserStore from "./src/stores/userStore";

// Responsive utilities
import { isTablet } from "./src/utils/responsive";

// Ad Manager
import AdManager from "./src/components/AdManager";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "rgb(103, 80, 164)",
    onPrimary: "rgb(255, 255, 255)",
  },
};

const Stack = createStackNavigator();

function AppNavigator() {
  const { initialize, isLoading } = useUserStore();
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  // Initialize the user store and ads when app starts
  useEffect(() => {
    initialize();
    AdManager.initialize();
  }, []);

  // Handle orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
  }, []);

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        data-testid="app-loading"
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen
          name="Start"
          component={StartScreen}
          options={{
            title: "Word Hunt",
          }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            title: "Game",
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Profile",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor="#6200ea" />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
