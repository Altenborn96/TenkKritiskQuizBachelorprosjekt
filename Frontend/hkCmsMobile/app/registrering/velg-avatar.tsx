import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

import { getAvatars } from "../API/api";
import { Avatar } from "../types/avatar";
import AvatarSelection from "@/components/avatars/AvatarSelection";
import * as SecureStore from "expo-secure-store";

interface UserDto {
  username: string;
  avatarid: number;
  avatarUrl: string;
}

export default function AvatarSelectionScreen() {
  const router = useRouter();
  const [avatarid, setAvatarid] = useState<string | null>(null);
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | null>(
    null
  );
  const [progress, setProgress] = useState<number>(70); // Simulate progress (in percentage)
  const { contextUsername } = useUser();
  const [avatars, setAvatars] = useState<Avatar[]>([]);

  // Fetch the list of avatars from the API
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const data = await getAvatars();
        setAvatars(data.$values);
      } catch (error: any) {
        console.error("Error fetching avatars:", error.message);
      }
    };
    fetchAvatars();
  }, []);

  // This function will be passed to AvatarSelection via the onSelectAvatar prop.
  const selectAvatar = (avatar: Avatar) => {
    // Store the avatar id as a string (if needed for patching)
    setAvatarid(avatar.id.toString());
    // Store the avatar URL to send to the backend (and later display)
    setSelectedAvatarUrl(avatar.url);
  };

  //Updates a user by adding the id number of the avatar icon
  const handleClick = async () => {
    try {
      if (!avatarid || !selectedAvatarUrl) return;
      const user: UserDto = {
        username: contextUsername,
        avatarUrl: selectedAvatarUrl,
        avatarid: Number(avatarid),
      };
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

      const token = await SecureStore.getItemAsync("token");

      const res = await fetch(`${backendUrl}/api/players/avatar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      console.log(JSON.stringify(user));

      if (!res.ok) {
        throw new Error("Feil oppstod");
      }

      router.push("/registrering/ledertavle-anonym");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Velg en avatar</Text>

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

      {/* Display the avatars grid and highlight the selected avatar */}
      <AvatarSelection
        avatars={avatars}
        onSelectAvatar={selectAvatar}
        selectedAvatar={avatarid}
      />

      {/* Neste-knapp */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleClick}
        disabled={!avatarid} // Deaktiver knappen hvis ingen avatar er valgt
      >
        <Text style={styles.buttonText}>Neste</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 24,
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
    width: "100%",
    height: "100%",
    backgroundColor: "#ADD8E6", // Light blue background
    borderRadius: 5,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#003366", // Dark blue fill
    borderRadius: 5,
  },
  avatarGrid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    backgroundColor: "#E3EEFC",
    borderRadius: 23,
    height: "40%",
    padding: "9%", // Adds spacing inside the grid
  },
  avatarButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedAvatar: {
    borderWidth: 4,
    borderColor: "#2C3E50",
  },
  button: {
    backgroundColor: "#FFB703",
    paddingVertical: 12,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
