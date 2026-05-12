import React from 'react';
import { View, Platform } from 'react-native';
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
  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <BannerAd
        unitId={getAdUnitId()}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
}
