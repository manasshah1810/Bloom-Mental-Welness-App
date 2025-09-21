import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect, Link } from 'expo-router';
import { getRecordings } from '../../services/recordingService';
import { Audio } from 'expo-av';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Recording } from '../../types'; // Import our new Recording type

interface CustomNavBarProps { activeScreen: 'home' | 'unload' | 'recordings'; }
const CustomNavBar = ({ activeScreen }: CustomNavBarProps) => (
    <View style={styles.navBar}><Link href="/home" asChild><TouchableOpacity style={styles.navButton}><Feather name="home" size={28} color={activeScreen === 'home' ? '#C870FF' : '#A9A9A9'} /><Text style={[styles.navText, { color: activeScreen === 'home' ? '#C870FF' : '#A9A9A9' }]}>Home</Text></TouchableOpacity></Link><Link href="/MindUnload" asChild><TouchableOpacity style={styles.navButton}><MaterialCommunityIcons name="dots-grid" size={28} color={activeScreen === 'unload' ? '#C870FF' : '#A9A9A9'} /><Text style={[styles.navText, { color: activeScreen === 'unload' ? '#C870FF' : '#A9A9A9' }]}>Mind Unload</Text></TouchableOpacity></Link><Link href="/MyRecordings" asChild><TouchableOpacity style={styles.navButton}><Feather name="list" size={28} color={activeScreen === 'recordings' ? '#C870FF' : '#A9A9A9'} /><Text style={[styles.navText, { color: activeScreen === 'recordings' ? '#C870FF' : '#A9A9A9' }]}>My Recordings</Text></TouchableOpacity></Link></View>
);

export default function MyRecordingsScreen() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const data = await getRecordings();
        setRecordings(data);
      };
      loadData();
      return () => {
        // Unload sound when the screen is unfocused
        sound?.unloadAsync();
      };
    }, [sound])
  );

  const playSound = async (uri: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Failed to play sound", error);
      Alert.alert("Error", "Could not play this recording.");
    }
  };

  const renderItem = ({ item }: { item: Recording }) => (
    <View style={styles.itemContainer}><View style={styles.itemTextContainer}><Text style={styles.itemDay}>{item.day}</Text><Text style={styles.itemDate}>{item.formattedDate}</Text></View><TouchableOpacity style={styles.playButton} onPress={() => playSound(item.uri)}><Feather name="play" size={24} color="#C870FF" /></TouchableOpacity></View>
  );

  return (
    <View style={styles.container}><Text style={styles.title}>My Recordings</Text><FlatList data={recordings} renderItem={renderItem} keyExtractor={(item) => item.uri} contentContainerStyle={{ paddingHorizontal: 20 }} ListEmptyComponent={() => (<View style={styles.emptyContainer}><Text style={styles.emptyText}>No recordings yet.</Text><Text style={styles.emptySubText}>Go to Mind Unload to save your thoughts.</Text></View>)} /><CustomNavBar activeScreen="recordings" /></View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#120E1A', paddingTop: 80, }, title: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 24, marginBottom: 20, textAlign: 'center' }, itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1F1A2A', padding: 20, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }, itemTextContainer: {}, itemDay: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 18 }, itemDate: { color: '#A9A9A9', fontFamily: 'Lato-Regular', fontSize: 14, marginTop: 4 }, playButton: { padding: 10, backgroundColor: 'rgba(200, 112, 255, 0.1)', borderRadius: 30 }, emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '50%' }, emptyText: { color: '#FFFFFF', fontFamily: 'Lato-Bold', fontSize: 18 }, emptySubText: { color: '#A9A9A9', fontFamily: 'Lato-Regular', fontSize: 14, marginTop: 10 }, navBar: { position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 90, backgroundColor: '#1F1A2A', borderTopLeftRadius: 25, borderTopRightRadius: 25, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 10 }, navButton: { alignItems: 'center' }, navText: { fontSize: 12, fontFamily: 'Lato-Regular', marginTop: 4 }});