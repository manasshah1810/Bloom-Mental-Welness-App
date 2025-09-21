import AsyncStorage from '@react-native-async-storage/async-storage';
// This is the corrected import path to use the stable legacy API
import * as FileSystem from 'expo-file-system/legacy';
import { users as initialUsers } from '../users';
import { format } from 'date-fns';

const USERS_KEY = '@users_data';
const RECORDINGS_KEY = '@mind_unload_recordings';
const RECORDING_DIR = FileSystem.documentDirectory + 'recordings/';

/**
 * Checks if the recording directory exists and creates it if it doesn't.
 * This uses the stable legacy functions.
 */
const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(RECORDING_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(RECORDING_DIR, { intermediates: true });
  }
};

/**
 * Saves a recording by moving it to a permanent directory and
 * storing its metadata in AsyncStorage.
 * @param {string} tempUri The temporary URI of the finished recording.
 * @returns {Promise<{success: boolean, error?: Error}>}
 */
export const saveRecording = async (tempUri) => {
  try {
    await ensureDirExists();
    const now = new Date();
    const fileName = `recording-${now.getTime()}.caf`;
    const newUri = RECORDING_DIR + fileName;

    // Use the stable legacy moveAsync function
    await FileSystem.moveAsync({
      from: tempUri,
      to: newUri,
    });

    const newRecording = {
      uri: newUri,
      date: now.toISOString(),
      day: format(now, 'EEEE'),
      formattedDate: format(now, 'MMMM d, yyyy'),
    };

    const existingRecordings = await getRecordings();
    const updatedRecordings = [newRecording, ...existingRecordings];
    await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(updatedRecordings));
    
    return { success: true };
  } catch (error) {
    console.error("Failed to save recording", error);
    return { success: false, error };
  }
};

/**
 * Retrieves the list of all recording metadata from AsyncStorage.
 * @returns {Promise<import('../types').Recording[]>} A list of recording objects.
 */
export const getRecordings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(RECORDINGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Failed to get recordings", error);
    return [];
  }
};


// --- User Management Functions (Unaffected by the file system error) ---

/**
 * Checks if user data exists in storage. If not, it loads the
 * initial users from users.js into AsyncStorage.
 */
export const seedInitialUsers = async () => {
  try {
    const existingUsers = await AsyncStorage.getItem(USERS_KEY);
    if (!existingUsers) {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }
  } catch (e) {
    console.error("Failed to seed user data.", e);
  }
};

/**
 * Retrieves the current list of all users from AsyncStorage.
 * @returns {Promise<Array<any>>} A promise that resolves to an array of user objects.
 */
export const getUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (e) {
    console.error("Failed to fetch users.", e);
    return [];
  }
};

/**
 * Adds a new user to the list in AsyncStorage.
 * @param {object} newUser - The new user object.
 * @returns {Promise<{success: boolean, error?: Error}>} A promise that resolves to an object with success status.
 */
export const addUser = async (newUser) => {
  try {
    const users = await getUsers();
    const userExists = users.some(
      (user) => user.email.toLowerCase() === newUser.email.toLowerCase()
    );
    if (userExists) {
      throw new Error("An account with this email already exists.");
    }
    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true };
  } catch (e) {
    console.error("Failed to add user.", e);
    return { success: false, error: e };
  }
};