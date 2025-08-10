import React, { useState } from 'react';
import { View, Text } from 'react-native';

// Simple AdManager without dynamic imports to avoid Metro issues
class AdManager {
  static gameCount = 0;
  static GAMES_BETWEEN_ADS = 3; // Show ad every 3 games

  // Initialize ads (placeholder)
  static async initialize() {
    console.log('AdManager initialized (placeholder mode)');
  }

  // Show interstitial ad after certain number of games
  static async showInterstitialAd() {
    try {
      this.gameCount++;
      console.log(`Game count: ${this.gameCount}/${this.GAMES_BETWEEN_ADS}`);
      
      if (this.gameCount >= this.GAMES_BETWEEN_ADS) {
        console.log('Would show interstitial ad here (placeholder mode)');
        this.gameCount = 0; // Reset counter
      }
    } catch (error) {
      console.log('Error in ad logic:', error);
    }
  }

  // Show rewarded ad (placeholder)
  static async showRewardedAd() {
    console.log('Would show rewarded ad here (placeholder mode)');
    return false;
  }
}

// Banner Ad Component (placeholder)
export const BannerAd = ({ style }) => {
  return (
    <View style={[{ 
      alignItems: 'center', 
      marginVertical: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)'
    }, style]}>
      <Text style={{ 
        color: 'rgba(255, 255, 255, 0.7)', 
        fontSize: 12,
        fontStyle: 'italic'
      }}>
        [Ad Placeholder]
      </Text>
    </View>
  );
};

export default AdManager;
