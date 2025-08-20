import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useUser } from "../../context/UserContext";
import { useResult } from "../../context/QuizContext";
import { useSection } from "../../context/SectionContext";
import { useEffect, useState } from "react";
import { Image } from "react-native";
import { getAchievementById, getUserAchievementById } from "@/app/API/api";
import * as SecureStore from "expo-secure-store";

interface Achievement {
  id: number;
  name: string;
  url: string;
}

export default function GameDonePage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { contextUsername } = useUser();
  const { score } = useResult();
  const { section } = useSection();
  const [achievement, setAchievement] = useState<Achievement>();
  //Ta med question om achievementId har blitt satt (settes kun ved oppnådd score for tildeling av achievement)
  const { achievementId } = useLocalSearchParams();
  const [alreadyAchieved, setAlreadyAchieved] = useState(false);

  useEffect(() => {
    //Hente modulens tilhørende achievement
    const getAchievement = async () => {
      if (section?.achievementId) {
        const data = await getAchievementById(section?.achievementId);
        setAchievement(data);
      }
    };
    getAchievement();
  }, []);

  //Hente hvis bruker har eksisterende oppnådd achievement
  useEffect(() => {
    const getUserAchievement = async () => {
      setAlreadyAchieved(false);
      try {
        const token = await SecureStore.getItemAsync("token");

        if (token && section?.achievementId) {
          const data = await getUserAchievementById(
            section?.achievementId,
            token
          );
          console.log(data);

          if (data.hasAchievement === true) {
            setAlreadyAchieved(true);
          } else {
            setAlreadyAchieved(false);
          }
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    getUserAchievement();
  }, [section?.achievementId]);

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8F9FA",
      }}
    >
      {/* Plassering av poengscore i hjørnet */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          position: "absolute",
          top: 40,
          right: 20,
          color: "black",
        }}
      >
        +{section?.points}
      </Text>

      {/* Gratulasjonstekst */}
      {alreadyAchieved ? (
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          🎉 Gratulerer med gjennomført modul, {contextUsername}!{"\n"}Du
          oppnådde en score på {score} poeng!
        </Text>
      ) : (
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          🎉 Gratulerer {contextUsername}!{"\n"}Du oppnådde en score på {score}{" "}
          poeng!
        </Text>
      )}

      <View style={{ alignItems: "center" }}>
        {achievementId != undefined ? (
          <View style={{ alignItems: "center" }}>
            {/* Achievement-ikon */}
            <Image
              source={{ uri: achievement?.url }}
              style={{ width: 150, height: 150 }}
              resizeMode="contain"
            />

            {/* Oppnåelse-tekst */}
            <Text
              style={{ fontSize: 28, marginBottom: 10, textAlign: "center" }}
            >
              {alreadyAchieved
                ? "Du har allerede oppnådd oppnåelsen"
                : "Du har blitt tildelt oppnåelsen"}
            </Text>

            {/* Navn på oppnåelsen */}
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "black",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              {achievement?.name}
            </Text>
          </View>
        ) : (
          <Text style={{ fontSize: 18, textAlign: "center" }}>
            Dessverre ingen oppnåelse denne gangen, prøv igjen!
          </Text>
        )}
      </View>

      {/* Knapper */}
      <TouchableOpacity
        onPress={() => router.push(`/moduler/${id}/more-info`)}
        style={{
          backgroundColor: "#4CAF50",
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
          width: "90%",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, color: "white" }}>
          Få mer informasjon om modulen
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(tabs)")}
        style={{
          backgroundColor: "#FFA500",
          padding: 15,
          borderRadius: 8,
          width: "90%",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 18, color: "white" }}>
          Tilbake til hjemmesiden
        </Text>
      </TouchableOpacity>
    </View>
  );
}
