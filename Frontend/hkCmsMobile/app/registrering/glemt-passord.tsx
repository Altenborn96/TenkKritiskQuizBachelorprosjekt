import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import DoodlesBackgroundBlue from "../../components/doodlesbackgroundBlue";
import { postPasswordResetRequest } from "../API/api";
import { ResetPasswordRequest } from "../types/auth";

const GlemtPassordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSendEmail = async () => {
    // Handle email sending logic

    const resetPasswordRequest: ResetPasswordRequest = {
      email: email,
    };

    try {
      const data = await postPasswordResetRequest(resetPasswordRequest);

      console.log(JSON.stringify(data));
      setShowPopup(true);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleClosePopup = async () => {
    setShowPopup(false);
  };

  return (
    <DoodlesBackgroundBlue>
      {/* Logo */}
      <Image
        source={require("@/assets/images/iti-transparent.png")} // Update path to actual logo
        style={styles.logo}
      />
      <SafeAreaView style={styles.container}>
        {/* Back Button */}
        <Text style={styles.header}>Glemt passord</Text>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            style={styles.backButtonIcon}
            source={require("@/assets/images/backbutton.png")}
          />
        </TouchableOpacity>

        {/* Blue Box */}
        <View style={styles.blueBox}>
          <Text style={styles.blueBoxText}>
            Vi sender deg instruksjoner om hvordan {"\n"} {"\n"} du endrer
            passord på mail.
          </Text>
        </View>

        {/* Email input */}
        <Text style={styles.label}>E-postadresse</Text>
        <TextInput
          style={styles.input}
          placeholder="Skriv inn e-postadressen"
          value={email}
          onChangeText={setEmail}
        />

        {/* Send button */}
        <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
          <Text style={styles.buttonText}>Send</Text>
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
                <Text style={styles.popupTitle}>Vi har sendt deg en mail!</Text>
                <Text style={styles.popupText}>
                  Vi har sendt en mail til {email}. Fikk du den ikke? Sjekk spam
                  mappen eller prøv igjen.
                </Text>
                <Button title="Ok" onPress={handleClosePopup} />
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    </DoodlesBackgroundBlue>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: -20,
    left: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 32,
    marginBottom: 30,
    fontFamily: "sourcesans-pro",
    fontWeight: "600",
    color: "#293059",
    bottom: 30,
  },
  blueBox: {
    backgroundColor: "#E3EEFC",
    justifyContent: "center",
    borderRadius: 15,
    borderBlockColor: "#293059",
    borderWidth: 3,
    marginBottom: 20,
    width: 365,
    height: 155,
    bottom: 30,
  },
  blueBoxText: {
    textAlign: "center",
    fontFamily: "sourcesans-pro",
    fontSize: 20,
    color: "#293059",
  },
  label: {
    fontSize: 20,
    color: "#293059",
    fontFamily: "sourcesans-pro",
    fontWeight: "600",
    marginBottom: 10,
    alignSelf: "flex-start",
    left: 25,
    paddingTop: 40,
    marginTop: 10,
    bottom: 70,
  },
  input: {
    width: 353,
    height: 50,
    borderColor: "#527AA7",
    borderWidth: 3,
    borderRadius: 10,
    marginBottom: 30,
    bottom: 70,
  },
  button: {
    width: 274,
    height: 69,
    backgroundColor: "#FFCC6A",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    bottom: 70,
  },
  buttonText: {
    fontSize: 24,
    fontFamily: "sourcesans-pro", // placeholder
    fontWeight: "600", // 600 fontweight = semibold ifølge chatgpt. (placeholder)
    color: "black",
  },
  backButtonIcon: {
    //hvis det trengs styling
  },
  logo: {
    width: 50, // Endre litt på størrelse? Ikke 100% riktige dimensjoner fra figma, figma sine virket ikke riktige.
    height: 80,
    bottom: -50,
    left: 120,
    backgroundColor: "#F2F2F2",
    alignSelf: "center",
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

export default GlemtPassordScreen;
