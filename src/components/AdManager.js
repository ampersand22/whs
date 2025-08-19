import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';

// Try to import AdMob, but handle gracefully if it fails
let GoogleBannerAd, BannerAdSize, TestIds, mobileAds;
let adMobAvailable = false;

try {
  const adMobModule = require('react-native-google-mobile-ads');
  GoogleBannerAd = adMobModule.BannerAd;
  BannerAdSize = adMobModule.BannerAdSize;
  TestIds = adMobModule.TestIds;
  mobileAds = adMobModule.default;
  adMobAvailable = true;
  console.log('AdMob module loaded successfully');
  console.log('Available exports:', Object.keys(adMobModule));
} catch (error) {
  console.log('AdMob module not available:', error.message);
  adMobAvailable = false;
}

// Ad Unit IDs - using test IDs for development
const BANNER_AD_UNIT_ID = __DEV__ 
  ? (TestIds?.BANNER || 'ca-app-pub-3940256099942544/6300978111')
  : Platform.select({
      ios: process.env.ADMOB_IOS_BANNER_ID || 'ca-app-pub-8805412373618815/1818270042',
      android: process.env.ADMOB_ANDROID_BANNER_ID || 'ca-app-pub-8805412373618815/1091527643',
    });

class AdManager {
  static gameCount = 0;
  static GAMES_BETWEEN_ADS = 3;
  static isInitialized = false;

  // Initialize ads
  static async initialize() {
    try {
      if (this.isInitialized) return;
      
      if (!adMobAvailable) {
        console.log('AdMob not available, skipping initialization');
        this.isInitialized = true;
        return;
      }
      
      console.log('Initializing AdMob...');
      
      if (mobileAds) {
        await mobileAds().initialize();
        console.log('AdMob initialized successfully');
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing AdMob:', error);
      this.isInitialized = true;
    }
  }

  // Placeholder methods for interstitial and rewarded ads
  static async showInterstitialAd() {
    this.gameCount++;
    console.log(`Game count: ${this.gameCount}/${this.GAMES_BETWEEN_ADS}`);
    
    if (this.gameCount >= this.GAMES_BETWEEN_ADS) {
      console.log('Would show interstitial ad here');
      this.gameCount = 0;
      return true;
    }
    return false;
  }

  static async showRewardedAd() {
    console.log('Would show rewarded ad here');
    return false;
  }

  static isRewardedAdReady() {
    return false;
  }
}

// Banner Ad Component
export const BannerAd = ({ style }) => {
  const [adError, setAdError] = useState(false);

  if (!adMobAvailable || !GoogleBannerAd) {
    return (
      <View style={[{ alignItems: 'center', marginVertical: 10 }, style]}>
        <View style={{ 
          alignItems: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: 8,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }}>
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: 12,
            fontStyle: 'italic'
          }}>
            [Ads not available]
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[{ alignItems: 'center', marginVertical: 10 }, style]}>
      {!adError ? (
        <GoogleBannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdLoaded={() => {
            console.log('Banner ad loaded');
          }}
          onAdFailedToLoad={(error) => {
            console.log('Banner ad failed to load:', error);
            setAdError(true);
          }}
        />
      ) : (
        <View style={{ 
          alignItems: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: 8,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)'
        }}>
          <Text style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: 12,
            fontStyle: 'italic'
          }}>
            [Ad unavailable]
          </Text>
        </View>
      )}
    </View>
  );
};

export default AdManager;
