import { useUserData } from "@/context/authContext"; // Ensure this path is correct
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { Bell, ChevronRight, FileText, Moon } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, Switch, TouchableOpacity } from "react-native";

const AppSetting = () => {
  const router = useRouter();
  const { user } = useUserData(); // Get user data from context

  // Local state for toggles (Mock functionality)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const profileImage =
    typeof user?.profile === "string" && user.profile.trim() !== ""
      ? user.profile
      : "https://i.pravatar.cc/150";

  // --- REUSABLE SETTING ITEM COMPONENT ---
  const SettingItem = ({
    icon,
    label,
    onPress,
    isDestructive = false,
    hasToggle = false,
    toggleValue = false,
    onToggle = () => {},
  }: any) => (
    <TouchableOpacity
      onPress={hasToggle ? () => onToggle(!toggleValue) : onPress}
      disabled={hasToggle} // If it's a toggle, the row press is disabled (switch handles it)
      activeOpacity={0.7}
    >
      <HStack className="justify-between items-center py-4">
        <HStack className="items-center space-x-4">
          <Box
            className={`p-2 rounded-full ${isDestructive ? "bg-red-50" : "bg-gray-100"}`}
          >
            {React.cloneElement(icon, {
              size: 20,
              color: isDestructive ? "#ef4444" : "#4b5563",
            })}
          </Box>
          <Text
            className={`font-medium text-base ${isDestructive ? "text-red-500" : "text-gray-800"}`}
          >
            {label}
          </Text>
        </HStack>

        {/* Right Side: Toggle Switch or Chevron Arrow */}
        {hasToggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: "#767577", true: "#3b82f6" }}
            thumbColor={"#f4f3f4"}
          />
        ) : (
          !isDestructive && <ChevronRight size={20} color="#9ca3af" />
        )}
      </HStack>
    </TouchableOpacity>
  );

  return (
    <Box className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* --- HEADER --- */}
        <Box className="px-6 pt-12 pb-4">
          <Heading className="text-3xl font-bold text-black">Settings</Heading>
        </Box>

        {/* --- USER PROFILE CARD --- */}
        <Box className="mx-6 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex-row items-center">
          <Avatar size="md" className="mr-4">
            <AvatarFallbackText>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallbackText>

            <AvatarImage source={{ uri: profileImage }} alt="Profile" />
          </Avatar>
          <VStack>
            <Text className="text-lg font-bold text-gray-900">
              {user?.name || "Guest User"}
            </Text>
            <Text className="text-sm text-gray-500">
              {user?.email || "No email linked"}
            </Text>
          </VStack>
        </Box>

        {/* --- SETTINGS GROUPS --- */}
        <VStack className="px-6 space-y-8">
          {/* Group 1: Preferences */}
          <Box>
            <Text
              className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider"
              style={{ lineHeight: 20 }}
            >
              Settings
            </Text>
            <VStack className="bg-white">
              <SettingItem
                icon={<Moon />}
                label="Dark Mode"
                hasToggle
                toggleValue={isDarkMode}
                onToggle={setIsDarkMode}
              />
              <Divider className="bg-gray-100" />
              <SettingItem
                icon={<Bell />}
                label="Push Notifications"
                hasToggle
                toggleValue={isNotificationsEnabled}
                onToggle={setIsNotificationsEnabled}
              />
            </VStack>
          </Box>

          {/* Group 2: Account */}
          <Divider className="bg-gray-100" />
          {/* <Box>
            <VStack>
              <SettingItem
                icon={<Lock />}
                label="Change Password"
                onPress={() =>
                  Alert.alert(
                    "Coming Soon",
                    "Password change feature coming soon!",
                  )
                }
              />
              <Divider className="bg-gray-100" />
              <SettingItem
                icon={<Shield />}
                label="Privacy & Security"
                onPress={() => {}}
              />
            </VStack>
          </Box> */}

          {/* Group 3: Support */}
          {/* <Divider className="bg-gray-100" /> */}
          <Box>
            <VStack>
              {/* <SettingItem
                icon={<HelpCircle />}
                label="Help & Support"
                onPress={() => {}}
              /> */}
              {/* <Divider className="bg-gray-100" /> */}
              <SettingItem
                icon={<FileText />}
                label="Terms & Conditions"
                onPress={() => {}}
              />
            </VStack>
          </Box>

          {/* Version Info */}
          <Box className="items-center mt-4 mb-8">
            <Text className="text-gray-300 text-xs" style={{ lineHeight: 20 }}>
              Version 1.0.0 (Build 204)
            </Text>
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default AppSetting;
