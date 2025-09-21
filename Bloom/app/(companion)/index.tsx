import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect, Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { getChatResponse, saveChatSession, getTranscriptSummary } from '../../services/geminiService';
import { format } from 'date-fns';

interface Message {
  role: 'user' | 'model';
  parts: [{ text: string }];
}

// --- Custom Navigation Bar Component (with corrected paths) ---
const CustomNavBar = ({ activeScreen }: { activeScreen: 'chat' | 'transcripts' }) => (
  <View style={styles.navBar}>
    <TouchableOpacity style={styles.navButton} onPress={() => router.navigate('/home')}>
      <Feather name="home" size={28} color="#A9A9A9" />
      <Text style={styles.navText}>Home</Text>
    </TouchableOpacity>
    <Link href="/(companion)/" asChild>
      <TouchableOpacity style={styles.navButton}>
        <Feather name="message-circle" size={28} color={activeScreen === 'chat' ? '#C870FF' : '#A9A9A9'} />
        <Text style={[styles.navText, { color: activeScreen === 'chat' ? '#C870FF' : '#A9A9A9' }]}>Chat</Text>
      </TouchableOpacity>
    </Link>
    {/* This is the corrected link */}
    <Link href="/(companion)/transcripts" asChild>
      <TouchableOpacity style={styles.navButton}>
        <Feather name="list" size={28} color={activeScreen === 'transcripts' ? '#C870FF' : '#A9A9A9'} />
        <Text style={[styles.navText, { color: activeScreen === 'transcripts' ? '#C870FF' : '#A9A9A9' }]}>Transcripts</Text>
      </TouchableOpacity>
    </Link>
  </View>
);


export default function TrueCompanionChatScreen() {
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    React.useCallback(() => {
      const sessionId = `session-${format(new Date(), 'yyyy-MM-dd')}`;
      const newSession = {
        id: sessionId,
        date: new Date().toISOString(),
        title: `Today's Check-in (${format(new Date(), 'MMM d')})`,
        messages: [],
        summary: '',
        mood: ''
      };
      setSession(newSession);
      setMessages([]);
    }, [])
  );

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;
    const userMessage: Message = { role: 'user', parts: [{ text: inputText }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    const aiResponseText = await getChatResponse(newMessages, inputText);
    const aiMessage: Message = { role: 'model', parts: [{ text: aiResponseText }] };
    const finalMessages = [...newMessages, aiMessage];
    setMessages(finalMessages);
    setIsLoading(false);
    const updatedSession = { ...session, messages: finalMessages };
    const userMessagesText = finalMessages.filter(m => m.role === 'user').map(m => m.parts[0].text);
    const { summary, mood } = await getTranscriptSummary(userMessagesText);
    updatedSession.summary = summary;
    updatedSession.mood = mood;
    await saveChatSession(updatedSession);
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[ styles.messageRow, item.role === 'user' ? styles.myMessageRow : styles.otherMessageRow ]}>
      {item.role === 'model' && <Image source={require('../../assets/images/companion-avatar.png')} style={styles.avatar} />}
      <View style={[ styles.messageBubble, item.role === 'user' ? styles.myMessageBubble : styles.otherMessageBubble ]}>
        <Text style={styles.messageText}>{item.parts[0].text}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/companion-avatar.png')} style={styles.headerAvatar} />
        <Text style={styles.headerTitle}>Nova • Kai</Text>
      </View>

      <KeyboardAvoidingView style={styles.flexContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Image source={require('../../assets/images/companion-avatar-large.png')} style={styles.largeAvatar} />
              <Text style={styles.emptyText}>Your friend is here to listen.{"\n"}What's on your mind today?</Text>
            </View>
          )}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        {isLoading && <ActivityIndicator style={styles.loadingIndicator} color="#A050F0" />}
        <View style={styles.inputContainer}>
          <TextInput style={styles.textInput} placeholder="Message your companion..." placeholderTextColor="#A9A9A9" value={inputText} onChangeText={setInputText} />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Feather name="send" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      <CustomNavBar activeScreen="chat" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#120E1A' },
  flexContainer: { flex: 1 },
  header: { paddingTop: Platform.OS === 'android' ? 50 : 60, paddingBottom: 15, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#1F1A2A' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  headerTitle: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 20 },
  listContentContainer: { paddingHorizontal: 10, paddingTop: 10, flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  largeAvatar: { width: 120, height: 120, marginBottom: 20 },
  emptyText: { color: '#A9A9A9', fontFamily: 'Lato-Regular', fontSize: 18, textAlign: 'center' },
  messageRow: { flexDirection: 'row', marginVertical: 5, alignItems: 'flex-end' },
  myMessageRow: { justifyContent: 'flex-end' },
  otherMessageRow: { justifyContent: 'flex-start' },
  avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
  messageBubble: { maxWidth: '75%', padding: 15, borderRadius: 20 },
  myMessageBubble: { backgroundColor: '#A050F0', borderBottomRightRadius: 5 },
  otherMessageBubble: { backgroundColor: '#1F1A2A', borderBottomLeftRadius: 5 },
  messageText: { color: '#FFFFFF', fontFamily: 'Lato-Regular', fontSize: 16 },
  loadingIndicator: { padding: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#1F1A2A', backgroundColor: '#120E1A' },
  textInput: { flex: 1, backgroundColor: '#1F1A2A', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 12, color: '#FFFFFF', fontFamily: 'Lato-Regular', fontSize: 16, marginRight: 10 },
  sendButton: { backgroundColor: '#A050F0', borderRadius: 25, width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  // Nav Bar Styles
  navBar: { height: 90, backgroundColor: '#1F1A2A', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
  navButton: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 12, fontFamily: 'Lato-Regular', marginTop: 4, color: '#A9A9A9' },
});