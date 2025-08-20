import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

//Placeholder ikoner. Finne ut om vi skal bruke ikoner som er hardkodet eller bruke bilder.

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#FF9900", // Eller annen farge som passer
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          height: 80,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "index") iconName = "home-outline";
          else if (route.name === "profile") iconName = "person-outline";
          else if (route.name === "ledertavle") iconName = "trophy-outline";
          else if (route.name === "instillinger") iconName = "settings-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Moduler" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
      <Tabs.Screen name="ledertavle" options={{ title: "Ledertavle" }} />
      <Tabs.Screen name="instillinger" options={{ title: "Innstillinger" }} />
    </Tabs>
  );
};