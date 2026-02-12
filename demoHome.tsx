// import {
//   Avatar,
//   AvatarFallbackText,
//   AvatarImage,
//   Box,
//   Button,
//   Heading,
//   HStack,
//   Input,
//   InputField,
//   Pressable,
//   Text,
//   VStack,
// } from "@gluestack-ui/themed";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import LottieView from "lottie-react-native";
// import {
//   Image as ImageIcon,
//   LogOut,
//   Menu,
//   MessageSquare,
//   Send,
// } from "lucide-react-native";
// import React, { useRef, useState } from "react";
// import {
//   Dimensions,
//   KeyboardAvoidingView,
//   Platform,
//   Image as RNImage,
//   ScrollView,
//   TouchableOpacity,
// } from "react-native";

// // Mock Data for Sidebar History
// const MOCK_HISTORY = [
//   { id: "1", title: "Cyberpunk City" },
//   { id: "2", title: "Cute Cat in Space" },
//   { id: "3", title: "Abstract Oil Painting" },
// ];

// const { width } = Dimensions.get("window");

// const Home = () => {
//   const router = useRouter();
//   const [prompt, setPrompt] = useState("");
//   const [messages, setMessages] = useState<any[]>([]); // Stores chat history
//   const [loading, setLoading] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const scrollViewRef = useRef<ScrollView>(null);

//   // Logout Function
//   const handleLogout = async () => {
//     await AsyncStorage.removeItem("userToken");
//     router.replace("/(auth)/login");
//   };

//   // Generate Image Function (Mocked)
//   const handleGenerate = async () => {
//     if (!prompt.trim()) return;

//     // 1. Add User Prompt to Chat
//     const userMessage = {
//       id: Date.now().toString(),
//       type: "user",
//       text: prompt,
//     };
//     setMessages((prev) => [...prev, userMessage]);
//     setPrompt("");
//     setLoading(true);

//     // Scroll to bottom
//     setTimeout(
//       () => scrollViewRef.current?.scrollToEnd({ animated: true }),
//       100,
//     );

//     // 2. Simulate API Call (Replace with real API later)
//     setTimeout(() => {
//       const aiMessage = {
//         id: (Date.now() + 1).toString(),
//         type: "bot",
//         image: `https://image.pollinations.ai/prompt/${encodeURIComponent(userMessage.text)}`, // Free AI Image API for testing
//       };
//       setMessages((prev) => [...prev, aiMessage]);
//       setLoading(false);
//       setTimeout(
//         () => scrollViewRef.current?.scrollToEnd({ animated: true }),
//         100,
//       );
//     }, 3000); // 3 seconds delay for effect
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={{ flex: 1 }}
//     >
//       <StatusBar style="dark" />

//       {/* MAIN CONTAINER (ZStack) */}
//       <Box className="flex-1 bg-white relative">
//         {/* --- HEADER --- */}
//         <HStack className="justify-between items-center px-5 pt-12 pb-4 bg-white z-20 border-b border-gray-100">
//           <HStack className="items-center space-x-3">
//             <TouchableOpacity onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
//               <Menu color="black" size={28} />
//             </TouchableOpacity>
//             <Heading className="text-black font-bold">
//               Image<Text className="text-blue-500">Gen</Text>
//             </Heading>
//           </HStack>

//           <Avatar borderRadius="$full">
//             <AvatarFallbackText>User</AvatarFallbackText>
//             <AvatarImage
//               source={{
//                 uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
//               }}
//             />
//           </Avatar>
//         </HStack>

//         {/* --- SIDEBAR (Overlay) --- */}
//         {isSidebarOpen && (
//           <Pressable
//             onPress={() => setIsSidebarOpen(false)}
//             className="absolute top-0 left-0 w-full h-full bg-black/30 z-30"
//           >
//             <Box className="h-full w-[70%] bg-white pt-16 px-4 shadow-xl">
//               <Heading className="mb-6 ml-2">History</Heading>
//               {MOCK_HISTORY.map((item) => (
//                 <TouchableOpacity
//                   key={item.id}
//                   className="flex-row items-center p-3 mb-2 bg-gray-50 rounded-xl"
//                 >
//                   <MessageSquare size={18} color="gray" />
//                   <Text className="ml-3 text-gray-700 font-medium">
//                     {item.title}
//                   </Text>
//                 </TouchableOpacity>
//               ))}

