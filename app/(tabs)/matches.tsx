import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { getActiveChats, userProfile } from '@/utils/dataStore';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Matches() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const [allMatches, setAllMatches] = useState<any[]>([]);
    const [isDark, setIsDark] = useState(userProfile.theme === 'dark');

    useEffect(() => {
        if (isFocused) {
            setAllMatches(getActiveChats());
            setIsDark(userProfile.theme === 'dark');
        }
    }, [isFocused]);

    const bgColor = isDark ? ['#0f172a', '#1e1b4b'] : ['#f8fafc', '#ffffff'];
    const textColor = isDark ? '#fff' : '#1e293b';
    const cardBg = isDark ? 'rgba(30, 41, 59, 0.6)' : '#ffffff';
    const borderColor = isDark ? 'rgba(255,255,255,0.05)' : '#e2e8f0';

    return (
        <LinearGradient colors={bgColor} style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: textColor }]}>Messages</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {allMatches.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={80} color={isDark ? "#334155" : "#cbd5e1"} />
                        <Text style={[styles.emptyTitle, { color: textColor }]}>No messages yet</Text>
                        <Text style={styles.emptySubtitle}>Swipe right to start connecting</Text>
                    </View>
                ) : (
                    allMatches.map((chat: any) => (
                        <TouchableOpacity 
                            key={chat.id} 
                            style={[styles.chatCard, { backgroundColor: cardBg, borderColor }]} 
                            onPress={() => router.push({ pathname: "/chat_room", params: { name: chat.name, image: chat.img } })}
                        >
                            <View style={styles.avatarContainer}>
                                <Image source={{ uri: chat.img }} style={styles.avatar} />
                                {chat.isNew && <View style={styles.onlineDot} />}
                            </View>
                            
                            <View style={styles.textContainer}>
                                <Text style={[styles.name, { color: textColor }]}>{chat.name}</Text>
                                <Text style={[styles.message, chat.isNew && styles.newMessage]} numberOfLines={1}>
                                    {chat.lastMessage}
                                </Text>
                            </View>
                            
                            <View style={styles.timeContainer}>
                                <Text style={styles.timeText}>Now</Text>
                                {chat.isNew && <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>}
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 25, paddingTop: 60, paddingBottom: 20 },
    headerTitle: { fontSize: 34, fontWeight: 'bold' },
    content: { paddingHorizontal: 20, paddingBottom: 100 },
    
    chatCard: { 
        flexDirection: 'row', alignItems: 'center', 
        padding: 15, borderRadius: 20, marginBottom: 15, borderWidth: 1, 
        shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    avatarContainer: { position: 'relative' },
    avatar: { width: 60, height: 60, borderRadius: 30 },
    onlineDot: { position: 'absolute', right: 0, bottom: 0, width: 14, height: 14, backgroundColor: '#4ade80', borderRadius: 7, borderWidth: 2, borderColor: '#fff' },
    
    textContainer: { flex: 1, marginLeft: 15 },
    name: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
    message: { fontSize: 14, color: '#94a3b8' },
    newMessage: { color: '#38bdf8', fontWeight: '600' },
    
    timeContainer: { alignItems: 'flex-end' },
    timeText: { fontSize: 12, color: '#64748b', marginBottom: 5 },
    badge: { backgroundColor: '#38bdf8', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
    emptySubtitle: { color: '#64748b', marginTop: 5 }
});