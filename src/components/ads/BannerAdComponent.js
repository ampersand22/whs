import React, { useState, useEffect } from 'react';
import { View, Platform, Text } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const AD_UNIT_IDS = {
  ios: 'ca-app-pub-8805412373618815/1818270042',
  android: 'ca-app-pub-8805412373618815/1091527643',
};

// Use test IDs in development, real IDs in production
const getAdUnitId = () => {
  if (__DEV__) {
    return TestIds.BANNER;
  }
  return Platform.OS === 'ios' ? AD_UNIT_IDS.ios : AD_UNIT_IDS.android;
};

export default function BannerAdComponent() {
  const [adError, setAdError] = useState(null);

  if (adError && __DEV__) {
    return (
      <View style={{ padding: 8, backgroundColor: '#ffcccc', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, color: 'red' }}>{adError}</Text>
      </View>
    );
  }

  if (adError) {
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
        onAdFailedToLoad={(error) => {
          setAdError('Ad failed: ' + error.message);
        }}
      />
    </View>
  );
}
