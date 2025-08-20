import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useContext, useEffect } from "react";
import { SectionContext } from "../context/SectionContext";
import { useQuestion } from "../context/QuestionContext";
import { AntDesign } from "@expo/vector-icons";
import { getQuestions } from "../API/api";

export default function ModulePage() {
  const section = useContext(SectionContext);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { setQuestions } = useQuestion();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        //Definere sjekk for om id er array/string
        const stringId = Array.isArray(id) ? id[0] : id;

        if (stringId) {
          const data = await getQuestions(stringId);

          if (data.$values) {
            const formattedQuestions = data.$values.map((q: any) => ({
              id: q.id,
              questionText: q.questionText,
              sectionId: q.sectionId,
              answers: q.answers.$values.map((a: any) => ({
                id: a.id,
                answerText: a.answerText,
                correct: a.correct,
                questionId: a.questionId,
                score: a.score,
              })),
            }));

            setQuestions(formattedQuestions);
            console.log(id);
          }
        }
      } catch (error) {
        console.error("Feil ved henting av sp�rsm�l:", error);
      }
    };

    fetchQuestions();
  }, [setQuestions]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.blueBox}>
        <View style={styles.row}>
          <View style={styles.imagePlaceholder} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{section?.section?.name}</Text>
            <TouchableOpacity
              onPress={() => router.push("/instillinger/1")}
              style={styles.begrepslisteButton}
            >
              <Text style={styles.begrepslisteText}>Begrepsliste</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.description}>{section?.section?.description}</Text>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => router.push(`/moduler/${id}/question`)}
      >
        <Text style={styles.startButtonText}>Begynn spillet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backArrow: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  blueBox: {
    width: "100%",
    backgroundColor: "#E8F0FF",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFD700",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  begrepslisteButton: {
    backgroundColor: "#FFCC4D",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  begrepslisteText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    textAlign: "left",
    color: "#333",
    marginTop: 30,
  },
  startButton: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: "#FFB703",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
