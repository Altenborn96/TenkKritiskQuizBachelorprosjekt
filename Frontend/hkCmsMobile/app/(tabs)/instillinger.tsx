import { Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // for icons
import { SafeAreaView } from "react-native-safe-area-context";
import DoodlesBackgroundBlue from "@/components/doodlesbackgroundBlue";

const settingsPages = [
  { id: 4, title: "Om oss", icon: "heart-outline" },
  { id: 5, title: "Personvern", icon: "lock-closed-outline" },
  { id: 3, title: "Kildeliste", icon: "document-text-outline" },
  { id: 1, title: "Begrepliste", icon: "book-outline" },
  { id: 2, title: "FAQ", icon: "help-circle-outline" },
  { id: 6, title: "Tilbakemeldinger", icon: "chatbubble-ellipses-outline" },
];

const InstillingerScreen = () => {
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/login");
  };

  return (
    <DoodlesBackgroundBlue>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <Text
          style={{
            color: "#1A275E",
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Innstillinger
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {settingsPages.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 15,
                marginBottom: 10,
                borderWidth: 2,
                borderColor: "#1A275E",
                borderRadius: 12,
                backgroundColor: "#DCE7F4",
              }}
              onPress={() => router.push(`/instillinger/${item.id}`)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color="#333"
                style={{ marginRight: 10 }}
              />
              <Text style={{ fontSize: 18, flex: 1 }}>{item.title}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: "#C81010",
            padding: 15,
            borderRadius: 15,
          }}
          onPress={handleLogout}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Logg ut
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </DoodlesBackgroundBlue>
  );
};

export default InstillingerScreen;
