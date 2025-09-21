import React from 'react';
import { Tabs, router } from 'expo-router';

export default function CompanionTabLayout() {
  return (
    <Tabs
      // This is the most important setting for your custom UI.
      // It completely hides the default tab bar, preventing conflicts
      // and allowing your custom nav bar on each screen to work correctly.
      tabBar={() => null} 
      screenOptions={{
        // This hides the top header bar for all screens in this group.
        headerShown: false,
      }}
    >
      {/* This makes the router aware of your chat screen (index.tsx) */}
      <Tabs.Screen name="index" />

      {/* This makes the router aware of your transcripts screen */}
      <Tabs.Screen name="transcripts" />

      {/* This is a "dummy" screen. It's required for navigation but is never shown.
        It allows your custom "Home" button to have a target to press.
      */}
      <Tabs.Screen
        name="home"
        listeners={{
          tabPress: (e) => {
            // 1. Prevent the router from trying to navigate to a blank tab.
            e.preventDefault();
            // 2. Manually navigate to your main home screen at app/(tabs)/home.tsx.
            router.navigate('/home');
          },
        }}
      />
    </Tabs>
  );
}