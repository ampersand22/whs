import React, { useState } from 'react';
import { View, Platform, Text } from 'react-native';
import Constants from 'expo-constants';

// Only skip in Expo Go (appOwnership === 'expo')
// Dev builds and standalone apps have appOwnership === null or undefined
const isExpoGo = Constants.appOwnership === 'expo';

let BannerAd = null;
let BannerAdSize = null;
let TestIds = null;

if (!isExpoGo) {
  try {
    const ads = require('react-native-google-mobile-ads');
    BannerAd = ads.BannerAd;
    BannerAdSize = ads.BannerAdSize;
    TestIds = ads.TestIds;
  } catch (e) {
    // Native module not available
  }
}

const AD_UNIT_IDS = {
  ios: 'ca-app-pub-8805412373618815/1818270042',
  android: 'ca-app-pub-8805412373618815/1091527643',
};

const getAdUnitId = () => {
  if (__DEV__) {
    return TestIds?.BANNER || 'ca-app-pub-3940256099942544/2934735716';
  }
  return Platform.OS === 'ios' ? AD_UNIT_IDS.ios : AD_UNIT_IDS.android;
};

export default function BannerAdComponent() {
  // TODO: Remove this line after screenshots are done
  return null;

  const [adError, setAdError] = useState(null);
  const [adLoaded, setAdLoaded] = useState(false);

  // Skip ads in Expo Go or if module failed to load
  if (isExpoGo || !BannerAd) {
    return null;
  }

  if (adError) {
    // Show error in dev, hide in production
    if (__DEV__) {
      return (
        <View style={{ padding: 4, backgroundColor: '#ffcccc', alignItems: 'center' }}>
          <Text style={{ fontSize: 10, color: 'red' }}>Ad error: {adError}</Text>
        </View>
      );
    }
    return null;
  }

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <BannerAd
        unitId={getAdUnitId()}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => setAdLoaded(true)}
        onAdFailedToLoad={(error) => {
          setAdError(error?.message || 'Unknown error');
        }}
      />
    </View>
  );
}