//               <TouchableOpacity
//                 onPress={handleLogout}
//                 className="absolute bottom-10 left-4 flex-row items-center p-4 bg-red-50 rounded-xl w-full"
//               >
//                 <LogOut size={20} color="red" />
//                 <Text className="ml-3 text-red-500 font-bold">Logout</Text>
//               </TouchableOpacity>
//             </Box>
//           </Pressable>
//         )}

//         {/* --- MAIN SCROLLABLE AREA --- */}
//         <ScrollView
//           ref={scrollViewRef}
//           contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
//           className="px-4"
//         >
//           {messages.length === 0 ? (
//             /* EMPTY STATE TAGLINE */
//             <VStack className="flex-1 justify-center items-center mt-20 opacity-80">
//               <LottieView
//                 source={require("../../assets/lottie/ai-image.json")}
//                 // autoPlay
//                 // loop
//                 style={{ width: 250, height: 250 }}
//               />
//               <Heading className="text-center text-2xl mt-4 text-gray-800">
//                 Dream it. Type it.
//               </Heading>
//               <Text className="text-center text-gray-400 mt-2 px-10">
//                 Enter a prompt below to generate stunning AI art instantly.
//               </Text>
//             </VStack>
//           ) : (
//             /* CHAT MESSAGES */
//             <VStack className="space-y-6 mt-4">
//               {messages.map((msg) => (
//                 <Box
//                   key={msg.id}
//                   className={`w-full ${msg.type === "user" ? "items-end" : "items-start"}`}
//                 >
//                   {/* User Message (Text) */}
//                   {msg.type === "user" && (
//                     <Box className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%]">
//                       <Text className="text-gray-800 font-medium">
//                         {msg.text}
//                       </Text>
//                     </Box>
//                   )}

//                   {/* Bot Message (Image) */}
//                   {msg.type === "bot" && (
//                     <Box className="mt-2 rounded-2xl overflow-hidden shadow-sm bg-gray-50 border border-gray-100">
//                       <RNImage
//                         source={{ uri: msg.image }}
//                         style={{ width: width * 0.75, height: width * 0.75 }}
//                         resizeMode="cover"
//                       />
//                       <HStack className="p-3 justify-between items-center bg-white">
//                         <Text className="text-xs text-gray-400">
//                           Generated with AI
//                         </Text>
//                         <ImageIcon size={16} color="gray" />
//                       </HStack>
//                     </Box>
//                   )}
//                 </Box>
//               ))}

//               {/* Loading Animation Bubble */}
//               {loading && (
//                 <Box className="items-start mt-2">
//                   <Box className="bg-blue-50 px-4 py-2 rounded-2xl rounded-tl-none border border-blue-100 flex-row items-center">
//                     <LottieView
//                       source={require("../../assets/lottie/Loading.json")} // Ensure you have a loading json
//                       autoPlay
//                       loop
//                       style={{ width: 40, height: 20 }}
//                     />
//                     <Text className="text-blue-500 text-xs ml-2 font-bold">
//                       Creating magic...
//                     </Text>
//                   </Box>
//                 </Box>
//               )}
//             </VStack>
//           )}
//         </ScrollView>

//         {/* --- INPUT AREA (Fixed Bottom) --- */}
//         <Box className="absolute bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-8">
//           <HStack className="w-full items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
//             <Input className="flex-1 h-12 px-4">
//               <InputField
//                 placeholder="Describe your image..."
//                 value={prompt}
//                 onChangeText={setPrompt}
//                 onSubmitEditing={handleGenerate}
//                 returnKeyType="send"
//                 placeholderTextColor="#9CA3AF"
//                 className="text-gray-900"
//               />
//             </Input>
//             <Button
//               onPress={handleGenerate}
//               className="rounded-full w-10 h-10 bg-black items-center justify-center p-0 mr-1"
//               isDisabled={loading || !prompt}
//             >
//               {loading ? (
//                 <Box className="opacity-50">
//                   <Send size={18} color="white" />
//                 </Box>
//               ) : (
//                 <Send size={18} color="white" />
//               )}
//             </Button>
//           </HStack>
//         </Box>
//       </Box>
//     </KeyboardAvoidingView>
//   );
// };

// export default Home;
