import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuestion, Question } from "../../context/QuestionContext";
import { useResult } from "../../context/QuizContext";
import { useSection } from "../../context/SectionContext";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

import { ResultDto } from "@/app/types/result";
import { UserAchievementDto } from "@/app/types/achievement";
import { getQuestions, postAchievement, postResult } from "@/app/API/api";

const { width } = Dimensions.get("window");

export default function QuestionPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const questions = useQuestion();
  const { setQuestions } = useQuestion();
  const {
    setScore,
    score,
    quizName,
    correctAnswers,
    setCorrectAnswers,
    totalQuestions,
    setTotalQuestions,
  } = useResult();
  const { playerId, contextUsername } = useUser();
  const { section } = useSection();
  const [postReady, setPostReady] = useState(false);
  const [achievementId, setAchievementId] = useState<number | null>(null);
  const [earnedAchievement, setEarnedAchievement] = useState(false);
  const [steps, setSteps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const points = section?.points ?? 0;

  const resultDto: ResultDto = {
    Score: score + points,
    PlayerId: playerId,
    SectionId: section?.id || 0,
    QuizName: quizName,
    PlayerName: contextUsername,
    CorrectAnswers: correctAnswers,
    TotalQuestions: totalQuestions,
    EarnedAchievement: earnedAchievement,
  };

  const userAchievementDto: UserAchievementDto = {
    PlayerId: playerId,
    AchievementId: achievementId,
  };

  //Sette length for progressbar
  useEffect(() => {
    try {
      const getQuestionList = async () => {
        const data = await getQuestions(JSON.stringify(section?.id));
        setSteps(data.$values.length);
      };
      getQuestionList();
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  //Arrayblander for svaralternativer
  const shuffleArray = (array: any) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const SaveQuizData = async (
    resultDto: ResultDto,
    userAchievementDto?: UserAchievementDto,
    earnedAchievement?: boolean
  ) => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const resultData = await postResult(resultDto, token);

      // Post achievmeent (hvis oppnådd)
      if (earnedAchievement && userAchievementDto && token) {
        const achievementData = await postAchievement(
          userAchievementDto,
          token
        );
      }
    } catch (error) {
      console.log("Feil oppstått:", error);
    }
  };

  const removeAnsweredQuestion = () => {
    setQuestions((prevQuestions: Question[]) => prevQuestions.slice(1));
  };

  const handleAnswer = (answer: string, correct: boolean, score: number) => {
    setTotalQuestions((prevTotalQuestions) => prevTotalQuestions + 1);
    if (correct) {
      setScore((prevScore) => prevScore + score);
      setCorrectAnswers((prevCorrectAnswers) => prevCorrectAnswers + 1);
    }

    removeAnsweredQuestion();

    if (questions.questions.length === 1) {
      const newTotal = totalQuestions + 1;
      const newCorrect = correct ? correctAnswers + 1 : correctAnswers;
      const passed = newCorrect / newTotal >= 0.8;

      if (passed && section) {
        setAchievementId(section.achievementId);
        setEarnedAchievement(true);
        console.log("Passed!", newCorrect, "/", newTotal);
      } else {
        setAchievementId(null);
        setEarnedAchievement(false);
      }

      setTimeout(() => {
        setPostReady(true);
      }, 100);

      router.push({
        pathname: "/moduler/[id]/game-done",
        params: {
          id: id?.toString(),
          achievementId: passed
            ? section?.achievementId?.toString()
            : undefined,
        },
      });
    } else {
      router.push(`/moduler/${id}/question`);
    }
  };

  useEffect(() => {
    if (postReady) {
      SaveQuizData(resultDto, userAchievementDto, earnedAchievement);

      //console.log("UserAchievement posted: ", userAchievementDto);
      //console.log("Result posted: ", resultDto);
    }
  }, [postReady]);

  return (
    <View style={styles.container}>
      {/* ØVERSTE GULE BAKGRUNN */}
      <View style={styles.yellowBackground} />

      {/* HEADER / PROGRESSBAR / TILBAKEKNAPP */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1e1e1e" />
        </TouchableOpacity>

        {/* Progressbar */}
        <View
          style={{ height: 30, justifyContent: "center", marginHorizontal: 20 }}
        >
          <View
            style={{
              height: 4,
              backgroundColor: "#ccc",
              position: "absolute",
              left: 0,
              right: 0,
              top: "50%",
            }}
          />

          {Array.from({ length: steps }).map((_, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: i <= totalQuestions - 1 ? "#4caf50" : "#ccc",
                top: "50%",
                left: `${(i / (steps - 1)) * 100}%`,
                marginTop: -8,
                transform: [{ translateX: -8 }],
              }}
            />
          ))}
        </View>
      </View>

      {/* SPØRSMÅL */}
      <FlatList
        data={questions.questions.slice(0, 1)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.questionBox}>
            <Text style={styles.questionText}>{item.questionText}</Text>
          </View>
        )}
      />

      {/* SVARALTERNATIVER || Med shuffling av liste for tilfeldig plassert CorrectAnswer */}
      <View style={styles.answerContainer}>
        {shuffleArray(questions.questions[0]?.answers || []).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.answerButton}
            onPress={() =>
              handleAnswer(item.answerText, item.correct, item.score)
            }
          >
            <Text style={styles.answerText}>{item.answerText}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Statisk "progressbar"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5F0FF",
    alignItems: "center",
  },
  yellowBackground: {
    position: "absolute",
    top: 0,
    height: "50%",
    width: "100%",
    backgroundColor: "#FFD250",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  header: {
    width: "100%",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 15,
    padding: 10,
  },
  progressBar: {
    position: "relative",
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLine: {
    position: "absolute",
    height: 4,
    width: "100%",
    backgroundColor: "#1e1e1e",
    borderRadius: 2,
  },
  progressDot: {
    position: "absolute",
    width: 16,
    height: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#1e1e1e",
  },
  questionBox: {
    // Få denne til å tilpasse seg dynamisk i forhold til lengden på spørsmålet
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: width * 0.9,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    top: 100,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#1e1e1e",
  },
  answerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 0,
    top: -200,
    display: "flex",
  },
  answerButton: {
    backgroundColor: "#FFD250",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 16,
    alignItems: "center",
    width: "40%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    margin: 10,
  },
  answerText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#1e1e1e",
  },
});
