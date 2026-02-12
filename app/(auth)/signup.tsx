import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../constant/index";

const Signup = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Disable button if fields are empty
  const isDisabled = !name || !email || !password;

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (response.ok) {
        //1.
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("userInfo", JSON.stringify(data));
        //2. routes to Home
        router.replace("/(main)/Home");
      } else {
        Alert.alert("Signup Failed", data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error:",
        "Could not connect to the Server , Check Internet Connection and Try Again",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
        className="px-6 py-6"
      >
        {/* Header Section with Main Lottie Animation */}
        <View className="items-center mb-6">
          <View className="h-48 w-48 mb-4">
            {/* Keep this as Lottie for the main illustration */}
            <LottieView
              source={require("../../assets/lottie/signup.json")}
              autoPlay
              loop
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <Text className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </Text>
          <Text className="text-gray-500 mt-2 text-base">
            Start creating with AI ✨
          </Text>
        </View>

        {/* Input Fields Section */}
        <View className="space-y-4 w-full">
          {/* Name Input */}
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:border-black focus:bg-white transition-all mb-4">
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base font-medium"
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email Input */}
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:border-black focus:bg-white transition-all mb-4">
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base font-medium"
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:border-black focus:bg-white transition-all">
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-900 text-base font-medium"
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            {/* Eye Icon to Toggle Password */}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <View className="items-end mt-2">
            <TouchableOpacity
              onPress={() => console.log("This Feature Coming Soon")}
            >
              <Text className="text-sm font-semibold text-gray-900">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            disabled={isDisabled}
            className={`w-full py-4 rounded-2xl items-center shadow-sm mt-4 ${
              isDisabled ? "bg-gray-200" : "bg-gray-900"
            }`}
            activeOpacity={0.8}
            onPress={handleSignup}
          >
            <Text
              className={`font-bold text-lg ${isDisabled ? "text-gray-400" : "text-white"}`}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-[1px] bg-gray-200" />
          <Text className="mx-4 text-gray-400 font-medium text-sm">
            Or continue with
          </Text>
          <View className="flex-1 h-[1px] bg-gray-200" />
        </View>

        {/* Social Login Buttons (Vector Icons) */}
        <View className="flex-row justify-center space-x-6 mb-8 gap-3">
          {/* Google Button */}
          <TouchableOpacity className="w-16 h-16 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm">
            <Ionicons name="logo-google" size={24} color="black" />
          </TouchableOpacity>

          {/* Apple Button */}
          <TouchableOpacity className="w-16 h-16 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm">
            <Ionicons name="logo-apple" size={28} color="black" />
          </TouchableOpacity>

          {/* GitHub Button */}
          <TouchableOpacity className="w-16 h-16 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm">
            <Ionicons name="logo-github" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Login Navigation */}
        <View className="flex-row justify-center mb-4">
          <Text className="text-gray-500 font-medium">
            Already have an account?{" "}
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-gray-900 font-bold underline">Log In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Signup;
