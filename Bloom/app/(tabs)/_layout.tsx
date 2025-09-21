import React from 'react';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      // This line hides the default BOTTOM tab bar, which is correct
      // because you are using a custom navigation component on each screen.
      tabBar={() => null} 

      // This 'screenOptions' prop applies the rules inside it to all
      // the screens listed below (home, MindUnload, MyRecordings).
      screenOptions={{
        // This is the specific rule that hides the TOP header/navigation bar.
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="MindUnload" />
      <Tabs.Screen name="MyRecordings" />
    </Tabs>
  );
}