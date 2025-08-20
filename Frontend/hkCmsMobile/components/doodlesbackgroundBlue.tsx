import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function DoodlesBackgroundBlue({ children }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/Doodles2.png")}
        style={styles.background}
        resizeMode="cover"
      />
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
  },
});
