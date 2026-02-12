import { Button, ButtonText, VStack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const Welcome = () => {
  const router = useRouter();
  return (
    <View className="flex-1  items-center justify-center px-6">
      <VStack className="items-center space-y-6">
        {/* Lottie Animation */}
        <Animated.View entering={FadeInUp.duration(800)}>
          <LottieView
            source={require("../../assets/lottie/E V E.json")}
            autoPlay
            loop
            speed={1}
            style={{ height: 180, width: 180 }}
          />
        </Animated.View>

        {/* App Title */}
        <Animated.View entering={FadeInUp.delay(300).duration(800)}>
          <Text className="text-black text-4xl font-extrabold tracking-widest">
            IMAGE AI
          </Text>
        </Animated.View>

        {/* Quote */}
        <Animated.View entering={FadeInUp.delay(600).duration(800)}>
          <Text className="text-black text-center text-sm px-8 leading-6">
            “Your mind is the canvas.”
          </Text>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View entering={FadeInUp.delay(900).duration(800)}>
          <Button
            onPress={() => router.push("/(auth)/signup")}
            className="mt-8 rounded-full px-10 py-3 bg-white"
          >
            <ButtonText
              className="text-black font-semibold tracking-wide"
              style={{ lineHeight: 18 }}
            >
              Get Started
            </ButtonText>
          </Button>
        </Animated.View>
      </VStack>
    </View>
  );
};

export default Welcome;
