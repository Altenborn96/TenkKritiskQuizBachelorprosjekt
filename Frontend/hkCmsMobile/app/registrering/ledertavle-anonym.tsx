import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";
import { UserAnonymousStatus } from "../types/auth";
import { setAnonymousUser } from "../API/api";
import * as SecureStore from "expo-secure-store";

export default function AnonymityScreen() {
  const router = useRouter();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [username, setUsername] = useState("");

  const { contextUsername } = useUser();

  useEffect(() => {
    console.log("brukernavn: ", username);
  }, [username]);

  useEffect(() => {
    setUsername(contextUsername);
  }, [contextUsername]);

  const handleClick = async () => {
    try {
      const user: UserAnonymousStatus = {
        isAnonymous: isAnonymous,
        username: contextUsername,
      };
      console.log(isAnonymous);

      const token = await SecureStore.getItemAsync("token");

      await setAnonymousUser(user, token);

      router.push("/registrering/registrering-ferdig");
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <View style={styles.container}>
      {/* Overskrift */}
      <Text style={styles.title}>Ønsker du å være anonym?</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: "70%" }]} />
        </View>
      </View>

      {/* Info-boks */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          I denne appen vil man få oversikt over andres poengsum. Du vil få
          oversikt over dette i en ledertavle. Ønsker du å være anonym på denne
          ledertavlen?
        </Text>
      </View>

      {/* Checkbox for anonymitet */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setIsAnonymous(!isAnonymous)}
      >
        <View style={[styles.checkbox, isAnonymous && styles.checkboxChecked]}>
          {isAnonymous && <Feather name="check" size={24} color="white" />}
        </View>
        <Text style={styles.checkboxLabel}>
          Ja, jeg ønsker å være anonym på ledertavlen
        </Text>
      </TouchableOpacity>

      {/* Neste-knapp */}
      <TouchableOpacity style={styles.button} onPress={handleClick}>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2C3E50",
  },
  progressContainer: {
    width: "100%",
    height: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  progressBarBackground: {
    width: "80%",
    height: "100%",
    backgroundColor: "#ADD8E6",
    borderRadius: 5,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#003366",
    borderRadius: 5,
  },
  infoBox: {
    width: "90%",
    backgroundColor: "#E3EEFC",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2C3E50",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#2C3E50",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2C3E50",
    backgroundColor: "#E3EEFC",
    marginBottom: 20,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: "#2C3E50",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#2C3E50",
  },
  checkboxLabel: {
    fontSize: 16,
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
