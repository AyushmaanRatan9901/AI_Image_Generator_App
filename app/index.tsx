import { Box, Text, VStack } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { View } from "react-native"; // Use standard View for layout if relying on className
import Animated, { FadeInDown } from "react-native-reanimated";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // 1. Artificial Delay (optional): Keep splash visible for at least 2.5 seconds
        // so the user sees your nice animation.
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // 2. Check AsyncStorage for token
        const token = await AsyncStorage.getItem("userToken");

        // 3. Decide where to go
        if (token) {
          // User is logged in -> Go to Home
          router.replace("/(main)/Home");
        } else {
          // No token -> Go to Welcome/Login
          router.replace("/(auth)/Welcome");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        // Safety fallback
        router.replace("/(auth)/Welcome");
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <Box className="flex-1 items-center justify-center">
      {/* Hide Status Bar for immersive splash feel */}
      <StatusBar style="light" hidden={true} />

      <VStack className="items-center space-y-4">
        {/* Lottie Animation */}
        <View className="mb-6">
          <LottieView
            source={require("../assets/lottie/ai-image.json")}
            autoPlay
            loop={false} // Play once usually looks cleaner for splash, or loop if it's a subtle motion
            speed={1.0}
            style={{ width: 280, height: 280 }}
          />
        </View>

        {/* Animated Title */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(1000).springify()}
        >
          <Text className="text-black text-5xl font-extrabold tracking-[0.2em] text-center">
            IMAGE AI
          </Text>
        </Animated.View>

        {/* Animated Tagline (Delayed) */}
        <Animated.View
          entering={FadeInDown.delay(800).duration(1000).springify()}
        >
          <Text className="text-black text-sm text-center px-10 mt-2 opacity-80 font-medium">
            Generate stunning images from simple text
          </Text>
        </Animated.View>
      </VStack>
    </Box>
  );
}
