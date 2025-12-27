import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform } from "react-native";
import { useState, useEffect } from 'react';
import { userProfile, subscribeToTheme } from '@/utils/dataStore';

export default function TabLayout() {
  const [theme, setTheme] = useState(userProfile.theme);

  useEffect(() => {
    // Subscribe ke perubahan tema dari dataStore
    const unsubscribe = subscribeToTheme(() => {
        setTheme(userProfile.theme);
    });
    return () => unsubscribe();
  }, []);

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1e293b' : '#ffffff'; // Warna Solid (Navy Gelap / Putih)
  const activeColor = isDark ? '#38bdf8' : '#FE3C72';
  const inactiveColor = isDark ? '#64748b' : '#94a3b8';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { 
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 5,
            backgroundColor: bgColor, // Gunakan warna solid dinamis
            borderRadius: 25,
            height: 70,
            borderTopWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                <Ionicons name={focused ? "copy" : "copy-outline"} size={28} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                <Ionicons name={focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"} size={30} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
                <Ionicons name={focused ? "person" : "person-outline"} size={28} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}