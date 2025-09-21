import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUsers } from '../services/userService';

// Import our local user database
import { users } from '../users'; 

// Path to your logo image
const bloomLogo = require("../assets/images/Logo.png");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please enter both email and password.");
      return;
    }

    // Get the most up-to-date list of users from storage
    const allUsers = await getUsers();

    // Find a user that matches the entered email and password
    const user = allUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      try {
        await AsyncStorage.setItem('userToken', user.email);
        router.replace("/home");
      } catch (e) {
        Alert.alert("Error", "Failed to save user session.");
      }
    } else {
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image source={bloomLogo} style={styles.logo} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Log In</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A9A9A9"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A9A9A9"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.buttonWrapper} onPress={handleLogin}>
            <LinearGradient
              colors={["#C870FF", "#9438F5"]}
              style={styles.loginButton}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.signupTextContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Link href="/SignUpScreen" asChild>
               <TouchableOpacity>
                  <Text style={styles.signupLink}>Sign Up</Text>
               </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 10 : 60,
    paddingLeft: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  logo: {
    width: 120, // Increased logo size
    height: 60, // Increased logo size
    resizeMode: "contain",
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 36,
    fontFamily: "Lato-Bold",
    marginBottom: 30,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    color: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: "Lato-Regular",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonWrapper: {
    width: "100%",
    marginTop: 10,
    marginBottom: 20,
  },
  loginButton: {
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Lato-Bold",
  },
  signupTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  signupText: {
    color: "#A9A9A9",
    fontFamily: "Lato-Regular",
  },
  signupLink: {
    color: "#C870FF",
    fontFamily: "Lato-Bold",
  },
});