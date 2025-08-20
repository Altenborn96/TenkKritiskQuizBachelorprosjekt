import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../context/UserContext";
import * as SecureStore from "expo-secure-store";

import { useRouter } from "expo-router";
import { useResult } from "../context/QuizContext";
import { useSection } from "../context/SectionContext";
import {
  getAvatar,
  getAvatars,
  getSection,
  getUserAchievements,
  getUserNextResult,
  selectUserAvatar,
  getLeaderboard,
  getSections,
  checkResultStatus,
  changeUsername,
} from "../API/api";
import { Avatar, AvatarUpdateDto } from "../types/avatar";
import { Achievement, AchievementCard } from "../types/achievement";
import { Result, SectionResult } from "../types/result";
import { Score } from "../types/leaderboard";
import AvatarSelection from "@/components/avatars/AvatarSelection";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ProfileScreen() {
  const { profileImage, setProfileImage } = useUser();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const { contextUsername, setContextUsername } = useUser();
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [progressionResult, setProgressionResult] = useState<Result>();
  const [sectionResult, setSectionResult] = useState<SectionResult>();
  const { setQuizName } = useResult();
  const { section, setSection } = useSection();
  const [fetchedResult, setFetchedResult] = useState(false);
  const [playersArray, setPlayersArray] = useState<Score[]>([]);
  const loggedInUserScore =
    playersArray.find((player) => player.userName === contextUsername)?.score ??
    0;
  const router = useRouter();
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingProfileImage, setPendingProfileImage] = useState<string | null>(
    null
  );
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [userNameInput, setUserNameInput] = useState(contextUsername);
  const [editingUserName, setEditingUserName] = useState(false);
  const [displayedUsername, setDisplayedUsername] = useState(contextUsername);

  const selectAvatarFromProfile = async (avatar: Avatar) => {
    // Update UI locally:
    setSelectedAvatar(avatar.id.toString());
    setProfileImage(avatar.url);

    const avatarUpdateDto: AvatarUpdateDto = {
      username: contextUsername,
      avatarUrl: avatar.url,
      avatarId: avatar.id,
    };

    try {
      await selectUserAvatar(avatarUpdateDto);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //Hente liste med avatarer
  useEffect(() => {
    const getAvatarsList = async () => {
      try {
        //Api kallet
        const data = await getAvatars();

        setAvatars(data.$values);
      } catch (error) {
        console.error("Error fetching avatars:", error);
      }
    };

    getAvatarsList();
  }, []);

  //Hente avatar fra db ift bruker.
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        //Api kallet
        const data = await getAvatar(contextUsername);
        setSelectedAvatar(data.avatarUrl);
        setProfileImage(data.avatarUrl);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchAvatar();
  }, [setProfileImage]);

  //Henter brukers oppnådde achievements
  useEffect(() => {
    const fetchUserAchievements = async () => {
      const token = await SecureStore.getItemAsync("token");
      try {
        if (token) {
          const data = await getUserAchievements(token);

          const userAchievementsArray: Achievement[] = data?.$values || [];
          setUserAchievements(userAchievementsArray);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchUserAchievements();
  }, []);

  //henter relevant resultat for fortsett modul-boks.
  useEffect(() => {
    const fetchNextResult = async () => {
      setFetchedResult(false);
      try {
        const token = await SecureStore.getItemAsync("token");
        //Api kall, henter brukers neste resutlat basert på neste uferdige eller ustartet modul
        const data = await getUserNextResult(contextUsername, token);

        //Sjekker for datatype result hvis bruker allerede har et resultat med under 80% av riktige svar
        if (data.type == "result") {
          setProgressionResult(data.data);
          console.log("Motatt result: ", data.data);
          setFetchedResult(true);
        } else if (data.type == "section") {
          // Hvis ingen resultat er under 80% riktige, henter den nye section i listen basert på lavest section id(eldste modul uten score)
          //Lagrer til samme som den ovenfor, med forskjellige navn på noen verdier
          setProgressionResult(data.data);
          setSectionResult(data.data);
          console.log("Mottatt section: ", data.data);
          console.log(
            "Section total questions: ",
            sectionResult?.totalQuestions
          );
        }
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchNextResult();
  }, []);

  useEffect(() => {
    const fetchSection = async () => {
      if (!fetchedResult) return;

      try {
        if (progressionResult?.sectionId) {
          const data = await getSection(progressionResult.sectionId);
          setSectionResult(data);
        }
      } catch (error) {
        console.error("API-feil:", error);
      }
    };

    fetchSection();
  }, [fetchedResult]);

  //Kalles med handlePress(sectionResult)
  const handlePress = (section: SectionResult) => {
    //Section i quizcontext
    setSection({
      id: section.id,
      name: section.name,
      image: section.image,
      stars: section.stars,
      points: section.points,
      description: section.description,
      locked: section.locked,
      completed: false,
      achievementId: section.achievementId,
    });

    //console.log("Image: ", section.image);
    setQuizName(section.name);

    if (section.locked == true) {
      console.log("Modul låst i API");
      return;
    }
    router.push(`/moduler/${section.id}`);
  };

  // Define achievement cards data with proper typing
  const achievementCards: AchievementCard[] = [
    {
      id: 1,
      title: "Oppnåelser",
      type: "achievements",
      achievements: userAchievements,
    },
    {
      id: 2,
      title:
        progressionResult?.quizName ?? progressionResult?.name
          ? `Fortsett - ${
              progressionResult?.quizName || progressionResult?.name
            }`
          : //Hvis ingen fler spillbare moduler vises
            `Gratulerer ${contextUsername}, du har fullført alle spillbare moduler!`,
      type: "progress",
      progress: progressionResult,
    },
  ];

  const getWrongAnswers = () => {
    if (
      typeof progressionResult?.totalQuestions === "number" &&
      typeof progressionResult?.correctAnswers === "number"
    ) {
      return (
        progressionResult.totalQuestions - progressionResult.correctAnswers
      );
    }
    return null;
  };

  const editUsername = async (newUsername: string) => {
    const token = await SecureStore.getItemAsync("token");
    await changeUsername(newUsername, token!);
    setEditingUserName(false);
    setContextUsername(newUsername);
    setDisplayedUsername(newUsername);
  };

  const renderAchievementCard = ({
    item,
    index,
  }: {
    item: AchievementCard;
    index: number;
  }) => (
    <View style={[styles.card, { width: SCREEN_WIDTH * 0.85 }]}>
      <View style={styles.rowContainer}>
        {index === 0 && (
          <Image
            source={require("../../assets/images/HatSchool.png")}
            style={{ width: 30, height: 30, marginRight: 8 }}
          />
        )}
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      {item.type === "achievements" && item.achievements && (
        <View style={styles.achievementsContainer}>
          {item.achievements.map((achieve) => (
            <Image
              key={achieve.id}
              source={{ uri: achieve.url }}
              style={styles.achievementIcon}
            ></Image>
          ))}
        </View>
      )}
      {item.type === "progress" && item.progress && (
        <View style={styles.progressContainer}>
          {/* Henter image fra satt section */}
          <Image
            source={{ uri: sectionResult?.image ?? progressionResult?.image }}
            style={{
              height: 50,
              width: 50,
            }}
          ></Image>
          <Text style={styles.progressText}>
            Du har {getWrongAnswers() ?? sectionResult?.totalQuestions} spørsmål
            igjen å fullføre
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              if (sectionResult) {
                handlePress(sectionResult);
              }
            }}
          >
            <Text style={styles.continueButtonText}>Fortsett</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  useEffect(() => {
    const fetchLeaderboardList = async () => {
      try {
        //api kall definert i api.ts
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
  }, []);

  useEffect(() => {
    const fetchCompletedCount = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        // Get sections; if data is wrapped in $values, extract it.
        const sectionsData = await getSections();
        const sectionsArray = sectionsData.$values
          ? sectionsData.$values
          : sectionsData;
        console.log("Sections:", sectionsArray);

        // For each section, check if the user has a result.
        const statusChecks = await Promise.all(
          sectionsArray.map(async (section: any) => {
            const statusData = await checkResultStatus(
              contextUsername,
              section.id,
              token
            );
            console.log(`Section ${section.id} status:`, statusData);
            return statusData?.status; // true if completed, false otherwise
          })
        );

        // Count sections marked as completed.
        const count = statusChecks.filter((status) => status === true).length;
        console.log("Computed completed count:", count);
        setCompletedCount(count);
      } catch (error) {
        console.error("Error fetching completed sections count:", error);
      }
    };

    if (contextUsername) {
      fetchCompletedCount();
    }
  }, [contextUsername]);

  return (
    <View style={styles.container}>
      {/* Header with back button and logo */}
      <View style={styles.header}>
        {isEditing && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (pendingProfileImage) {
                setProfileImage(pendingProfileImage);
                setPendingProfileImage(null);
              }
              setIsEditing(false);
            }}
          >
            <Ionicons
              name="chevron-back-circle-outline"
              size={35}
              color="#333"
            />
          </TouchableOpacity>
        )}
        <Image
          source={require("../../assets/images/iti-transparent.png")}
          style={styles.logo}
        />
      </View>

      {/* Profile section */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          onPress={() => setIsEditing(true)}
          style={styles.profileImageContainer}
        >
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../assets/images/default-avatar.png")
            }
            style={styles.profileImage}
          />
          {!isEditing && (
            <View style={styles.editIconContainer}>
              <Ionicons name="pencil" size={16} color="#333" />
            </View>
          )}
        </TouchableOpacity>

        {isEditing ? (
          <>
            {/* Editable username container */}
            <View style={styles.usernameWrapper}>
              <View
                style={[
                  styles.usernameContainer,
                  editingUserName && styles.usernameContainerEditing,
                ]}
              >
                {editingUserName ? (
                  <TextInput
                    style={styles.usernameInput}
                    value={userNameInput}
                    onChangeText={setUserNameInput}
                    autoFocus
                    textAlign="center"
                  />
                ) : (
                  <Text style={styles.usernameText}>{displayedUsername}</Text>
                )}

                {editingUserName ? (
                  <TouchableOpacity
                    onPress={() => editUsername(userNameInput)}
                    style={styles.pencilContainer}
                  >
                    <Ionicons name="checkmark" size={16} color="white" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setEditingUserName(true)}
                    style={styles.pencilContainer}
                  >
                    <View style={styles.editIconContainer}>
                      <Ionicons name="pencil" size={16} color="#333" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <AvatarSelection
              avatars={avatars}
              onSelectAvatar={selectAvatarFromProfile}
              selectedAvatar={selectedAvatar}
            />
          </>
        ) : (
          <>
            <Text style={styles.username}>{userNameInput}</Text>
            <View>
              <View style={styles.statsContainer}>
                <View style={[styles.statBox, styles.greenStat]}>
                  <Text style={styles.statLabel}>Poeng</Text>
                  <View style={styles.statValueContainer}>
                    <Image
                      source={require("../../assets/images/SackPension.png")}
                      style={{ width: 40, height: 40 }}
                    />
                    <Text>{loggedInUserScore}</Text>
                  </View>
                </View>
                <View style={[styles.statBox, styles.pinkStat]}>
                  <Text style={styles.statLabel}>Gjennomførte spill</Text>
                  <View style={styles.statValueContainer}>
                    <Image
                      source={require("../../assets/images/Sparkles.png")}
                      style={{ width: 40, height: 40 }}
                    />
                    <Text style={styles.statValue}>
                      {userAchievements.length}
                    </Text>
                  </View>
                </View>
              </View>
              {/* Separator with pagination dots */}
              <View style={styles.separatorContainer}>
                <View style={styles.separator} />
                <View style={styles.paginationDots}>
                  <View
                    style={[styles.dot, activeIndex === 0 && styles.activeDot]}
                  />
                  <View
                    style={[styles.dot, activeIndex === 1 && styles.activeDot]}
                  />
                </View>
              </View>
              <View>
                {/* Swipeable Achievement Cards */}
                <FlatList
                  ref={flatListRef}
                  data={achievementCards}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderAchievementCard}
                  onMomentumScrollEnd={(event) => {
                    const index = Math.round(
                      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                    );
                    setActiveIndex(index);
                  }}
                  scrollEventThrottle={16}
                  style={{ flexGrow: 0 }}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3EEFC",
  },
  header: {
    position: "fixed",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: "10%",
    paddingBottom: 20,
    display: "flex",
  },
  backButton: {
    padding: 5,
  },
  logo: {
    width: "100%",
    height: "150%",
    resizeMode: "contain",
    marginTop: "10%",
    marginLeft: "40%",
  },
  profileSection: {
    alignItems: "center",
    paddingTop: 0,
    marginTop: "20%",
    paddingBottom: 30,
    height: "100%",
    backgroundColor: "#ffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
    marginTop: -70, // This shifts the profile image upward by 70px.
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 50,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ffca28",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
    marginLeft: "5%",
  },
  statBox: {
    borderRadius: 10,
    padding: 12,
    width: "48%",
  },
  greenStat: {
    backgroundColor: "#9BE3AE",
  },
  pinkStat: {
    backgroundColor: "#F2A8A8",
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  statValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 5,
  },
  separatorContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  separator: {
    height: 1,
    width: "90%",
    backgroundColor: "#ddd",
    marginBottom: 10,
  },
  paginationDots: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#333",
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 180,
    width: SCREEN_WIDTH * 0.85, // Now 80% of the screen width
    marginHorizontal: SCREEN_WIDTH * 0.4 * 0.05, // Centers the card properly
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  achievementsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  achievementItem: {
    width: 50,
    height: 50,
    backgroundColor: "#fff3e0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffe0b2",
  },
  achievementIcon: {
    height: 50,
    width: 50,
  },
  progressContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  circleContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff3e0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffe0b2",
  },
  circleIcon: {
    fontSize: 30,
  },
  progressText: {
    textAlign: "center",
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: "#ffca28",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  continueButtonText: {
    fontWeight: "bold",
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 15,
  },
  avatarChoice: {
    margin: 5,
    padding: 5,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatar: {
    borderColor: "#007bff",
  },
  avatarList: {
    flexDirection: "row",
    marginTop: 10,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
    backgroundColor: "#ddd", // Placeholder in case the image fails to load
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#527AA7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginBottom: 10,
    width: "80%", // Adjust as needed
    alignSelf: "center", // Center the container horizontally within its parent
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  usernameInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  pencilContainer: {
    position: "absolute",
    bottom: 4,
    right: 10,
    backgroundColor: "#289484",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  usernameContainerEditing: {
    borderWidth: 3,
    borderColor: "#527AA7",
    padding: 8,
    borderRadius: 4,
  },
  usernameWrapper: {
    height: 50, // Set a fixed height that can accommodate the content and the "expanded" border
    marginBottom: 15, // This is the space where you want the extra border to show
  },
});
