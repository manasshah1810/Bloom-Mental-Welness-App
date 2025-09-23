import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getUsers } from "../../services/userService";

interface WelcomeMessageProps {
  username: string | undefined;
}

const HomeHeader = () => (
  <View style={styles.header}>
    <Image
      source={require("../../assets/images/Logo.png")}
      style={styles.headerLogo}
    />
    <Text style={styles.headerTitle}>Home</Text>
  </View>
);

const WelcomeMessage = ({ username }: WelcomeMessageProps) => (
  <View style={styles.welcomeContainer}>
    <Text style={styles.welcomeText}>Welcome back,</Text>
    <Text style={styles.usernameText}>{username || "Manas"}</Text>
  </View>
);

const TopActionCards = () => (
  <View style={styles.topCardContainer}>
    <Link href="/SafeChat" asChild>
      <TouchableOpacity style={styles.topCard}>
        <Feather name="heart" size={24} color="#FFFFFF" />
        <Text style={styles.topCardTitle}>One-Tap SOS</Text>
        <Text style={styles.topCardSubtitle}>Feel Blank?</Text>
      </TouchableOpacity>
    </Link>
    <Link href="/MindUnload" asChild>
      <TouchableOpacity style={styles.topCard}>
        <Feather name="mic" size={24} color="#FFFFFF" />
        <Text style={styles.topCardTitle}>Mind Unload</Text>
        <Text style={styles.topCardSubtitle}>Speak Freely</Text>
      </TouchableOpacity>
    </Link>
  </View>
);

const JourneySection = () => (
  <View style={styles.journeyContainer}>
    <Text style={styles.sectionTitle}>Your Journey</Text>
    <View style={styles.lifeTreeCard}>
      <Image
        source={require("../../assets/images/LifeTree.png")}
        style={styles.lifeTreeImage}
        defaultSource={require("../../assets/images/Logo.png")}
      />
    </View>
  </View>
);

const BottomNavBar = () => (
  <View style={styles.navBar}>
    <TouchableOpacity style={styles.navButton}>
      <Feather name="home" size={28} color="#C870FF" />
      <Text style={[styles.navText, { color: "#C870FF" }]}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navButton}>
      <Feather name="book-open" size={28} color="#A9A9A9" />
      <Text style={styles.navText}>Journal</Text>
    </TouchableOpacity>
    <Link href="/(companion)" asChild>
      <TouchableOpacity style={styles.centralNavButton}>
        <Feather name="heart" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </Link>
    <TouchableOpacity style={styles.navButton}>
      <Feather name="users" size={28} color="#A9A9A9" />
      <Text style={styles.navText}>Circles</Text>
      <View style={styles.notificationDot} />
    </TouchableOpacity>
    <TouchableOpacity style={styles.navButton}>
      <Feather name="user" size={28} color="#A9A9A9" />
      <Text style={styles.navText}>Profile</Text>
    </TouchableOpacity>
  </View>
);

export default function HomeScreen() {
  const [username, setUsername] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        if (userToken) {
          const allUsers = await getUsers();
          const currentUser = allUsers.find((user) => user.email === userToken);
          if (currentUser) {
            setUsername(currentUser.username);
          }
        } else {
          router.replace("/");
        }
      } catch (error) {
        console.error("Failed to load user data", error);
        router.replace("/");
      }
    };
    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HomeHeader />
        <WelcomeMessage username={username} />
        <TopActionCards />
        <JourneySection />
        </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#120E1A" },
  scrollContainer: { paddingBottom: 120, paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60,
    marginBottom: 20,
  },
  headerLogo: { width: 40, height: 40, resizeMode: "contain" },
  headerTitle: {
    color: "#FFFFFF",
    fontFamily: "Lato-Bold",
    fontSize: 20,
    marginLeft: 10,
  },
  welcomeContainer: { marginBottom: 25 },
  welcomeText: { color: "#A9A9A9", fontFamily: "Lato-Regular", fontSize: 24 },
  usernameText: { color: "#FFFFFF", fontFamily: "Lato-Bold", fontSize: 32 },
  topCardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  topCard: {
    backgroundColor: "#A050F0",
    borderRadius: 20,
    padding: 20,
    width: "48%",
    shadowColor: "#A050F0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  topCardTitle: {
    color: "#FFFFFF",
    fontFamily: "Lato-Bold",
    fontSize: 18,
    marginTop: 10,
  },
  topCardSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontFamily: "Lato-Bold",
    fontSize: 22,
    marginBottom: 15,
  },
  journeyContainer: { alignItems: "center", marginBottom: 30 },
  lifeTreeCard: {
    backgroundColor: "#1F1A2A",
    borderRadius: 25,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  lifeTreeImage: { width: 200, height: 200, resizeMode: "contain" },
  lifeTreeLabel: {
    color: "#A9A9A9",
    fontFamily: "Lato-Regular",
    fontSize: 16,
    marginTop: 15,
  },
  progressBarBackground: {
    height: 8,
    width: "60%",
    backgroundColor: "#1F1A2A",
    borderRadius: 4,
    marginTop: 10,
  },
  progressBarFill: {
    height: "100%",
    width: "75%",
    backgroundColor: "#A050F0",
    borderRadius: 4,
  },
  bottomCirclesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  circleButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F1A2A",
    borderRadius: 20,
    paddingVertical: 15,
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "rgba(160, 80, 240, 0.3)",
  },
  circleButtonText: {
    color: "#E0B0FF",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    marginTop: 8,
  },
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "#1F1A2A",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  navButton: { alignItems: "center" },
  navText: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    color: "#A9A9A9",
    marginTop: 4,
  },
  centralNavButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#C870FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
    shadowColor: "#C870FF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
    borderWidth: 3,
    borderColor: "#1F1A2A",
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: 15,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    borderWidth: 2,
    borderColor: "#1F1A2A",
  },
});
