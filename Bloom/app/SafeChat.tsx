import { Feather } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GEMINI_API_KEY = "AIzaSyBwTt1fasqUbhrjoAjTR-1kBqnvKebWjtE";

type MessageAction = "play_breathing_video";

const STATIC_RESPONSES: {
  [key: string]: { text: string; action?: MessageAction };
} = {
  "I am feeling stressed": {
    text: "I understand. Stress can be overwhelming. Let's try to calm your body and mind. Here is a short breathing exercise to follow.",
    action: "play_breathing_video",
  },
  "I am feeling lonely": {
    text: "You know you have your true companion, try to talk to it and you will not feel lonely. It's always here to listen.",
  },
  "I am feeling angry": {
    text: "It's valid to feel angry. Taking a moment to breathe can help create some space from that feeling. Let's try this breathing exercise together.",
    action: "play_breathing_video",
  },
  "Feeling overwhelmed?": {
    text: "When things feel like too much, a simple stretch can help. Try this: Sit up straight, and gently tilt your head to your right shoulder. Hold for 15 seconds. Then, slowly switch to the left. This can release tension in your neck.",
  },
  "Having a tough day?": {
    text: "I hear that. Let's try a grounding technique. Name 3 things you can see right now, and 2 things you can hear. This helps bring your focus back to the present moment.",
  },
  "Can't focus?": {
    text: "That's okay. Let's try a simple focus exercise. Close your eyes and just listen to the sounds around you for 30 seconds. Don't judge them, just notice them. This can help reset your attention.",
  },
  default: {
    text: "Thank you for sharing that with me. I'm here to listen without judgment. Tell me more, or pick another option if you like.",
  },
};

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  action?: MessageAction;
}

const ChatNavbar = () => (
  <View style={styles.navBar}>
    <Link href="/home" asChild>
      <TouchableOpacity style={styles.navButton}>
        <Feather name="home" size={28} color="#A9A9A9" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
    </Link>
    <TouchableOpacity style={styles.navButton}>
      <Feather name="message-square" size={28} color="#C870FF" />
      <Text style={[styles.navText, { color: "#C870FF" }]}>Chat</Text>
    </TouchableOpacity>
  </View>
);

export default function SafeChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [videoUri, setVideoUri] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const videoPlayerRef = useRef<Video>(null);

  useEffect(() => {
    setMessages([
      {
        id: "ai-welcome",
        text: "Hello! I'm here to listen. How are you feeling today?",
        sender: "ai",
      },
    ]);
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.sender === "ai" &&
      lastMessage.action === "play_breathing_video"
    ) {
      setTimeout(() => {
        setVideoUri(require("../assets/videos/breathing.mp4"));
      }, 500);
    }
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputText("");

    setTimeout(() => {
      const response = STATIC_RESPONSES[text] || STATIC_RESPONSES["default"];
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: "ai",
        action: response.action,
      };
      setMessages((prev) => [...prev, newAiMessage]);
    }, 1000);
  };

  const closeVideo = () => {
    videoPlayerRef.current?.stopAsync();
    setVideoUri(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <Modal
        visible={videoUri !== null}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.videoOverlay}>
          <Video
            ref={videoPlayerRef}
            source={videoUri}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            style={styles.videoPlayer}
          />
          <TouchableOpacity
            style={styles.closeVideoButton}
            onPress={closeVideo}
          >
            <Feather name="x" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Need a Friendly Ear?</Text>
      </View>

      <View style={styles.chatOptionsContainer}>
        {[
          "I am feeling stressed",
          "I am feeling lonely",
          "I am feeling angry",
        ].map((q) => (
          <TouchableOpacity
            key={q}
            style={styles.quickOptionButton}
            onPress={() => handleSendMessage(q)}
          >
            <Text style={styles.quickOptionText}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chatHistoryContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messageList}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text
                style={msg.sender === "user" ? styles.userText : styles.aiText}
              >
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Or write how you're feeling..."
          placeholderTextColor="#A9A9A9"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSendMessage(inputText)}
        >
          <Feather name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ChatNavbar />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#120E1A" },
  headerContainer: { alignItems: "center", paddingTop: 60, paddingBottom: 20 },
  headerTitle: { color: "#FFFFFF", fontFamily: "Lato-Bold", fontSize: 30 },
  chatOptionsContainer: {
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  quickOptionButton: {
    backgroundColor: "rgba(160, 80, 240, 0.2)",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#A050F0",
    alignItems: "center",
  },
  quickOptionText: { color: "#E0B0FF", fontFamily: "Lato-Bold", fontSize: 16 },
  chatHistoryContainer: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
  messageList: { paddingBottom: 20 },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#A050F0",
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#1F1A2A",
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  userText: { color: "#FFFFFF", fontFamily: "Lato-Regular" },
  aiText: { color: "#E0B0FF", fontFamily: "Lato-Regular" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  textInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#FFFFFF",
    fontFamily: "Lato-Regular",
    fontSize: 16,
    marginRight: 10,
    minHeight: 48,
  },
  sendButton: {
    backgroundColor: "#A050F0",
    borderRadius: 25,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  navBar: {
    width: "100%",
    height: 90,
    backgroundColor: "#1F1A2A",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 10,
  },
  navButton: { alignItems: "center" },
  navText: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    marginTop: 4,
    color: "#A9A9A9",
  },
  videoOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlayer: { position: "absolute", top: 0, left: 0, bottom: 0, right: 0 },
  closeVideoButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
});
