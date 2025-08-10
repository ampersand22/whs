import React from "react";
import { View, Image } from "react-native";

const Logo = ({
  size = "large",
  marginBottom = 20,
  testID = "logo-container",
}) => {
  const dimensions = {
    large: { width: 400, height: 230 },
    medium: { width: 340, height: 195 },
    small: { width: 300, height: 180 },
  };

  return (
    <View style={{ alignItems: "center", marginBottom }} data-testid={testID}>
      <View
        style={{
          borderRadius: 12,
          overflow: "hidden",
          ...dimensions[size],
        }}
      >
        <Image
          source={require("../../assets/worzzle2.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "cover",
          }}
          data-testid="app-logo"
        />
      </View>
    </View>
  );
};

export default Logo;
