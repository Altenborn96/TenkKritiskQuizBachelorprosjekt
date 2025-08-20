import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";

import { useRouter } from "expo-router";
import DoodlesBackgroundBlue from "../components/doodlesbackgroundBlue";
import { Feather } from "@expo/vector-icons"; // Import for eye icon
import * as SecureStore from "expo-secure-store";

import { useUser } from "./context/UserContext";
import { loginUser } from "./API/api";
import { LoginUserDto } from "./types/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { contextUsername } = useUser();
  const { setContextUsername } = useUser();
  const { playerId, setPlayerId } = useUser();
  const [playerId2, setPlayerId2] = useState("");
  const [wrongInput, setWrongInput] = useState(false);

  const handleLogin = async () => {
    const user: LoginUserDto = { username: username, password: password };

    try {
      const data = await loginUser(user);

      //console.log("Data: "+JSON.stringify(data));
      if (!data) {
        setWrongInput(true);
        throw new Error("Feil brukernavn eller passord");
      }

      var playerFromData = data.PlayerId;
      //set token to clients localstorage
      await SecureStore.setItemAsync("token", data.token);

      const storedToken = await SecureStore.getItemAsync("token");

      console.log("fra api: ", data);
      console.log("Token lagret: " + storedToken);

      setContextUsername(username);

      setPlayerId(data.playerId);

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const CheckForUser = () => {
      console.log(
        "Username:   " + contextUsername + " || User ID:  " + playerId
      );
    };
    CheckForUser();
  }, []);

  useEffect(() => {
    if (wrongInput == true) {
      console.log("wronginput =" + wrongInput);
    }
  }, [wrongInput]);

  return (
    <DoodlesBackgroundBlue>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require("@/assets/images/iti-transparent.png")} // Update path to actual logo
          style={styles.logo}
        />

        <Text style={styles.title}>Logg inn</Text>

        {/* Username Field */}
        <Text style={styles.label}>Brukernavn</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder=""
            value={username}
            onChangeText={setUsername}
            style={styles.inputField}
          />
        </View>

        {/* Password Field */}
        <Text style={styles.label}>Passord</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder=""
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
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

        {wrongInput && (
          <Text style={styles.errorText}>Feil brukernavn eller passord</Text>
        )}

        {/* Forgot Password */}
        <TouchableOpacity
          style={{ marginBottom: 20, bottom: 25, right: 100 }}
          onPress={() => router.push("/registrering/glemt-passord")}
        >
          <Text style={styles.forgotPassword}>Glemt passord?</Text>
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleLogin}>
          <Text style={styles.nextButtonText}>Neste</Text>
        </TouchableOpacity>

        {/* Separator Line */}
        <View style={styles.separatorContainer}>
          <View style={styles.separator} />
          <Text style={styles.separatorText}>Eller</Text>
          <View style={styles.separator} />
        </View>

        {/* Feide & Guest Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionButtonText}>Feide</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionButtonText}>Gjest</Text>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <TouchableOpacity
          onPress={() => router.push("/registrering/lag-bruker")}
        >
          <Text style={styles.registerText}>
            Har du ikke bruker?{" "}
            <Text style={styles.registerLink}>Registrer deg her</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </DoodlesBackgroundBlue>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 50, // Endre litt på størrelse? Ikke 100% riktige dimensjoner fra figma, figma sine virket ikke riktige.
    height: 80,
    bottom: 50,
    left: 120,
    backgroundColor: "#F2F2F2",
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 15,
    bottom: 50,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontSize: 20,
    fontWeight: "600",
    color: "#293059",
    backgroundColor: "#F2F2F2",
  },
  inputContainer: {
    width: "100%", // Ensures both inputs have full width
    borderWidth: 1,
    borderColor: "#B7B7B7",
    borderRadius: 11,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  inputField: {
    flex: 1,
    height: 55,
    paddingHorizontal: 10,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#527AA7",
  },
  eyeIcon: {
    padding: 10, //Trenger border, eller kanskje lettere å se uten?
  },
  forgotPassword: {
    alignSelf: "flex-start",
    color: "#486B93",
    fontSize: 20,
    fontFamily: "sourcesans-pro", // placeholder
    borderBottomWidth: 0.8,
    borderBottomColor: "#486B93",
  },

  nextButton: {
    width: 168,
    height: 69,
    backgroundColor: "#FFCC6A",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  nextButtonText: {
    fontSize: 24,
    fontFamily: "sourcesans-pro", // placeholder
    fontWeight: "600", // 600 fontweight = semibold ifølge chatgpt. (placeholder)
    color: "black",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  separator: {
    flex: 1,
    height: 2,
    backgroundColor: "#527AA7",
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 20,
    color: "#293059",
    fontFamily: "sourcesans-pro", //placeholder
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2.5,
    borderColor: "#FFCC6A",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  optionButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#293059",
  },
  registerText: {
    fontSize: 20,
    color: "#486B93",
    fontWeight: "600",
  },
  registerLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
    bottom: 25,
  },
});
