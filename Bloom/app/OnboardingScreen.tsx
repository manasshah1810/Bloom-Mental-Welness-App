import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
  } from "react-native";
  import { LinearGradient } from "expo-linear-gradient";
  import { Link } from 'expo-router';
  
  const bloomLogo = require("../assets/images/Logo.png");
  
  export default function OnboardingScreen() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
  
        {/* Main content container */}
        <View style={styles.content}>
          <Image source={bloomLogo} style={styles.logo} />
  
          <Text style={styles.tagline}>Cultivate your inner peace.</Text>
        </View>
  
        {/* Buttons at the bottom */}
        <View style={styles.buttonContainer}>
        <Link href="/LoginScreen" asChild>
  <TouchableOpacity style={styles.buttonWrapper} activeOpacity={0.8}>
    <LinearGradient
      colors={["#C870FF", "#9438F5"]}
      style={styles.loginButton}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
    >
      <Text style={styles.buttonText}>Log In</Text>
    </LinearGradient>
  </TouchableOpacity>
</Link>
  
<Link href="/SignUpScreen" asChild>
  <TouchableOpacity style={styles.signupButton} activeOpacity={0.8}>
    <Text style={styles.buttonText}>Sign Up</Text>
  </TouchableOpacity>
</Link>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000000", // Solid black background
      justifyContent: "space-between", // Pushes content and buttons apart
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 60,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    logo: {
      width: 220,
      height: 220,
      resizeMode: "contain",
      marginBottom: 25,
    },
    tagline: {
      color: "#F5F0E9",
      fontSize: 24,
      fontWeight: "300",
      textAlign: "center",
      fontFamily: 'Lato-Regular',
    },
    buttonContainer: {
      width: "100%",
      alignItems: "center",
    },
    buttonWrapper: {
      width: "90%",
      marginBottom: 20,
    },
    loginButton: {
      paddingVertical: 18,
      borderRadius: 50, // Fully rounded
      alignItems: "center",
      justifyContent: "center",
    },
    signupButton: {
      width: "90%",
      paddingVertical: 18,
      borderRadius: 50, // Fully rounded
      borderWidth: 2,
      borderColor: "#A050F0", // Purple border
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "600",
      fontFamily: 'Lato-Regular',
    },
  });