import { Stack } from "expo-router";
import { UserProvider } from "./context/UserContext";
import { ResultProvider } from "./context/QuizContext";
import { SectionProvider } from "./context/SectionContext";
import { QuestionProvider } from "./context/QuestionContext";

export default function Layout() {
  return (
    // Providers for global state management across tabs
    <UserProvider>
      <SectionProvider>
        <QuestionProvider>
          <ResultProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="instillinger/[id]"
                options={{ headerShown: false }}
              />
            </Stack>
          </ResultProvider>
        </QuestionProvider>
      </SectionProvider>
    </UserProvider>
  );
}
