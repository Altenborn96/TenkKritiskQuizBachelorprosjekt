import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons"; // For stjerner og lås-ikon
import { useQuestion } from "../context/QuestionContext";
import { useResult } from "../context/QuizContext";
import { useSection } from "../context/SectionContext";
import { useUser } from "../context/UserContext";
import { Section } from "../types/section";
import { checkResultStatus, getSections } from "../API/api";
import * as SecureStore from "expo-secure-store";

export default function MainPage() {
  const router = useRouter();

  const [sections, setSections] = useState<Section[]>([]);

  const { setQuizName, resetResult } = useResult();
  const { resetQuestions } = useQuestion();
  const { contextUsername } = useUser();

  const [completedStatus, setCompletedStatus] = useState<{
    [key: number]: {
      completed: boolean;
      correct: number;
      total: number;
    };
  }>({});

  //Hente modul fra api (uten spørsmål), legge liste med moduler i sections (liste med Section interface)
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const data = await getSections();
        const sectionsArray = data.$values ? data.$values : data;

        setSections(sectionsArray);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchSections();
  }, []);

  //Validere om bruker har utført quiz før
  useEffect(() => {
    if (sections.length === 0) return;

    const fetchStatusAndSetLocking = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const statusUpdates: {
          [key: number]: { completed: boolean; correct: number; total: number };
        } = {};

        console.log("Token: ", token);

        await Promise.all(
          sections.map(async (section) => {
            const data = await checkResultStatus(
              contextUsername,
              section.id,
              token
            );

            statusUpdates[section.id] = {
              completed: data.status,
              correct: data.correctAnswers || 0,
              total: data.totalQuestions || section.totalQuestions || 1,
            };
          })
        );

        setCompletedStatus(statusUpdates);

        // Beregne ny locked-status
        const updated = sections.map((section, i) => {
          // Behold låst status hvis API versjon er locked
          if (section.locked) {
            return section;
          }

          let locked = false;
          if (i !== 0) {
            const prev = statusUpdates[sections[i - 1].id];
            const prevCorrect = prev?.correct || 0;
            const prevTotal = prev?.total || 1;
            const percent = (prevCorrect / prevTotal) * 100;
            locked = percent < 80;
          }

          return { ...section, locked };
        });

        // sett sections kun ved endring (forhindre loop)
        const hasChanges = updated.some(
          (u, i) => u.locked !== sections[i].locked
        );
        if (hasChanges) {
          setSections(updated);
        }
      } catch (err) {
        console.error("Feil ved henting av status:", err);
      }
    };

    fetchStatusAndSetLocking();
  }, [sections]); //  denne er trygg nå!

  useEffect(() => {
    const clearcontext = () => {
      resetResult();
      resetQuestions();
    };
    clearcontext();
  }, []);

  //Setter section i state
  const { section, setSection } = useSection();
  // Funksjon for å åpne en modul
  const handlePress = (section: Section) => {
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

    setQuizName(section.name);
    if (!section.locked) {
      router.push(`/moduler/${section.id}`);
    }
  };

  // Funksjon for å vise stjerner
  const renderStars = (stars: number) => {
    const totalStars = 5;
    return [...Array(totalStars)].map((_, index) => (
      <FontAwesome
        key={index}
        name={index < stars ? "star" : "star-o"}
        size={20}
        color={index < stars ? "#f1c40f" : "gray"}
        style={{ marginHorizontal: 2 }}
      />
    ));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginTop: "30%",
          alignSelf: "center",
          marginBottom: "5%",
        }}
      >
        Moduler
      </Text>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false} // Fjerner scrollbar
        contentContainerStyle={{ paddingBottom: 100 }} // Hindrer at siste element blir kuttet
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={{
              backgroundColor: item.locked ? "#E4E5E5" : "#E3EEFC",
              padding: 20,
              marginVertical: 10,
              borderRadius: 20,
              flexDirection: "row",
              alignSelf: "center",
              height: 170,
              width: "95%",
              shadowColor: "#000", // Shadow color (black)
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            {/* Viser modulikon knyttet til image */}
            <View>
              <Image
                source={{ uri: item.image }}
                style={{ height: 80, width: 80, top: 22, marginRight: 40 }}
              ></Image>
            </View>
            <View style={{ flex: 1, alignSelf: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.name}
              </Text>

              {/*Stjerne-rendering. Renderes stjerne utifra brukers lagret resultat */}
              <View style={{ flexDirection: "row", marginVertical: 5 }}>
                {renderStars(
                  ((completedStatus[item.id]?.correct /
                    completedStatus[item.id]?.total) *
                    100) /
                    20
                )}
              </View>

              {/*  Viser om quizen er fullført eller ikke */}
              {completedStatus[item.id] ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: completedStatus[item.id].completed ? "green" : "red",
                  }}
                >
                  {completedStatus[item.id].completed
                    ? `\n✅ Fullført\n\n${completedStatus[item.id].correct}/${
                        completedStatus[item.id].total
                      } riktige`
                    : "\n❌ Ikke fullført"}
                </Text>
              ) : (
                <Text style={{ fontSize: 14, color: "gray" }}>
                  Laster status...
                </Text>
              )}
            </View>

            <Text
              style={{
                fontSize: 18,
                alignSelf: "flex-end",
                color: item.locked ? "white" : "black",
              }}
            >
              {item.locked ? (
                <FontAwesome name="lock" size={20} color="gray" />
              ) : (
                <FontAwesome name="arrow-right" size={20} color="#2d3b55" />
              )}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
