import { Stack } from "expo-router";

export default function InstillingerLayout() {
  return (
    <Stack>
      {/* Disable header for /instillinger/[id] */}
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
