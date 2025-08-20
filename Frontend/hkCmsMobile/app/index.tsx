import { useEffect } from "react";
import { View, Image, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import DoodlesBackgroundOrange from "../components/doodlesbackgroundOrange";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/login");
    }, 3000);
  }, []);

  return (
    <DoodlesBackgroundOrange>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/Vaerkritisk.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.text}>Et samarbeidsprosjekt mellom</Text>

      <View style={styles.rowContainer}>
        <Image
          source={require("../assets/images/Kristiania.png")}
          style={styles.smallLogo}
        />
        <Image
          source={require("../assets/images/Oslomet.png")}
          style={styles.smallLogo}
        />
      </View>
    </DoodlesBackgroundOrange>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 350,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  logoContainer: {
    backgroundColor: "#F2F2F2",
    padding: 10,
    alignSelf: "center",
  },
  text: {
    fontSize: 24,
    fontFamily: "sourcesans-pro",
    fontWeight: "600", //placeholder semibold
    color: "#000",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  smallLogo: {
    width: 130, //dimensjoner til logoene fra figma. Begge logoer hadde forskjellige dimensjoner, men vet ikke om det rengs å lage container til hver av dem.
    height: 49,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  loader: {
    marginTop: 20,
  },
});
