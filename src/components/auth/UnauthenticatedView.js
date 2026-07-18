import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Card, Button, Text } from "react-native-paper";
import Logo from "../ui/Logo";
import { isTablet } from "../../constants/responsive";

const UnauthenticatedView = ({ 
  onSignUp, 
  onSignIn 
}) => {
  const { width, height } = useWindowDimensions();
  const tablet = isTablet(width, height);

  const buttonHeight = tablet ? 60 : 48;
  const buttonFontSize = tablet ? 18 : 14;
  const maxButtonWidth = tablet ? 420 : undefined;

  return (
    <View style={tablet ? { flex: 1, justifyContent: 'center', alignItems: 'center' } : { flex: 1 }}>
      {/* Logo */}
      <Logo size={tablet ? "large" : "large"} marginBottom={tablet ? 80 : 40} />

      {/* Auth Buttons */}
      <View 
        style={{ 
          marginBottom: 20, 
          width: '100%',
          maxWidth: maxButtonWidth,
          alignSelf: 'center',
        }} 
        data-testid="auth-buttons"
      >
        <Button
          mode="contained"
          onPress={onSignUp}
          style={{ marginBottom: tablet ? 24 : 12, height: buttonHeight }}
          contentStyle={{ height: buttonHeight }}
          labelStyle={{ fontSize: buttonFontSize }}
          data-testid="sign-up-button"
        >
          Create Account
        </Button>

        <Button
          mode="outlined"
          onPress={onSignIn}
          style={{ 
            marginBottom: 12, 
            height: buttonHeight,
            borderColor: 'white'
          }}
          contentStyle={{ height: buttonHeight }}
          labelStyle={{ color: 'white', fontSize: buttonFontSize }}
          data-testid="sign-in-button"
        >
          Sign In
        </Button>
      </View>

      {/* Copyright Footer */}
      <View style={{
        marginTop: 'auto',
        paddingTop: 20,
        paddingBottom: 20,
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
    </View>
  );
};

export default UnauthenticatedView;
