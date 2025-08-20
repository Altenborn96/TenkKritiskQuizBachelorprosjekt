import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { sendFeedBack } from "../API/api";
import { FeedBackDto } from "../types/settings";
import * as SecureStore from "expo-secure-store";

export default function KommentarScreen() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [message, setMessage] = useState("");

  // Handle the "Send inn" button click
  const handleSendFeedback = async () => {
    try {
      if (idea === "" || message === "") {
        Alert.alert("Feil", "Vennligst fyll ut alle feltene");
      } else {
        const feedbackDto: FeedBackDto = {
          identifier: "COMMENT",
          suggestionComment: idea,
          generalComment: message,
        };

        const token = await SecureStore.getItemAsync("token");

        const data = await sendFeedBack(feedbackDto, token);
        console.log(JSON.stringify(data));

        router.push("/instillinger/takktilbakemelding");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    console.log(idea, message);
  }, [idea, message]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Tilbake</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Kommentar</Text>

      {/* Text Input for feedback idea */}
      <Text style={styles.label}>
        Har du en god idé til tematikk som vi kan legge til i applikasjonen
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Skriv din idé her"
        value={idea}
        onChangeText={setIdea}
        multiline
      />

      {/* Text Input for additional message */}
      <Text style={styles.label}>Noe du har på hjertet?</Text>
      <TextInput
        style={styles.input}
        placeholder="Skriv din kommentar her"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      {/* Send Button */}
      <TouchableOpacity style={styles.button} onPress={handleSendFeedback}>
        <Text style={styles.buttonText}>Send inn</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  backButton: {
    marginBottom: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 100,
    borderColor: "#B7B7B7",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#FFB703",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
