import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { Stack } from "expo-router";
import "../global.css";
// 1. IMPORT REANIMATED LOGGER
import { UserProvider } from "@/context/authContext";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// 2. DISABLE STRICT MODE
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // This disables the specific warning you are seeing
});

export default function RootLayout() {
  return (
    // <AuthProvider>
    <GluestackUIProvider config={config}>
      <UserProvider>
        <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/Welcome" />
          <Stack.Screen name="(auth)/signup" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(main)/(Screen)/profile" />
        </Stack>
      </UserProvider>
    </GluestackUIProvider>
    // </AuthProvider>
  );
}
