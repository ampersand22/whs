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
      bundleIdentifier: "com.worrzle.app", // You can change this to your preferred bundle ID
      buildNumber: "5",
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
      "expo-dev-client",
      [
        "react-native-google-mobile-ads",
        {
          androidAppId:
            process.env.ADMOB_ANDROID_APP_ID ||
            "ca-app-pub-3940256099942544~3347511713",
          iosAppId:
            process.env.ADMOB_IOS_APP_ID ||
            "ca-app-pub-3940256099942544~1458002511",
        },
      ],
    ],
    updates: {
      url: "https://u.expo.dev/a329fc47-12f7-4466-8fa6-781ed75ea686",
    },
    android: {
      package: "com.worrzle.app", // You can change this to match your iOS bundle ID
      versionCode: 5,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#6B46C1",
      },
      edgeToEdgeEnabled: true,
      permissions: ["INTERNET", "ACCESS_NETWORK_STATE"],
      runtimeVersion: {
        policy: "appVersion",
      },
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: "a329fc47-12f7-4466-8fa6-781ed75ea686",
      },
    },
  },
};
