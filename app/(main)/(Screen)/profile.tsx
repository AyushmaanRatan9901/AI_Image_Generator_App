import { API_URL } from "@/constant";
import { useUserData } from "@/context/authContext";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Heading,
  HStack,
  Input,
  InputField,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeft,
  Camera,
  ChevronRight,
  HelpCircle,
  ImageIcon,
  LogOut,
  Mail,
  Phone,
  Settings,
  Share2,
  User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Share,
  TouchableOpacity,
} from "react-native";

// Mock Data for Gallery Preview

const Profile = () => {
  const router = useRouter();
  const { user } = useUserData();

  // State
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [uploading, setUploading] = useState(false);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [phone, setPhone] = useState(user?.phone || "");

  // ✅ FIX 1: Add a cache buster timestamp to ensure image refreshes
  const [avatar, setAvatar] = useState(
    user?.profile
      ? `${user.profile}?t=${Date.now()}`
      : "https://i.pravatar.cc/300",
  );

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 1. Fetch User Profile
  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("User Data:", data);

      if (response.ok) {
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || "");
        if (data.profile) {
          // ✅ FIX: Force update with new timestamp
          setAvatar(`${data.profile}?t=${Date.now()}`);
        }
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
    }
  };

  // 2. Save/Update User Data
  const handleUpdate = async () => {
    setUploading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);

      if (newImageUri) {
        const filename = newImageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename || "");
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("file", {
          uri: newImageUri,
          name: filename || "profile.jpg",
          type: type,
        } as any);
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Profile Updated!");
        if (data.profile) {
          // ✅ FIX: Update avatar state immediately with new timestamp to refresh UI
          setAvatar(`${data.profile}?t=${Date.now()}`);
        }
        setNewImageUri(null);
      } else {
        Alert.alert("Error", data.message || "Update Failed");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Connection Error", "Could not connect to server");
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatar(uri); // Show preview immediately
      setNewImageUri(uri);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("userToken");
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  // --- 🔗 Share Function ---
  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "Check out this AI Image Generator App! Download here: https://your-link.com",
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <Box className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* --- HEADER --- */}
      <Box className="pt-14 pb-4 px-6 bg-white z-10 border-b border-gray-50">
        <HStack className="justify-between items-center">
          <HStack className="items-center space-x-4 gap-3">
            {/* Professional Back Button */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 bg-gray-50 rounded-full border border-gray-100"
            >
              <ArrowLeft size={22} color="#1F2937" />
            </TouchableOpacity>

            <Heading size="xl" className="font-bold text-gray-900">
              Profile
            </Heading>
          </HStack>

          <TouchableOpacity
            onPress={handleUpdate}
            disabled={uploading}
            className={`px-4 py-2 rounded-full ${uploading ? "bg-gray-50" : "bg-green-50"}`}
          >
            {uploading ? (
              <ActivityIndicator size="small" color="#16a34a" />
            ) : (
              <Text
                className={`font-bold text-base ${uploading ? "text-gray-400" : "text-green-600"}`}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* --- AVATAR SECTION --- */}
        <VStack className="items-center mt-4 mb-8">
          <Box className="relative">
            <Avatar
              size="2xl"
              className="border-4 border-white shadow-lg h-32 w-32"
            >
              {avatar && typeof avatar === "string" ? (
                <AvatarImage
                  key={avatar}
                  source={{ uri: avatar }}
                  alt="profile"
                />
              ) : (
                <AvatarFallbackText>
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallbackText>
              )}
            </Avatar>

            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.8}
              className="absolute bottom-0 right-0 bg-black p-2.5 rounded-full border-2 border-white shadow-sm"
            >
              <Camera size={18} color="white" />
            </TouchableOpacity>
          </Box>
          <Text className="mt-4 text-xl font-bold text-gray-900">{name}</Text>
          <Text className="text-gray-500 text-sm">Free Plan Member</Text>
        </VStack>

        {/* --- PERSONAL INFO FORM --- */}
        <VStack space="md" className="px-6">
          <Text className="text-gray-900 font-bold mb-1 text-lg">
            Personal Info
          </Text>

          <HStack className="items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
            <User size={20} color="#9CA3AF" />
            <Input className="flex-1 ml-2 h-full">
              <InputField
                value={name}
                onChangeText={setName}
                className="text-gray-900 font-medium"
              />
            </Input>
          </HStack>

          <HStack className="items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
            <Mail size={20} color="#9CA3AF" />
            <Input isDisabled={true} className="flex-1 ml-2 h-full opacity-60">
              <InputField
                value={email}
                editable={false}
                className="text-gray-500 font-medium"
              />
            </Input>
          </HStack>

          <HStack className="items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 h-14">
            <Phone size={20} color="#9CA3AF" />
            <Input className="flex-1 ml-2 h-full">
              <InputField
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                className="text-gray-900 font-medium"
              />
            </Input>
          </HStack>
        </VStack>

        {/* --- GALLERY PREVIEW SECTION --- */}
        <Box className="mt-8 px-6">
          <HStack className="justify-between items-center mb-4">
            <Text className="text-gray-900 font-bold text-lg">
              My Creations
            </Text>

            <Text className="text-blue-600 font-semibold text-sm">
              View All
            </Text>
          </HStack>

          <TouchableOpacity
            onPress={() => router.push("/(main)/(Screen)/Gallery")}
            activeOpacity={0.8}
            className="flex-row items-center bg-white p-4 rounded-3xl mb-4 border border-gray-100"
            style={{
              shadowColor: "#6366f1", // Subtle indigo glow
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.08,
              shadowRadius: 15,
              elevation: 6,
            }}
          >
            {/* 🎨 Attractive Icon Box */}
            <Box className="w-14 h-14 bg-indigo-50 rounded-2xl items-center justify-center border border-indigo-100">
              <ImageIcon size={26} color="#6366f1" />
            </Box>

            {/* 📝 Text Content */}
            <VStack className="flex-1 ml-4">
              <Text className="text-gray-900 font-bold text-lg">
                My Gallery
              </Text>
              <Text className="text-gray-400 text-xs font-medium mt-0.5">
                View your generated art
              </Text>
            </VStack>

            {/* ➡️ Arrow Indicator */}
            <Box className="bg-gray-50 p-2.5 rounded-full">
              <ChevronRight size={20} color="#9CA3AF" />
            </Box>
          </TouchableOpacity>
        </Box>

        {/* --- SETTINGS MENU (Replaced MenuItem with TouchableOpacity) --- */}
        <VStack className="mt-8 px-6 space-y-2">
          <Text className="text-gray-900 font-bold mb-2 text-lg">Options</Text>

          {/* App Settings */}
          <TouchableOpacity
            onPress={() => router.push("/(main)/(Screen)/appSettings")}
            className="flex-row items-center bg-white border border-gray-100 p-4 rounded-2xl mb-3 shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            <Box className="p-2 bg-gray-50 rounded-full">
              <Settings size={20} color="#374151" />
            </Box>
            <Text className="flex-1 ml-4 text-gray-700 font-semibold text-base">
              App Settings
            </Text>
            <ChevronRight size={20} color="#D1D5DB" />
          </TouchableOpacity>

          {/* Share App */}
          <TouchableOpacity
            onPress={handleShareApp}
            className="flex-row items-center bg-white border border-gray-100 p-4 rounded-2xl mb-3 shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            <Box className="p-2 bg-gray-50 rounded-full">
              <Share2 size={20} color="#374151" />
            </Box>
            <Text className="flex-1 ml-4 text-gray-700 font-semibold text-base">
              Share App
            </Text>
            <ChevronRight size={20} color="#D1D5DB" />
          </TouchableOpacity>

          {/* Help & Support */}
          <TouchableOpacity
            onPress={() => router.push("/(main)/(Screen)/helpCenter")}
            className="flex-row items-center bg-white border border-gray-100 p-4 rounded-2xl mb-3 shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.03,
              shadowRadius: 5,
              elevation: 2,
            }}
          >
            <Box className="p-2 bg-gray-50 rounded-full">
              <HelpCircle size={20} color="#374151" />
            </Box>
            <Text className="flex-1 ml-4 text-gray-700 font-semibold text-base">
              Help & Support
            </Text>
            <ChevronRight size={20} color="#D1D5DB" />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center bg-red-50 p-4 rounded-2xl mt-2"
          >
            <Box className="p-2 bg-white rounded-full">
              <LogOut size={20} color="#EF4444" />
            </Box>
            <Text className="flex-1 ml-4 text-red-500 font-bold text-base">
              Logout
            </Text>
            <ChevronRight size={20} color="#FCA5A5" />
          </TouchableOpacity>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default Profile;
