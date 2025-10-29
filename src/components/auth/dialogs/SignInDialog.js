import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Portal, Dialog, Button, TextInput } from "react-native-paper";
import { getTranslation } from "../../../constants/translations";

const SignInDialog = ({
  visible,
  onDismiss,
  email,
  setEmail,
  password,
  setPassword,
  onSignIn,
  loading,
  language = "english"
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={onDismiss} 
        data-testid="sign-in-dialog"
        style={{ marginTop: -50 }}
      >
        <Dialog.Title>{getTranslation("signIn", language)}</Dialog.Title>
        <Dialog.Content>
          <ScrollView 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            style={{ maxHeight: 250 }}
            nestedScrollEnabled={true}
          >
            <TextInput
              label={getTranslation("email", language)}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ marginBottom: 12 }}
              data-testid="email-input"
              returnKeyType="next"
            />
            <TextInput
              label={getTranslation("password", language)}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              data-testid="password-input"
              returnKeyType="done"
              onSubmitEditing={onSignIn}
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} data-testid="cancel-sign-in-button">
            {getTranslation("cancel", language)}
          </Button>
          <Button onPress={onSignIn} loading={loading} data-testid="sign-in-submit-button">
            {getTranslation("signInCta", language)}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default SignInDialog;
