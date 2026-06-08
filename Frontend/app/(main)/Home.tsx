import { API_URL, WORKER_API_KEY, WORKER_URL } from "@/constant";
import { useUserData } from "@/context/authContext";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  InputField,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as MediaLibrary from "expo-media-library";
import { useFocusEffect, useRouter } from "expo-router";

import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import {
  Download,
  Image as ImageIcon,
  Menu,
  MessageSquare,
  Plus,
  Send,
  Share2,
} from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

const Home = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user, refreshUser } = useUserData();

  // --- RESPONSIVE CONFIG ---
  const { width } = useWindowDimensions();
  const { height } = useWindowDimensions();
  const isDesktop = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  const maxWidth = 850; // Desktop/Tablet par content ko center aur clean rakhne ke liye

  // --- STATE ---
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [chatList, setChatList] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- INITIAL LOAD ---
  useFocusEffect(
    useCallback(() => {
      if (refreshUser) refreshUser();
      fetchChatList();
    }, []),
  );

  const fetchChatList = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;
      const response = await fetch(`${API_URL}/api/chats/all`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setChatList(data);
    } catch (error) {
      console.error("❌ Error fetching chat list:", error);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setIsSidebarOpen(false);
  };

  const loadChatSession = async (chatId: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const uiMessages = data.messages.map((msg: any) => ({
          id: msg._id,
          type: msg.role,
          text: msg.type === "text" ? msg.content : null,
          image: msg.type === "image" ? msg.content : null,
        }));
        setMessages(uiMessages);
        setCurrentChatId(chatId);
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error("❌ Error loading chat:", error);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const currentPrompt = prompt;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user", text: currentPrompt },
    ]);
    setPrompt("");
    setLoading(true);
    setTimeout(
      () => scrollViewRef.current?.scrollToEnd({ animated: true }),
      100,
    );

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WORKER_API_KEY}`,
        },
        body: JSON.stringify({ prompt: currentPrompt }),
      });
      if (!response.ok) throw new Error("Worker Generation Failed");
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), type: "bot", image: base64data },
        ]);
        setLoading(false);
        setTimeout(
          () => scrollViewRef.current?.scrollToEnd({ animated: true }),
          100,
        );
        await saveToBackend(base64data, currentPrompt);
      };
    } catch (error: any) {
      Alert.alert("Error", error.message);
      setLoading(false);
    }
  };

  const saveToBackend = async (base64Data: string, userPrompt: string) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;
      let activeId = currentChatId;
      if (!activeId) {
        const createRes = await fetch(`${API_URL}/api/chats/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ firstPrompt: userPrompt }),
        });
        const newChat = await createRes.json();
        if (createRes.ok) {
          activeId = newChat._id;
          setCurrentChatId(activeId);
          fetchChatList();
        } else return;
      }
      const filename = FileSystem.documentDirectory + "temp.jpg";
      const base64Code = base64Data.split("base64,")[1];
      await FileSystem.writeAsStringAsync(filename, base64Code, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const formData = new FormData();
      formData.append("chatId", activeId!);
      formData.append("prompt", userPrompt);
      formData.append("file", {
        uri: filename,
        name: "gen.jpg",
        type: "image/jpeg",
      } as any);
      await fetch(`${API_URL}/api/chats/message`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveImage = async (imgUri: string) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need access to your gallery.");
        return;
      }
      let localUri = imgUri;
      if (imgUri.startsWith("http")) {
        const file = await FileSystem.downloadAsync(
          imgUri,
          FileSystem.documentDirectory + `ai_${Date.now()}.jpg`,
        );
        localUri = file.uri;
      } else {
        const base64Code = imgUri.split("base64,")[1];
        localUri = FileSystem.documentDirectory + `ai_gen_${Date.now()}.jpg`;
        await FileSystem.writeAsStringAsync(localUri, base64Code, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
      await MediaLibrary.saveToLibraryAsync(localUri);
      Alert.alert("Saved!", "Image saved to gallery.");
    } catch (error) {
      Alert.alert("Error", "Failed to save image.");
    }
  };

  const handleShareImage = async (imgUri: string) => {
    try {
      if (!(await Sharing.isAvailableAsync())) return;
      let localUri = imgUri;
      if (imgUri.startsWith("http")) {
        const file = await FileSystem.downloadAsync(
          imgUri,
          FileSystem.documentDirectory + `share_${Date.now()}.jpg`,
        );
        localUri = file.uri;
      } else {
        const base64Code = imgUri.split("base64,")[1];
        localUri = FileSystem.documentDirectory + `share_gen_${Date.now()}.jpg`;
        await FileSystem.writeAsStringAsync(localUri, base64Code, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
      await Sharing.shareAsync(localUri);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar style="dark" />
      <Box className="flex-1 bg-white relative">
        {/* HEADER */}
        <Box className="w-full bg-white z-20 border-b border-gray-100 items-center">
          <HStack
            style={{ maxWidth: maxWidth, width: "100%" }}
            className="justify-between items-center px-5 pt-12 pb-4"
          >
            <HStack className="items-center space-x-3">
              <TouchableOpacity
                onPress={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu color="black" size={28} />
              </TouchableOpacity>
              <Heading className="text-black font-bold">
                Image<Text className="text-blue-500">Gen</Text>
              </Heading>
            </HStack>
            <TouchableOpacity
              onPress={() => router.push("/(main)/(Screen)/profile")}
            >
              <Avatar borderRadius="$full">
                {typeof user?.profile === "string" && user.profile ? (
                  <AvatarImage
                    source={{ uri: user.profile }}
                    alt="User Profile"
                  />
                ) : (
                  <AvatarFallbackText>User</AvatarFallbackText>
                )}
              </Avatar>
            </TouchableOpacity>
          </HStack>
        </Box>

        {/* SIDEBAR */}
        {isSidebarOpen && (
          <Pressable
            onPress={() => setIsSidebarOpen(false)}
            className="absolute top-0 left-0 w-full h-full bg-black/30 z-30"
          >
            <Box
              style={{ width: isDesktop || isTablet ? 320 : "75%" }}
              className="h-full bg-white pt-16 px-4 shadow-xl"
            >
              <Heading className="mb-4 ml-2">History</Heading>
              <TouchableOpacity
                onPress={handleNewChat}
                className="flex-row items-center p-3 mb-2 bg-blue-50 rounded-xl border border-blue-100"
              >
                <Plus size={18} color="#3b82f6" />
                <Text className="ml-3 text-blue-500 font-bold">New Chat</Text>
              </TouchableOpacity>
              <ScrollView>
                {chatList.length === 0 ? (
                  <Text className="text-gray-400 ml-2 mt-2">
                    No conversations yet.
                  </Text>
                ) : (
                  chatList.map((item) => (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() => loadChatSession(item._id)}
                      className={`flex-row items-center p-3 mb-2 rounded-xl ${currentChatId === item._id ? "bg-gray-100" : "bg-gray-50"}`}
                    >
                      <MessageSquare size={18} color="gray" />
                      <Text
                        className="ml-3 text-gray-700 font-medium truncate"
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </Box>
          </Pressable>
        )}

        {/* CHAT AREA */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 150,
            alignItems: "center",
          }}
          className="px-4"
        >
          <VStack style={{ width: "100%", maxWidth: maxWidth }}>
            {messages.length === 0 ? (
              <VStack
                style={{ height: height * 0.6 }} // Screen ki 60% height lega centering ke liye
                className="justify-center items-center opacity-80"
              >
                <LottieView
                  source={require("../../assets/lottie/E V E.json")}
                  autoPlay
                  loop
                  style={{ width: 250, height: 250 }}
                />
                <Heading className="text-center text-2xl mt-4 text-gray-800">
                  Dream it. Type it.
                </Heading>
                <Text className="text-center text-gray-400 mt-2 px-10">
                  Enter a prompt below to generate stunning AI art instantly.
                </Text>
              </VStack>
            ) : (
              <VStack className="space-y-6 mt-4">
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    className={`w-full mt-3 ${msg.type === "user" ? "items-end" : "items-start"}`}
                  >
                    {msg.type === "user" && (
                      <Box className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%]">
                        <Text className="text-gray-800 font-medium">
                          {msg.text}
                        </Text>
                      </Box>
                    )}
                    {msg.type === "bot" && (
                      <Box className="mt-2 rounded-2xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100">
                        <RNImage
                          source={{ uri: msg.image }}
                          style={{
                            width: isDesktop || isTablet ? 500 : width * 0.75,
                            height: isDesktop || isTablet ? 500 : width * 0.75,
                          }}
                          resizeMode="cover"
                        />
                        <HStack className="p-3 justify-between items-center bg-white border-t border-gray-100">
                          <HStack className="items-center space-x-1">
                            <ImageIcon size={14} color="#9CA3AF" />
                            <Text
                              className="text-xs text-gray-400 font-medium"
                              style={{ lineHeight: 20 }}
                            >
                              Generated with AI
                            </Text>
                          </HStack>
                          <HStack className="space-x-3 gap-4">
                            <TouchableOpacity
                              onPress={() => handleSaveImage(msg.image)}
                            >
                              <Download size={20} color="#4B5563" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleShareImage(msg.image)}
                            >
                              <Share2 size={20} color="#4B5563" />
                            </TouchableOpacity>
                          </HStack>
                        </HStack>
                      </Box>
                    )}
                  </Box>
                ))}
                {loading && (
                  <Box className="items-start mt-2">
                    <Box className="bg-blue-50 px-4 py-2 rounded-2xl rounded-tl-none border border-blue-100 flex-row items-center">
                      <LottieView
                        source={require("../../assets/lottie/Loading.json")}
                        autoPlay
                        loop
                        style={{ width: 40, height: 20 }}
                      />
                      <Text
                        className="text-blue-500 text-xs ml-2 font-bold"
                        style={{ lineHeight: 20 }}
                      >
                        Creating magic...
                      </Text>
                    </Box>
                  </Box>
                )}
              </VStack>
            )}
          </VStack>
        </ScrollView>

        {/* INPUT AREA */}
        <Box
          className="absolute bottom-0 w-full items-center bg-white border-t border-gray-100 p-4 pb-8"
          style={{ marginBottom: Platform.OS === "android" ? -30 : 0 }}
        >
          <HStack
            style={{ maxWidth: maxWidth, width: "100%" }}
            className="items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-1"
          >
            <Input borderWidth={0} className="flex-1 h-12 px-4">
              <InputField
                placeholder="Describe your image..."
                value={prompt}
                onChangeText={setPrompt}
                onSubmitEditing={handleGenerate}
                returnKeyType="send"
                placeholderTextColor="#9CA3AF"
                className="text-gray-900"
              />
            </Input>
            <Button
              onPress={handleGenerate}
              borderRadius={20}
              className="rounded-full w-10 h-10 bg-black items-center justify-center p-0 mr-0"
              isDisabled={loading || !prompt}
            >
              <Send size={18} color="white" />
            </Button>
          </HStack>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default Home;
