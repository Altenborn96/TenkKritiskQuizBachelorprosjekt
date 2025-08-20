import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { sendFeedBack } from "../API/api";
import { FeedBackDto } from "../types/settings";
import * as SecureStore from "expo-secure-store";

export default function RangeringPage() {
  const router = useRouter();

  // States for ratings
  const [recommendScore, setRecommendScore] = useState(0);
  const [funScore, setFunScore] = useState(0);
  const [satisfiedScore, setSatisfiedScore] = useState(0);

  // Handle rating click
  const handleRatingClick = (
    setRating: React.Dispatch<React.SetStateAction<number>>,
    rating: number
  ) => {
    setRating(rating);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const feedbackDto: FeedBackDto = {
        identifier: "SCORE",
        recommendScore: recommendScore,
        funScore: funScore,
        satisfiedScore: satisfiedScore,
      };

      const token = await SecureStore.getItemAsync("token");

      await sendFeedBack(feedbackDto, token);
      router.push("/instillinger/takktilbakemelding");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rangering</Text>

      {/* Rating Question 1 */}
      <Text style={styles.question}>
        Fra en skala fra 1 - 5 hvor stor grad hadde du anbefalt denne
        applikasjonen?
      </Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              recommendScore === rating && styles.selectedRatingButton,
            ]}
            onPress={() => handleRatingClick(setRecommendScore, rating)}
          >
            <Text style={styles.ratingText}>{rating}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Rating Question 2 */}
      <Text style={styles.question}>
        Fra en skala fra 1 - 5 hvor gøy synes du quizen var?
      </Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              funScore === rating && styles.selectedRatingButton,
            ]}
            onPress={() => handleRatingClick(setFunScore, rating)}
          >
            <Text style={styles.ratingText}>{rating}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Rating Question 3 */}
      <Text style={styles.question}>Hvor fornøyd er du med applikasjonen?</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <TouchableOpacity
            key={rating}
            style={[
              styles.ratingButton,
              satisfiedScore === rating && styles.selectedRatingButton,
            ]}
            onPress={() => handleRatingClick(setSatisfiedScore, rating)}
          >
            <Text style={styles.ratingText}>{rating}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Send inn</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  ratingButton: {
    backgroundColor: "#ffb703", // Yellow background
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    width: 50,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#ffb703", // Yellow background
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  selectedRatingButton: {
    backgroundColor: "green",
  },
});
