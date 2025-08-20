import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; // Import for eye icon
import { useUser } from "../context/UserContext";
import { RegisterUserDto } from "../types/auth";
import { createUser } from "../API/api";
import DoodlesBackgroundBlue from "../../components/doodlesbackgroundBlue";
import * as SecureStore from "expo-secure-store";

export default function RegisterScreen() {
  const router = useRouter();
  const { setContextUsername } = useUser();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [progress, setProgress] = useState<number>(60); // Simulate progress (in percentage)
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidUsername, setinvalidUsername] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Sending inn epost, username and password. following api's demands for user info
  const handleRegister = async () => {
    const user: RegisterUserDto = {
      username: username,
      email: email,
      password: password,
    };

    try {
      // Nullstill feil f�rst
      setInvalidEmail(false);
      setInvalidPassword(false);
      setinvalidUsername(false);

      //Check for @ in email
      if (!user.email.includes("@")) {
        setInvalidEmail(true);
      }

      //check for characters in password (change later to certain length together with api)
      if (user.password.length < 4) {
        setInvalidPassword(true);
      }

      if (user.username.length < 4) {
        setinvalidUsername(true);
      }
      //Set user context for further registration functionality by identical name
      setContextUsername(user.username);
      setErrorMessage("");

      //Send post request with body of RegisterUserDto
      const data = await createUser(user);
      const token = data.token;

      await SecureStore.setItemAsync("token", token);

      if (data && token) {
        console.log("Token fra register", token);
        router.push("/registrering/velg-avatar");
      }
    } catch (error: any) {
      console.log("Kunne ikke opprette bruker");
    }
  };

  const handleCancel = () => {
    router.push("/login"); // Navigate back to login screen
  };

  return (
    <DoodlesBackgroundBlue>
      {/* Logo */}
      <Image
        source={require("@/assets/images/iti-transparent.png")} // Update path to actual logo
        style={styles.logo}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Lag en bruker</Text>

        {/* Progress Bar Section */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBarBackground,
              { width: `${40}%`, height: `${200}%` },
            ]} // Light blue background
          >
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%` }, // Dark blue progress bar width
              ]}
            />
          </View>
        </View>

        <Text style={styles.label}>Skriv inn e-post her</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder=""
          style={styles.inputField}
        />

        {invalidEmail && <Text style={styles.errorText}>Ugyldig e-post</Text>}

        <Text style={styles.label}>Skriv inn et brukernavn her</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder=""
          style={styles.inputField}
        />

        {invalidUsername && (
          <Text style={styles.errorText}>Ugyldig brukernavn</Text>
        )}

        <Text style={styles.label}>Skriv inn et passord her</Text>
        <View style={styles.inputContainer}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            placeholder=""
            style={styles.inputField}
          />

          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
            style={styles.eyeIcon}
          >
            <Feather
              name={secureTextEntry ? "eye-off" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {invalidPassword && (
          <Text style={styles.errorText}>Ugyldig passord</Text>
        )}

        <View style={styles.buttonRow}>
          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Avbryt</Text>
          </TouchableOpacity>

          {/* Neste Button */}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Neste</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DoodlesBackgroundBlue>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 50, // Endre litt på størrelse? Ikke 100% riktige dimensjoner fra figma, figma sine virket ikke riktige.
    height: 90,
    bottom: -50,
    left: 290,
    backgroundColor: "#F2F2F2",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  //Placeholder dimensioner
  progressContainer: {
    width: 550,
    height: 8,
    marginBottom: 80,
    alignItems: "center",
  },
  progressBarBackground: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ADD8E6", // Light blue background
    borderRadius: 10,
    bottom: 20,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#003366", // Dark blue fill
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    bottom: 20,
  },
  label: {
    fontSize: 20,
    fontFamily: "sourcesans-pro",
    fontWeight: "600",
    color: "#293059",
    marginBottom: 5,
    alignSelf: "flex-start",
    bottom: 45,
  },
  inputField: {
    width: 353,
    height: 60,
    borderColor: "#527AA7",
    borderWidth: 3,
    borderRadius: 10,
    marginBottom: 30,
    paddingHorizontal: 10,
    backgroundColor: "#F2F2F2",
    bottom: 40,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#F2F2F2",
    paddingVertical: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor: "#527AA7",
    borderWidth: 2,
    top: 10,
  },
  cancelButtonText: {
    color: "#293059",
    fontSize: 24,
    fontFamily: "sourcesans-pro",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#FFCC6A",
    paddingVertical: 12,
    borderRadius: 5,
    width: 168,
    height: 69,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    top: 10,
  },
  buttonText: {
    color: "#293059",
    fontSize: 24,
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%", // Ensures both inputs have full width
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  eyeIcon: {
    position: "absolute", // Absolutely position the icon inside the input field
    right: 10, // Move it to the right
    padding: 10,
    bottom: 80,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    bottom: 70,
    backgroundColor: "#F2F2F2",
  },
});
