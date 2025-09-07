import "dotenv/config";

export default {
  expo: {
    name: "Worrzle",
    slug: "worrzle",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    description:
      "A competitive word-finding game. Find words on a 5x5 letter grid and compete monthly for the highest score!",
    keywords: [
      "word game",
      "puzzle",
      "competition",
      "leaderboard",
      "words",
      "worrzle",
    ],
    primaryColor: "#6B46C1",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#6B46C1",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.worrzle.app",
      buildNumber: "13",
      runtimeVersion: "1.0.2",
      infoPlist: {
        NSUserTrackingUsageDescription:
          "This app uses advertising ID for personalized ads and analytics to improve your gaming experience.",
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      // "expo-dev-client", // Only for development builds
    ],
    android: {
      package: "com.worrzle.app",
      versionCode: 13,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#6B46C1",
      },
      edgeToEdgeEnabled: true,
      permissions: ["INTERNET", "ACCESS_NETWORK_STATE"],
      runtimeVersion: "1.0.2",
      proguard: {
        obfuscate: true,
        shrinkResources: true,
      },
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "a329fc47-12f7-4466-8fa6-781ed75ea686",
      },
    },
  },
};
