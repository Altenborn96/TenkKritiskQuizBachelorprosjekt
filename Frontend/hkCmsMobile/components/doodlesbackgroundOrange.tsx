import React from "react";
import { View, ImageBackground, StyleSheet } from "react-native";

export default function DoodlesBackgroundOrange({ children }) {
  return (
    <ImageBackground
      source={require("../assets/images/Doodles1.png")} // Update path if needed 
      style={styles.background}
    >
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
