import { Tabs, router } from 'expo-router';
import React from 'react';

export default function CompanionTabLayout() {
  return (
    <Tabs
      tabBar={() => null} 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="transcripts" />
      <Tabs.Screen
        name="home"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate('/home');
          },
        }}
      />
    </Tabs>
  );
}