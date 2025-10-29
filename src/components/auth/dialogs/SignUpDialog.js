import React, { useState, useRef } from "react";
import { ScrollView } from "react-native";
import { Portal, Dialog, Button, TextInput } from "react-native-paper";
import { getTranslation } from "../../../constants/translations";

const SignUpDialog = ({
  visible,
  onDismiss,
  displayName,
  setDisplayName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSignUp,
  loading,
  language = "english"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={onDismiss} 
        data-testid="sign-up-dialog"
        style={{ marginTop: -100 }}
      >
        <Dialog.Title>{getTranslation("createAccount", language)}</Dialog.Title>
        <Dialog.Content>
          <ScrollView 
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            style={{ maxHeight: 400 }}
            nestedScrollEnabled={true}
          >
            <TextInput
              label={getTranslation("displayName", language)}
              value={displayName}
              onChangeText={setDisplayName}
              style={{ marginBottom: 12 }}
              data-testid="display-name-input"
              returnKeyType="next"
            />
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
              style={{ marginBottom: 12 }}
              data-testid="password-input"
              returnKeyType="next"
              right={
                <TextInput.Icon 
                  icon={showPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <TextInput
              label={getTranslation("confirmPassword", language)}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              data-testid="confirm-password-input"
              returnKeyType="done"
              onSubmitEditing={onSignUp}
              onFocus={scrollToBottom}
              right={
                <TextInput.Icon 
                  icon={showConfirmPassword ? "eye-off" : "eye"} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} data-testid="cancel-sign-up-button">
            {getTranslation("cancel", language)}
          </Button>
          <Button onPress={onSignUp} loading={loading} data-testid="create-account-button">
            {getTranslation("createAccountCta", language)}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default SignUpDialog;
