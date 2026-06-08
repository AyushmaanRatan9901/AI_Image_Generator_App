import { API_URL } from "@/constant";
import { Box, Heading, HStack, Text, VStack } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Image as ImageIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  Image as RNImage,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");
// Calculate column width (Screen width / 2 columns - padding)
const COLUMN_WIDTH = (width - 48) / 2;

const Gallery = () => {
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- 1. Fetch Gallery Data ---
  const fetchGallery = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/chats/gallery`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setImages(data);
      }
    } catch (error) {
      console.error("Gallery Fetch Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGallery();
  };

  // --- 2. Navigate to Chat ---
  //   const handleImagePress = (chatId: string) => {
  //     // Navigate to Home and pass the chatId to load
  //     // Note: You might need to update Home.tsx to read 'params' if not already done
  //     router.push({
  //       pathname: "/(main)/Home",
  //       params: { chatId: chatId },
  //     });
  //   };

  // --- 3. Render Single Image Item ---
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      //   onPress={() => handleImagePress(item._id)}
      style={{
        width: COLUMN_WIDTH,
        marginBottom: 16,
        backgroundColor: "#F9FAFB", // gray-50
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#F3F4F6", // gray-200
      }}
    >
      <RNImage
        source={{ uri: item.imageUrl }}
        style={{ width: "100%", height: 180, resizeMode: "cover" }}
      />
      <Box p="$3">
        <Text
          numberOfLines={2}
          className="text-gray-700 font-medium text-xs leading-4"
          style={{ lineHeight: 20 }}
        >
          {item.prompt || "Untitled Creation"}
        </Text>
        <Text className="text-gray-400 text-[10px] mt-1">
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </Box>
    </TouchableOpacity>
  );

  return (
    <Box className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* --- HEADER --- */}
      <Box className="pt-12 pb-4 px-6 bg-white z-10 border-b border-gray-100">
        <HStack className="items-center justify-between">
          <HStack className="items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 -ml-2 rounded-full active:bg-gray-100"
            >
              <ArrowLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <Heading size="xl" className="font-bold text-gray-900 ml-2">
              Gallery
            </Heading>
          </HStack>
          <Box className="bg-gray-100 px-3 py-1 rounded-full">
            <Text
              className="text-xs font-bold text-gray-500"
              style={{ lineHeight: 20 }}
            >
              {images.length} Arts
            </Text>
          </Box>
        </HStack>
      </Box>

      {/* --- CONTENT --- */}
      {loading ? (
        <Box className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </Box>
      ) : (
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id + index}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", gap: "10" }}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <VStack className="flex-1 items-center justify-center mt-20 opacity-60">
              <Box className="bg-gray-50 p-6 rounded-full mb-4">
                <ImageIcon size={40} color="#9CA3AF" />
              </Box>
              <Text className="text-gray-500 font-medium text-lg">
                No images yet
              </Text>
              <Text className="text-gray-400 text-sm text-center px-10 mt-1">
                Start generating images to see them appear here!
              </Text>
            </VStack>
          }
        />
      )}
    </Box>
  );
};

export default Gallery;
