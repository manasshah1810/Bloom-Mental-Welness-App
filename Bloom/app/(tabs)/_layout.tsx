import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => null} 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="MindUnload" />
      <Tabs.Screen name="MyRecordings" />
    </Tabs>
  );
}