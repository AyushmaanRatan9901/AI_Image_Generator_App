import { Box, HStack, Heading, Icon, Text, VStack } from "@gluestack-ui/themed";
import { StatusBar } from "expo-status-bar";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Globe,
  Mail,
  Search,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Linking,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  UIManager,
} from "react-native";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- MOCK DATA: FAQs ---
const FAQS = [
  {
    id: 1,
    question: "How do I generate an image?",
    answer:
      "Simply go to the Home screen, type a description of the image you want in the text box at the bottom, and tap the Send button. The AI will generate it in a few seconds.",
  },
  {
    id: 2,
    question: "Is this app free to use?",
    answer:
      "Yes! You can generate images for free. We may introduce premium features in the future for higher resolution or faster generation speeds.",
  },
  {
    id: 3,
    question: "How do I save images to my phone?",
    answer:
      "After an image is generated, tap the 'Download' icon below the image. You may need to grant permission to access your photo gallery.",
  },
  {
    id: 4,
    question: "Why is the generation failing?",
    answer:
      "This can happen due to network issues or high server traffic. Please check your internet connection and try again. If the problem persists, contact support.",
  },
  {
    id: 5,
    question: "Can I delete my chat history?",
    answer:
      "Currently, chat history is stored securely. We are working on a feature to allow users to manually delete specific conversations in the next update.",
  },
];

const HelpCenter = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  // Toggle Accordion
  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter FAQs based on search
  const filteredFAQs = FAQS.filter((item) =>
    item.question.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Handle Contact Actions
  const handleEmailSupport = () => {
    Linking.openURL("mailto:support@imagegen.ai?subject=Help Request");
  };

  const handleWebsite = () => {
    Linking.openURL("https://www.google.com"); // Replace with your website
  };

  return (
    <Box className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* --- HEADER --- */}
      <Box className="pt-12 pb-4 px-6 bg-white z-10">
        <Heading
          size="2xl"
          className="font-bold text-gray-900 mb-2"
          style={{ lineHeight: 50 }}
        >
          Help Center
        </Heading>
        <Text className="text-gray-500 text-sm">
          How can we help you today?
        </Text>

        {/* Search Bar */}
        <HStack className="bg-gray-100 rounded-xl px-4 h-12 items-center mt-6">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search for help..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-gray-800 font-medium h-full"
            value={searchText}
            onChangeText={setSearchText}
          />
        </HStack>
      </Box>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="px-6"
      >
        {/* --- FAQ SECTION --- */}
        <VStack space="md" className="mt-4">
          <Text className="text-gray-900 font-bold text-lg mb-2">
            Frequently Asked Questions
          </Text>

          {filteredFAQs.map((item) => (
            <Box
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-3 shadow-sm"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.02,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
                className="flex-row justify-between items-center p-4 bg-gray-50"
              >
                <HStack className="items-center flex-1 pr-4">
                  <FileText size={18} color="#4B5563" />
                  <Text className="ml-3 text-gray-800 font-semibold text-sm">
                    {item.question}
                  </Text>
                </HStack>
                {expandedId === item.id ? (
                  <ChevronUp size={20} color="#6B7280" />
                ) : (
                  <ChevronDown size={20} color="#6B7280" />
                )}
              </TouchableOpacity>

              {expandedId === item.id && (
                <Box className="p-4 bg-white border-t border-gray-100">
                  <Text className="text-gray-600 leading-6 text-sm">
                    {item.answer}
                  </Text>
                </Box>
              )}
            </Box>
          ))}

          {filteredFAQs.length === 0 && (
            <Box className="items-center py-10">
              <Text className="text-gray-400">No results found.</Text>
            </Box>
          )}
        </VStack>

        {/* --- CONTACT SUPPORT SECTION --- */}
        <VStack space="md" className="mt-8 mb-8">
          <Text className="text-gray-900 font-bold text-lg mb-2">
            Still need help?
          </Text>

          {/* Email Support Card */}
          <TouchableOpacity
            onPress={handleEmailSupport}
            className="flex-row items-center bg-blue-50 p-4 rounded-2xl border border-blue-100"
          >
            <Box className="p-3 bg-white rounded-full">
              <Mail size={24} color="#3B82F6" />
            </Box>
            <VStack className="ml-4 flex-1">
              <Text className="text-gray-900 font-bold text-base">
                Email Support
              </Text>
              <Text
                className="text-gray-500 text-xs mt-0.5"
                style={{ lineHeight: 20 }}
              >
                Get a response within 24 hours
              </Text>
            </VStack>
            <ChevronRight size={20} color="#93C5FD" />
          </TouchableOpacity>

          {/* Website Card */}
          <TouchableOpacity
            onPress={handleWebsite}
            className="flex-row items-center bg-green-50 p-4 rounded-2xl border border-green-100 mt-3"
          >
            <Box className="p-3 bg-white rounded-full">
              <Globe size={24} color="#10B981" />
            </Box>
            <VStack className="ml-4 flex-1">
              <Text className="text-gray-900 font-bold text-base">
                Visit Website
              </Text>
              <Text
                className="text-gray-500 text-xs mt-0.5"
                style={{ lineHeight: 20 }}
              >
                View tutorials and guides
              </Text>
            </VStack>
            <ChevronRight size={20} color="#6EE7B7" />
          </TouchableOpacity>
        </VStack>

        {/* Footer */}
        <Box className="items-center mt-4">
          <Text className="text-gray-300 text-xs" style={{ lineHeight: 20 }}>
            App Version 1.0.0 • Made with ❤️
          </Text>
        </Box>
      </ScrollView>
    </Box>
  );
};

// Helper Component for Chevron Right (used in contact cards)
const ChevronRight = ({ size, color }: { size: number; color: string }) => (
  <Icon
    as={ChevronDown}
    size="sm"
    style={{ transform: [{ rotate: "-90deg" }] }}
    color={color}
  />
);

export default HelpCenter;
