import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RegistrationComplete() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Sjekkmark-ikon */}
      <View style={styles.checkmarkContainer}>
        <Feather name="check" size={80} color="white" />
      </View>

      {/* Registreringsfullført tekst */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>Registrering fullført</Text>
      </View>

      {/* Neste-knapp */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.buttonText}>Neste</Text>
      </TouchableOpacity>
    </View>
  );
}

// **STYLES**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    position: "absolute",
    top: 50,
  },
  checkmarkContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4C9F85",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  textContainer: {
    borderWidth: 2,
    borderColor: "#2C3E50",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  button: {
    backgroundColor: "#FFB703",
    paddingVertical: 12,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});