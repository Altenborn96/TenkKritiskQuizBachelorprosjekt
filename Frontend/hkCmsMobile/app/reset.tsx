import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import { ResetPasswordDto } from "./types/auth";
import { useRoute } from "@react-navigation/native";
import { resetPassword } from "./API/api";
import { router } from "expo-router";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [matchingPassword, setMatchingPassword] = useState(false);
  const [shortPassword, setShortPassword] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const route = useRoute();
  const { token } = route.params as { token: string };
  const { email } = route.params as { email: string };

  //dekode token fra backends uri encoding
  const decodedToken = decodeURIComponent(token);

  const resetPasswordDto: ResetPasswordDto = {
    email: email,
    token: decodedToken,
    newPassword: newPassword,
  };

  const handlePress = async () => {
    try {
      if (!shortPassword && matchingPassword) {
        await resetPassword(resetPasswordDto);
        setShowPopup(true);
        console.log(resetPasswordDto);
      }
    } catch (error: any) {
      setShowPopup(false);
      console.log(error.message);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    router.push("/login");
  };

  useEffect(() => {
    if (password.length >= 6 && confirmPassword.length >= 6) {
      setShortPassword(false);
    } else {
      setShortPassword(true);
    }

    if (password == confirmPassword) {
      setNewPassword(password);
      setMatchingPassword(true);
    } else {
      setMatchingPassword(false);
    }
  }, [password, confirmPassword, shortPassword]);

  return (
    <View style={styles.container}>
      <Text style={styles.passwordText}>Skriv inn nytt passord</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder=""
        style={styles.passwordInput}
      ></TextInput>

      <Text>Bekreft nytt passord</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder=""
        style={styles.passwordInput}
      ></TextInput>
      {shortPassword || !matchingPassword ? (
        <Text style={styles.errorMessage}>
          {shortPassword
            ? "Passord må være minst 6 tegn langt"
            : "Passord er ikke like"}
        </Text>
      ) : (
        <Text style={styles.successMessage}>Alt ser bra ut!</Text> // eller ingen melding
      )}

      <TouchableOpacity onPress={handlePress} style={styles.confirmButton}>
        <Text>Bekreft</Text>
      </TouchableOpacity>

      {/* Popup Modal */}
      {showPopup && (
        <Modal
          transparent={true}
          visible={showPopup}
          animationType="fade"
          onRequestClose={handleClosePopup}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popup}>
              <Text style={styles.popupTitle}>
                Ditt passord har blitt endret!
              </Text>
              <Text style={styles.popupText}>
                Logg inn med ditt nye passord
              </Text>
              <Button title="Tilbake til logg inn" onPress={handleClosePopup} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  passwordText: {},
  passwordInput: {
    backgroundColor: "beige",
    width: "100%",
    height: 40,
    borderColor: "#B7B7B7",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "beige",
    width: 100,
    height: 40,
    borderColor: "#B7B7B7",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  errorMessage: {
    color: "red",
  },
  successMessage: {
    color: "green",
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  popupText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
});
