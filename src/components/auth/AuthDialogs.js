import React from "react";
import SignUpDialog from "./dialogs/SignUpDialog";
import SignInDialog from "./dialogs/SignInDialog";
import HowToPlayDialog from "./dialogs/HowToPlayDialog";

const AuthDialogs = ({
  // Sign Up Dialog
  showSignUp,
  setShowSignUp,
  displayName,
  setDisplayName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSignUp,
  
  // Sign In Dialog
  showLogIn,
  setShowLogIn,
  handleSignIn,
  
  // How to Play Dialog
  showHowToPlay,
  setShowHowToPlay,
  
  // Loading state
  loading,
  
  // Language
  language = "english"
}) => {
  return (
    <>
      <SignUpDialog
        visible={showSignUp}
        onDismiss={() => setShowSignUp(false)}
        displayName={displayName}
        setDisplayName={setDisplayName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onSignUp={handleSignUp}
        loading={loading}
        language={language}
      />

      <SignInDialog
        visible={showLogIn}
        onDismiss={() => setShowLogIn(false)}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSignIn={handleSignIn}
        loading={loading}
        language={language}
      />

      <HowToPlayDialog
        visible={showHowToPlay}
        onDismiss={() => setShowHowToPlay(false)}
        language={language}
      />
    </>
  );
};

export default AuthDialogs;
