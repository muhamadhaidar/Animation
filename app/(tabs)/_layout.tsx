import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FE3C72",
        tabBarInactiveTintColor: "#B0B0B0",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="flame" size={35} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}