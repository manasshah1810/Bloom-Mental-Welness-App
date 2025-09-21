// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add your own Firebase configuration from your Firebase console
const firebaseConfig = {
    apiKey: "AIzaSyBC34R1iOp5T_UNsOFlLHBAIg-ZoAt7Qw8",
    authDomain: "bloom-f23b0.firebaseapp.com",
    projectId: "bloom-f23b0",
    storageBucket: "bloom-f23b0.firebasestorage.app",
    messagingSenderId: "514978735301",
    appId: "1:514978735301:web:381800f4dc53a5eb08fcac",
    measurementId: "G-WDL1DG4PMR"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);