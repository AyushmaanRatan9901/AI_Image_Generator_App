import { Stack } from "expo-router";
import "../../../global.css";
// 1. IMPORT REANIMATED LOGGER
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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" />
    </Stack>
  );
}
