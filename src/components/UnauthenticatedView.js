import React from "react";
import { View } from "react-native";
import { Card, Title, Paragraph, Button, Text } from "react-native-paper";
import Logo from "./Logo";

const UnauthenticatedView = ({ 
  onSignUp, 
  onSignIn 
}) => {
  return (
    <>
      {/* Logo */}
      <Logo size="large" marginBottom={40} />

      {/* Auth Buttons */}
      <View style={{ marginBottom: 20 }} data-testid="auth-buttons">
        <Button
          mode="contained"
          onPress={onSignUp}
          style={{ marginBottom: 12, height: 48 }}
          contentStyle={{ height: 48 }}
          data-testid="sign-up-button"
        >
          Create Account
        </Button>

        <Button
          mode="outlined"
          onPress={onSignIn}
          style={{ 
            marginBottom: 12, 
            height: 48,
            borderColor: 'white'
          }}
          contentStyle={{ height: 48 }}
          labelStyle={{ color: 'white' }}
          data-testid="sign-in-button"
        >
          Sign In
        </Button>
      </View>

      {/* Copyright Footer */}
      <View style={{
        marginTop: 'auto',
        paddingTop: 20,
        paddingBottom: 20, // Reduced padding since support button is positioned higher
        alignItems: 'center'
      }}>
        <Text style={{
          fontSize: 12,
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center'
        }}>
          © 2025 UA Interactive
        </Text>
      </View>
    </>
  );
};

export default UnauthenticatedView;
