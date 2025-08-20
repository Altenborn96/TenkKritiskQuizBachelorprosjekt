import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DoodlesBackgroundBlue from "@/components/doodlesbackgroundBlue";
import { AboutUs, FAQ, Privacy, Sources, Terms } from "../types/settings";
import {
  getAboutUs,
  getFaq,
  getPrivacy,
  getSources,
  getTerms,
} from "../API/api";

// Hardcoded data for each setting page
const settingsDetailData: Record<string, { title: string; content: string }> = {
  "1": {
    title: "Begrepliste",
    content: "Dette er begrepliste informasjon...",
  },
  "2": {
    title: "FAQ",
    content: "Her finner du ofte stilte spørsmål...",
  },
  "3": {
    title: "Kildeliste",
    content: "Her er en oversikt over alle kildene brukt i dette spillet...",
  },
  "4": {
    title: "Om oss",
    content: "",
  },
  "5": {
    title: "Personvern",
    content: "",
  },
  "6": {
    title: "Tilbakemeldinger",
    content: "Tilbakemeldinger side...",
  },
};

const SettingsDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [termsList, setTermsList] = useState<Terms[]>([]);
  const [faqList, setFaqList] = useState<FAQ[]>([]);
  const [sourcesList, setSourcesList] = useState<Sources[]>([]);
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const [privacy, setPrivacy] = useState<Privacy | null>(null);

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

  //TERMS OF SERVICE ((VISES IKKE I INSTILLINGER?))
  useEffect(() => {
    //Identifier = TERMS
    const getAppTerms = async () => {
      try {
        //API kallet (api.ts)
        const data = await getTerms();

        const terms: Terms[] = data.$values.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
        }));

        setTermsList(terms);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getAppTerms();
  }, []);

  //Hente FAQ fra api
  useEffect(() => {
    //Identifier = FAQ
    const getAppFaq = async () => {
      try {
        //API kallet (api.ts)
        const data = await getFaq();

        const faq: FAQ[] = data.$values.map((item: any) => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
          link: item.link ?? "",
        }));
        setFaqList(faq);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getAppFaq();
  }, []);

  //Hente kilder fra api
  useEffect(() => {
    //Identifier = SOURCES
    const getAppSources = async () => {
      try {
        //API kallet (api.ts)
        const data = await getSources();
        const sources: Sources[] = data.$values.map((item: any) => ({
          id: item.id,
          description: item.description,
          link: item.link,
        }));
        setSourcesList(sources);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    getAppSources();
  }, []);

  //Om oss
  useEffect(() => {
    //Identifier = ABOUT
    const getAppAboutUs = async () => {
      try {
        //API kallet (api.ts)
        const data = await getAboutUs();

        const aboutUs: AboutUs = data.$values?.[0] ?? {
          id: 0,
          title: "Om oss",
          description: "Ingen informasjon tilgjengelig.",
        };
        console.log("About-text:", JSON.stringify(aboutUs.description));
        setAboutUs(aboutUs);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getAppAboutUs();
  }, []);

  //Personvern
  useEffect(() => {
    const getAppPrivacy = async () => {
      try {
        //API kallet (api.ts)
        const data = await getPrivacy();

        const privacy: Privacy = data.$values?.[0] ?? {
          id: 0,
          title: "Om oss",
          description: "Ingen informasjon tilgjengelig.",
        };

        setPrivacy(privacy);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    getAppPrivacy();
  }, []);

  // Retrieve the content for the given id, default to a fallback message if not found
  const settingDetail = settingsDetailData[id as string] || {
    title: "Ukjent",
    content: "Ingen informasjon tilgjengelig.",
  };

  return (
    <DoodlesBackgroundBlue>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={{ padding: 20 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: "#1A275E",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Ionicons name="chevron-back" size={20} color="#1A275E" />
            </TouchableOpacity>
            <Text style={styles.title}>{settingDetail.title}</Text>

            {/* Display terms in separate boxes for Begrepliste */}
            {id === "1" && (
              <View style={styles.termListContainer}>
                {termsList.map((term, index) => (
                  <TouchableOpacity key={index} style={styles.termBox}>
                    <Text style={styles.termTitle}>{term.title}</Text>
                    <Text style={styles.termDescription}>
                      {term.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Display sources for Kildeliste */}
            {id === "3" && (
              <View style={styles.sourceListContainer}>
                {sourcesList.map((source, index) => (
                  <View key={index} style={styles.sourceBox}>
                    <Text style={styles.sourceTitle}>Source {index + 1}:</Text>
                    <Text style={styles.sourceDescription}>
                      {source.description}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        /* Handle open link if desired */
                      }}
                    >
                      <Text style={styles.sourceLink}>{source.link}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Display FAQ content */}
            {id === "2" && (
              <View style={styles.faqContainer}>
                {faqList.map((faq, index) => (
                  <View key={index} style={styles.faqBox}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    {faq.link && (
                      <TouchableOpacity onPress={() => console.log(faq.link)}>
                        <Text style={styles.faqLink}>{faq.link}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Display content for Om oss (Who We Are + What We Teach) */}
            {id === "4" && aboutUs && (
              <View style={styles.aboutBox}>
                <Text style={styles.aboutText}>
                  <Text style={styles.aboutText}>
                    {aboutUs.description.replace(/\\n/g, "\n")}
                  </Text>
                </Text>
              </View>
            )}

            {/* Display content for Personvern page */}
            {id === "5" && privacy && (
              <View style={styles.contentContainer}>
                <Text style={styles.title}>{privacy.title}</Text>
                <Text style={styles.content}>{privacy.content}</Text>
              </View>
            )}

            {/* Display content for Tilbakemeldinger (id === 6) */}
            {id === "6" && (
              <View style={styles.tilbakemeldingerContainer}>
                {/* Button to navigate to the Rangering page */}
                <TouchableOpacity
                  style={[styles.button, { marginBottom: 50 }]} //La til margin mellom knappene
                  onPress={() => router.push("/instillinger/rangering")}
                >
                  <Text style={styles.buttonText}>Ranger appen</Text>
                </TouchableOpacity>

                {/* Button to navigate to the Legg til en kommentar page */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => router.push("/instillinger/kommentar")}
                >
                  <Text style={styles.buttonText}>Legg til en kommentar</Text>
                </TouchableOpacity>

                {/* Heart Image */}
                <View style={styles.imageContainer}>
                  <Image
                    source={require("../../assets/images/Heart.png")} // Path to Heart.png
                    style={styles.heartImage} // Styling for the image
                  />
                </View>

                <Text style={styles.message}>
                  Takk som hjelper oss med{"\n"} å være bedre!
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </DoodlesBackgroundBlue>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    color: "#1A275E",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30, // For padding at the bottom
  },
  questionContainer: {
    marginBottom: 20, // Space between question and terms
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  termListContainer: {
    marginTop: 20,
  },
  termBox: {
    backgroundColor: "#e0f7fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  termTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  termDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  sourceListContainer: {
    marginTop: 20,
  },
  sourceBox: {
    backgroundColor: "#e1f5fe",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sourceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sourceDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  sourceLink: {
    fontSize: 16,
    marginTop: 5,
    color: "#1e88e5",
  },
  faqContainer: {
    marginTop: 20,
  },
  faqBox: {
    backgroundColor: "#f1f8e9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: "bold",
  },
  faqAnswer: {
    fontSize: 16,
    marginTop: 5,
  },
  faqLink: {
    fontSize: 16,
    marginTop: 5,
    color: "#1e88e5",
  },
  contentContainer: {
    marginTop: 20,
  },

  tilbakemeldingerContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#E3EEFC", // Yellow color
    padding: 15,
    borderRadius: 5,
    borderColor: "#293059",
    borderWidth: 1,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  message: {
    marginTop: 20,
    fontSize: 23,
    textAlign: "center",
    fontWeight: "bold",
  },
  aboutBox: {
    borderWidth: 1,
    borderColor: "#1A275E",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#fff",
    marginTop: 20,
  },

  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1A275E",
  },

  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  // Style for the heart image
  heartImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    top: 30,
    marginBottom: 10,
  },
});

export default SettingsDetailScreen;
