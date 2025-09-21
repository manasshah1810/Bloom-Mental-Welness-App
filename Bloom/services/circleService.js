import AsyncStorage from '@react-native-async-storage/async-storage';
import { ALL_CIRCLES, CHAT_MESSAGES, MY_CHATS_PREVIEW } from '../data/communityData';

const JOINED_CIRCLES_KEY = '@joined_circles';

// Function to get the list of circles the user has joined
export const getJoinedCircleIds = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(JOINED_CIRCLES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : ['1', '2', '3']; // Default to being in a few circles
  } catch (e) {
    console.error("Failed to fetch joined circles.", e);
    return [];
  }
};

// Function to join a circle
export const joinCircle = async (circleId) => {
  try {
    const joinedIds = await getJoinedCircleIds();
    if (!joinedIds.includes(circleId)) {
      const newJoinedIds = [...joinedIds, circleId];
      await AsyncStorage.setItem(JOINED_CIRCLES_KEY, JSON.stringify(newJoinedIds));
    }
  } catch (e) {
    console.error("Failed to join circle.", e);
  }
};

// --- Mock functions for the prototype ---
export const getExploreCircles = async () => {
    // In a real app, this would come from a server
    return ALL_CIRCLES;
}

export const getMyChats = async () => {
    // This is hardcoded for the prototype UI
    return MY_CHATS_PREVIEW;
}

export const getMessagesForCircle = (circleId) => {
    // Return mock messages or an empty array
    return CHAT_MESSAGES[circleId] || [];
}