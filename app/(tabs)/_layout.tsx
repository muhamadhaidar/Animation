import { Tabs } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar"; // Import komponen custom

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Sembunyikan tab bar default karena kita akan me-rendernya sendiri
        tabBarShowLabel: false,
      }}
      // --- INI BAGIAN PENTINGNYA ---
      // Kita replace tabBar default dengan CustomTabBar kita
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Discover" }} />
      <Tabs.Screen name="matches" options={{ title: "Messages" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}