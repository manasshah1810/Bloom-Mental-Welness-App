import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { saveRecording } from "../../services/recordingService";

interface CustomNavBarProps {
  activeScreen: "home" | "unload" | "recordings";
}

const CustomNavBar = ({ activeScreen }: CustomNavBarProps) => (
  <View style={styles.navBar}>
    <Link href="/home" asChild>
      <TouchableOpacity style={styles.navButton}>
        <Feather
          name="home"
          size={28}
          color={activeScreen === "home" ? "#C870FF" : "#A9A9A9"}
        />
        <Text
          style={[
            styles.navText,
            { color: activeScreen === "home" ? "#C870FF" : "#A9A9A9" },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>
    </Link>
    <Link href="/MindUnload" asChild>
      <TouchableOpacity style={styles.navButton}>
        <MaterialCommunityIcons
          name="dots-grid"
          size={28}
          color={activeScreen === "unload" ? "#C870FF" : "#A9A9A9"}
        />
        <Text
          style={[
            styles.navText,
            { color: activeScreen === "unload" ? "#C870FF" : "#A9A9A9" },
          ]}
        >
          Mind Unload
        </Text>
      </TouchableOpacity>
    </Link>
    <Link href="/MyRecordings" asChild>
      <TouchableOpacity style={styles.navButton}>
        <Feather
          name="list"
          size={28}
          color={activeScreen === "recordings" ? "#C870FF" : "#A9A9A9"}
        />
        <Text
          style={[
            styles.navText,
            { color: activeScreen === "recordings" ? "#C870FF" : "#A9A9A9" },
          ]}
        >
          My Recordings
        </Text>
      </TouchableOpacity>
    </Link>
  </View>
);

export default function MindUnloadScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const handleRecordButtonPress = async () => {
    if (isRecording) {
      await stopRecording();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await startRecording();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== "granted") {
        Alert.alert(
          "Permissions required",
          "Please grant microphone permissions in your settings to start recording."
        );
        await requestPermission();
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Could not start recording.");
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (uri) {
      await saveRecording(uri);
      Alert.alert("Saved!", "Your thoughts have been securely saved.");
    }
    setRecording(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mind Unload</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.micButton}
          onPress={handleRecordButtonPress}
        >
          <View
            style={[
              styles.micIconContainer,
              isRecording && styles.micIconRecording,
            ]}
          >
            <Feather name="mic" size={80} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.statusText}>
          {isRecording ? "Recording..." : "Start Recording"}
        </Text>
        <View style={styles.divider} />
        <Text style={styles.subText}>
          Your thoughts will be securely saved on-device.
        </Text>
      </View>
      <CustomNavBar activeScreen="unload" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#120E1A",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "Lato-Bold",
    fontSize: 24,
    marginTop: 80,
  },
  card: {
    width: "90%",
    backgroundColor: "rgba(31, 26, 42, 0.8)",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: "auto",
    marginTop: 30,
  },
  micButton: { marginBottom: 30 },
  micIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#A050F0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#A050F0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  micIconRecording: { backgroundColor: "#FF3B30" },
  statusText: {
    color: "#FFFFFF",
    fontFamily: "Lato-Bold",
    fontSize: 22,
    marginBottom: 15,
  },
  divider: {
    height: 3,
    width: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    marginBottom: 15,
  },
  subText: {
    color: "#A9A9A9",
    fontFamily: "Lato-Regular",
    fontSize: 16,
    textAlign: "center",
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
  navText: { fontSize: 12, fontFamily: "Lato-Regular", marginTop: 4 },
});
