import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Score } from "../types/leaderboard";
import { getLeaderboard } from "../API/api";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { useUser } from "../context/UserContext"; // Import your user context

const Ledertavle = () => {
  const [playersArray, setPlayersArray] = useState<Score[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { contextUsername, profileImage } = useUser();

  //Definere backendurl fra .env fil
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  useEffect(() => {
    const fetchLeaderboardList = async () => {
      try {
        const data = await getLeaderboard();
        const players = data.$values ? data.$values : data;
        const formattedPlayers: Score[] = players.map(
          (player: any, index: number) => ({
            score: player.totalScore,
            userName: player.playerName,
            id: index.toString(),
            avatarUrl: player.avatarUrl,
          })
        );
        setPlayersArray(formattedPlayers);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchLeaderboardList();
  }, [contextUsername]);

  // Fetches leaderboard when screen is focused.
  useFocusEffect(
    useCallback(() => {
      getLeaderboard();
    }, [])
  );

  // Helper: if the leaderboard item belongs to the current user, override the avatar URL from context.
  const getAvatarUrl = (player: Score) =>
    player.userName === contextUsername && profileImage
      ? profileImage
      : player.avatarUrl;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Ledertavle</Text>
        <Text style={styles.logo}>iti</Text>
      </View>

      {/* Podium Section */}
      <View style={styles.podium}>
        {/* 2nd place */}
        {playersArray[1] && (
          <View style={styles.podiumItem}>
            <View style={[styles.circle2, { backgroundColor: "#4DB6FF" }]}>
              <Image
                source={{ uri: getAvatarUrl(playersArray[1]) }}
                style={styles.avatar}
              />
            </View>

            {/* Trenger design !!*/}
            <View>
              <Text style={styles.podiumPosition2}>
                {playersArray[1].userName.length > 7
                  ? playersArray[1].userName.slice(0, 7) + "..."
                  : playersArray[1].userName}
              </Text>
            </View>
            <View>
              <Text style={styles.podiumPosition2}>
                {playersArray[1].score ?? ""}
              </Text>
            </View>
            {/* Trenger design !!*/}
            <View
              style={[
                {
                  left: 10,
                  height: 130,
                  top: 60,
                  width: 120,
                  zIndex: 1,
                },
              ]}
            >
              <Image source={require("../../assets/images/Podium 2.png")} />
            </View>
          </View>
        )}

        {/* 1st place */}
        {playersArray[0] && (
          <View style={styles.podiumItem}>
            <View style={[styles.circle, { backgroundColor: "#FF8585" }]}>
              <Image
                source={{ uri: getAvatarUrl(playersArray[0]) }}
                style={styles.avatar}
              />
            </View>
            {/* Trenger design !!*/}
            <View>
              <Text style={styles.podiumPosition}>
                {playersArray[0].userName.length > 7
                  ? playersArray[0].userName.slice(0, 7) + "..."
                  : playersArray[0].userName}
              </Text>
            </View>
            <View>
              <Text style={styles.podiumPosition}>
                {playersArray[0].score ?? ""}
              </Text>
            </View>
            {/* Trenger design !!*/}
            <View
              style={[
                {
                  height: 140,
                  top: 10,
                  width: 120,
                  right: 10,
                },
              ]}
            >
              <Image source={require("../../assets/images/Podium 1.png")} />
            </View>
          </View>
        )}

        {/* 3rd place */}
        {playersArray[2] && (
          <View style={styles.podiumItem}>
            <View style={[styles.circle3, { backgroundColor: "#FFC9C9" }]}>
              <Image
                source={{ uri: getAvatarUrl(playersArray[2]) }}
                style={styles.avatar3}
              />
              {/* Trenger design !!*/}
              <View>
                <Text style={styles.podiumPosition3}>
                  {playersArray[2].userName.length > 7
                    ? playersArray[2].userName.slice(0, 7) + "..."
                    : playersArray[2].userName}
                </Text>
              </View>
              <View>
                <Text style={styles.podiumPosition3}>
                  {playersArray[2].score ?? ""}
                </Text>
              </View>
              {/* Trenger design !!*/}
            </View>
            <View
              style={[
                {
                  height: 80,
                  width: 100,
                  top: 40,
                  left: -10,
                },
              ]}
            >
              <Image source={require("../../assets/images/Podium 3.png")} />
            </View>
          </View>
        )}
      </View>

      {/* Player List med blå bakgrunn */}
      <View style={styles.listWrapper}>
        <FlatList
          data={playersArray.slice(3)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: 100,
          }} /* Endre lengde på bakgrunnen */
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <Text style={styles.listRank}>{parseInt(item.id) + 1}</Text>
              <Text style={styles.listName}>{item.userName}</Text>
              <Text style={styles.listScore}>{item.score}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

// Styles. Ikke optimalt kodet, mulig å få bedre sammenheng mellom styling.
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 10,
  },
  title: {
    fontFamily: "Comicsans-Regular",
    fontSize: 30,
    fontWeight: "bold",
    color: "#2d3b55",
    top: 15,
    left: 110,
  },
  logo: { fontSize: 24, fontWeight: "bold", color: "#ff6600" },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginVertical: 10,
  },
  filterButton: {
    backgroundColor: "#FFD56A",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: { fontWeight: "600", color: "#2d3b55" },
  podium: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: 30,
    marginBottom: 0,
    marginRight: 7,
  },
  podiumItem: {
    alignItems: "center",
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  circle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    top: 50,
  },
  circle3: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    top: 0,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatar3: {
    width: 40,
    height: 40,
    borderRadius: 20,
    top: 20, //Placeholder for position av avatar 3
  },

  podiumPosition: {
    fontSize: 15, //Mindre font for å få elementene "alignet"
    fontWeight: "bold",
    color: "#2d3b55",
  },
  podiumPosition2: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2d3b55",
    top: 50,
  },
  podiumPosition3: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2d3b55",
    top: 30,
  },

  listWrapper: {
    backgroundColor: "#E6F0FF",
    borderRadius: 16,
    padding: 12,
    marginTop: 30,
    zIndex: 1,
    height: 500,
  },
  listItem: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listRank: { fontWeight: "bold", fontSize: 16, color: "#2d3b55" },
  listName: { fontSize: 16, color: "#2d3b55" },
  listScore: { fontSize: 16, fontWeight: "bold", color: "#2d3b55" },
});

export default Ledertavle;
