import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useFocusEffect, Link, router } from 'expo-router';
import { getChatSessions } from '../../services/geminiService';
import { Feather } from '@expo/vector-icons';

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


export default function TranscriptsScreen() {
  const [sessions, setSessions] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      getChatSessions().then(setSessions);
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSummary}>{item.summary || "Summary not yet available."}</Text>
      <Text style={styles.cardMood}>Mood: {item.mood || "N/A"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>True Companion: Transcripts</Text>
      </View>
      <FlatList
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={() => <Text style={styles.summaryTitle}>Summary:</Text>}
      />
      <CustomNavBar activeScreen="transcripts" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#120E1A' },
  header: { paddingTop: Platform.OS === 'android' ? 50 : 60, paddingBottom: 15, paddingHorizontal: 20 },
  headerTitle: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 28 },
  summaryTitle: { color: '#A9A9A9', fontFamily: 'Lato-Regular', fontSize: 16, marginBottom: 10 },
  card: { backgroundColor: '#1F1A2A', borderRadius: 20, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(160, 80, 240, 0.5)' },
  cardTitle: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 18, marginBottom: 8 },
  cardSummary: { color: '#A9A9A9', fontFamily: 'Lato-Regular', fontSize: 15, marginBottom: 12 },
  cardMood: { color: '#E0B0FF', fontFamily: 'Lato-Regular', fontSize: 15 },
  // Nav Bar Styles
  navBar: { height: 90, backgroundColor: '#1F1A2A', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.1)' },
  navButton: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 12, fontFamily: 'Lato-Regular', marginTop: 4, color: '#A9A9A9' },
});