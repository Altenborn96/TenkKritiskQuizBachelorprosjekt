import { View, Text, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function MoreInfoPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Mer info om modul {id}</Text>
      <Text style={{ marginVertical: 10 }}>
        Dette er en plassholder for informasjon om modulen. Senere vil dette bli hentet fra CMS.
      </Text>

      <Button title="Tilbake til moduler" onPress={() => router.push("/(tabs)")} />




   
    </View>
  );
}
