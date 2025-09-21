import { GoogleGenerativeAI } from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- SECURITY WARNING: DO NOT USE IN PRODUCTION ---
// This key is visible to anyone who downloads your app.
// For prototyping only. Replace with a secure backend call.
const GEMINI_API_KEY = "AIzaSyBwTt1fasqUbhrjoAjTR-1kBqnvKebWjtE";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash", // Using the fast 1.5 Flash model
});

const SESSIONS_KEY = '@true_companion_sessions';

/**
 * Gets a chat response from Gemini with a specific persona.
 * @param {Array<object>} history The existing chat history.
 * @param {string} newMessage The new message from the user.
 * @returns {Promise<string>} The AI's response text.
 */
export const getChatResponse = async (history, newMessage) => {
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Nova Kai, a fun, witty, and supportive AI friend. Your tone is very casual, like talking to a close buddy. You can be a bit sarcastic and use friendly taunts, but you are always caring and never swear. Keep your responses concise and never break character." }],
        },
        {
          role: "model",
          parts: [{ text: "Got it. I'm Nova Kai, the best digital friend you'll ever have. Let's do this." }],
        },
        ...history // Add the ongoing conversation
      ],
      generationConfig: { maxOutputTokens: 100 },
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Whoops, my circuits are a bit scrambled. Try again?";
  }
};

/**
 * Gets a summary and mood from a chat history.
 * @param {Array<object>} chatHistory The full chat history for a session.
 * @returns {Promise<{summary: string, mood: string}>}
 */
export const getTranscriptSummary = async (chatHistory) => {
  try {
    const prompt = `Analyze the following user conversation. Provide a one-sentence summary and a primary mood for the user. Format your response as a valid JSON object with two keys: "summary" and "mood". Example: {"summary": "User talked about exam stress but felt better after planning.", "mood": "Anxious but Hopeful"}\n\nCONVERSATION:\n${JSON.stringify(chatHistory)}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().match(/\{.*\}/s)[0]; // Extract JSON from the response
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return { summary: "Could not generate summary.", mood: "Unknown" };
  }
};


// --- Functions to manage chat sessions on the device ---

export const getChatSessions = async () => {
  const sessions = await AsyncStorage.getItem(SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

export const saveChatSession = async (session) => {
  const sessions = await getChatSessions();
  const sessionIndex = sessions.findIndex(s => s.id === session.id);

  if (sessionIndex > -1) {
    sessions[sessionIndex] = session; // Update existing session
  } else {
    sessions.unshift(session); // Add new session to the top
  }
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};