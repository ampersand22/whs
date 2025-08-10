import 'dotenv/config';

export default {
  expo: {
    name: "Worzzle",
    slug: "worzzle",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#6B46C1"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#6B46C1"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-dev-client",
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-3940256099942544~3347511713", // Test ID - replace with your real ID
          iosAppId: "ca-app-pub-3940256099942544~1458002511", // Test ID - replace with your real ID
        }
      ]
    ],
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    }
  }
};
