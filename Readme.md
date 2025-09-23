# 🌙 Lumen – AI-Powered Youth Mental Wellness App  

**Lumen** is a GenAI-powered mental wellness app designed to support youth by providing safe spaces, emotional understanding, and personalized assistance.  
Built using **React Native (Expo)** for the frontend and **Google Gemini API** + **Firebase** for the backend.  

---

## 📌 Features Implemented  

- **Safe Circle (Anonymous Peer Support)**  
  A moderated, anonymous chat environment where users can share experiences without judgment.  

- **True Companion**  
  AI-powered empathetic assistant that listens like a friend, remembers conversations, and provides emotional validation.  

- **Record Dump (Mind Unload)**  
  Voice or text-based journaling where users can freely talk. AI transcribes, reflects, and stores for playback.  

- **One-Tap SOS**  
  Quick emergency support system that connects the user to predefined contacts with one button.  

- **Mood-Based Exercises**  
  Personalized small exercises (breathing, stretching, mindfulness) tailored to user mood.  

- **Summaries & Memory**  
  AI-generated conversation summaries and ability to revisit previous chats with True Companion.  

- **Playback of Voice Dumps**  
  Listen to previously recorded voice dumps for reflection and progress tracking.  

- **Mood Detection**  
  Real-time mood classification from chats and voice input for adaptive responses.  

---

## 🏗️ Tech Stack  

### Frontend (Mobile)  
- **React Native (Expo)**  
- **Glassmorphism UI** for modern calm design  
- **Dark theme** with mental wellness palette  

### Backend & AI  
- **Google Gemini API** (Core AI: text, speech, emotion analysis, memory, moderation)  
- **Firebase Cloud Functions** (orchestration logic)  
- **Firebase Firestore** (real-time database for chats, preferences, summaries)  
- **Firebase Cloud Storage** (voice dumps, assets)  

### Infrastructure  
- **Push Notifications** (alerts, reminders, SOS)  
- **Authentication** (Firebase Auth)  

---

## 🎨 UI Design  

- **Theme:** Calm, minimal, safe  
- **Palette:**  
  - Rich Black: `#0A0C1B` (background)  
  - Delft Blue: `#37326F`  
  - Slate Blue: `#6358C2`  
  - Tropical Indigo: `#8F88D3`  
  - Ecru: `#E0C58F`  
  - Isabelline: `#F5F0E9`  

- **UI References:** Pinterest, Dribbble, Behance  

---

## 🔄 System Architecture (High-Level)  

1. **User Input (voice/text)** → App captures → Gemini API  
2. **Gemini AI Processing** → Voice transcription, emotion detection, response generation  
3. **Cloud Functions** → Orchestrates workflows, pushes results to Firestore & Storage  
4. **Database & Storage** → Store chats, summaries, voice dumps, preferences  
5. **Frontend UI** → Dynamic UI changes (colors, animations) based on mood/emotion  

---

## 🚀 Getting Started  

### Prerequisites  
- Node.js (>= 18)  
- Expo CLI  
- Firebase project setup  
- Gemini API keys  

### Installation  

```bash
# Clone repo
git clone https://github.com/your-repo/lumen.git
cd lumen

# Install dependencies
npm install

# Run app
expo start
