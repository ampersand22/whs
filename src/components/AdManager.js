import React, { useEffect, useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { 
  BannerAd as GoogleBannerAd, 
  BannerAdSize, 
  TestIds,
  InterstitialAd,
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
  mobileAds
} from 'react-native-google-mobile-ads';

// Ad Unit IDs - using test IDs for development, replace with your real IDs for production
const BANNER_AD_UNIT_ID = __DEV__ 
  ? TestIds.BANNER 
  : Platform.select({
      ios: process.env.ADMOB_IOS_BANNER_ID || 'ca-app-pub-3940256099942544/2934735716',
      android: process.env.ADMOB_ANDROID_BANNER_ID || 'ca-app-pub-3940256099942544/6300978111',
    });

const INTERSTITIAL_AD_UNIT_ID = __DEV__ 
  ? TestIds.INTERSTITIAL 
  : Platform.select({
      ios: process.env.ADMOB_IOS_INTERSTITIAL_ID || 'ca-app-pub-3940256099942544/4411468910',
      android: process.env.ADMOB_ANDROID_INTERSTITIAL_ID || 'ca-app-pub-3940256099942544/1033173712',
    });

const REWARDED_AD_UNIT_ID = __DEV__ 
  ? TestIds.REWARDED 
  : Platform.select({
      ios: process.env.ADMOB_IOS_REWARDED_ID || 'ca-app-pub-3940256099942544/1712485313',
      android: process.env.ADMOB_ANDROID_REWARDED_ID || 'ca-app-pub-3940256099942544/5224354917',
    });

// Create interstitial ad instance
const interstitial = InterstitialAd.createForAdUnitId(INTERSTITIAL_AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: false,
});

// Create rewarded ad instance
const rewardedAd = RewardedAd.createForAdUnitId(REWARDED_AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: false,
});

class AdManager {
  static gameCount = 0;
  static GAMES_BETWEEN_ADS = 3; // Show ad every 3 games
  static isInitialized = false;
  static interstitialLoaded = false;
  static rewardedLoaded = false;

  // Initialize ads
  static async initialize() {
    try {
      if (this.isInitialized) return;
      
      console.log('Initializing AdMob...');
      await mobileAds().initialize();
      
      // Load interstitial ad
      this.loadInterstitialAd();
      
      // Load rewarded ad
      this.loadRewardedAd();
      
      this.isInitialized = true;
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Error initializing AdMob:', error);
    }
  }

  // Load interstitial ad
  static loadInterstitialAd() {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      this.interstitialLoaded = true;
      console.log('Interstitial ad loaded');
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      this.interstitialLoaded = false;
      console.log('Interstitial ad closed');
      // Load a new ad for next time
      interstitial.load();
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Interstitial ad error:', error);
      this.interstitialLoaded = false;
    });

    // Load the ad
    interstitial.load();

    // Return cleanup function
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }

  // Load rewarded ad
  static loadRewardedAd() {
    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      this.rewardedLoaded = true;
      console.log('Rewarded ad loaded');
    });

    const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
      this.rewardedLoaded = false;
      console.log('Rewarded ad closed');
      // Load a new ad for next time
      rewardedAd.load();
    });

    const unsubscribeError = rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Rewarded ad error:', error);
      this.rewardedLoaded = false;
    });

    // Load the ad
    rewardedAd.load();

    // Return cleanup function
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }

  // Show interstitial ad after certain number of games
  static async showInterstitialAd() {
    try {
      this.gameCount++;
      console.log(`Game count: ${this.gameCount}/${this.GAMES_BETWEEN_ADS}`);
      
      if (this.gameCount >= this.GAMES_BETWEEN_ADS && this.interstitialLoaded) {
        console.log('Showing interstitial ad...');
        await interstitial.show();
        this.gameCount = 0; // Reset counter
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      return false;
    }
  }

  // Show rewarded ad
  static async showRewardedAd() {
    try {
      if (!this.rewardedLoaded) {
        console.log('Rewarded ad not loaded yet');
        return false;
      }

      return new Promise((resolve) => {
        const unsubscribeEarned = rewardedAd.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          (reward) => {
            console.log('User earned reward:', reward);
            resolve(true);
          }
        );

        const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
          console.log('Rewarded ad closed');
          unsubscribeEarned();
          unsubscribeClosed();
          resolve(false);
        });

        rewardedAd.show();
      });
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      return false;
    }
  }

  // Check if rewarded ad is available
  static isRewardedAdReady() {
    return this.rewardedLoaded;
  }
}

// Banner Ad Component
export const BannerAd = ({ style }) => {
  const [adError, setAdError] = useState(false);

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
