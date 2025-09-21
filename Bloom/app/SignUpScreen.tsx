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
import { addUser } from '../services/userService';

// Path to your logo image
const bloomLogo = require("../assets/images/Logo.png");

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    try {
      const newUser = { username, email, password };
      const result = await addUser(newUser);

      if (result.success) {
        await AsyncStorage.setItem('userToken', email);
        Alert.alert("Account Created!", "You have been successfully signed up.");
        router.replace("/home");
      } else {
        Alert.alert("Sign Up Failed", result.error.message);
      }
    } catch (e) {
      Alert.alert("Error", "An unexpected error occurred during sign up.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Image source={bloomLogo} style={styles.logo} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#A9A9A9"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
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
          <TouchableOpacity style={styles.buttonWrapper} onPress={handleSignUp}>
            <LinearGradient
              colors={["#C870FF", "#9438F5"]}
              style={styles.loginButton}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
            >
              <Text style={styles.buttonText}>Create Account</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.loginTextContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/LoginScreen" asChild>
               <TouchableOpacity>
                  <Text style={styles.loginLink}>Log In</Text>
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
    width: 120,
    height: 60,
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
  loginTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    color: "#A9A9A9",
    fontFamily: "Lato-Regular",
  },
  loginLink: {
    color: "#C870FF",
    fontFamily: "Lato-Bold",
  },
});