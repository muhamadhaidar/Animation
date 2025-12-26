import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { matchesList, getActiveChats } from '@/utils/dataStore'; // Import getActiveChats

export default function Matches() {
    const router = useRouter();
    const isFocused = useIsFocused();
    
    const [newMatches, setNewMatches] = useState<any[]>([]);
    const [activeChats, setActiveChats] = useState<any[]>([]);

    useEffect(() => {
        if (isFocused) {
            // 1. Ambil Match Baru (Bulatan Atas)
            setNewMatches([...matchesList]); 
            
            // 2. Ambil Chat Aktif (List Pesan Bawah)
            const chats = getActiveChats(); 
            setActiveChats(chats);
        }
    }, [isFocused]);

    const openChat = (name: string, img: string) => {
        router.push({
            pathname: "/chat_room",
            params: { name, image: img }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Matches</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.searchContainer}>
                    <TextInput placeholder="Search matches" style={styles.input} />
                </View>

                {/* --- BAGIAN 1: NEW MATCHES (Belum Dichat) --- */}
                <Text style={styles.sectionTitle}>New Matches</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                    <View style={styles.matchItem}>
                         <View style={[styles.avatarContainer, styles.likesContainer]}>
                            <Text style={styles.likesText}>10+</Text>
                            <Text style={styles.likesLabel}>Likes</Text>
                         </View>
                    </View>

                    {newMatches.map((item: any) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.matchItem}
                            onPress={() => openChat(item.name, item.img)}
                        >
                            <Image source={{ uri: item.img }} style={styles.avatar} />
                            <Text style={styles.name}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* --- BAGIAN 2: MESSAGES (Sudah Dichat / History Ada) --- */}
                <Text style={styles.sectionTitle}>Messages</Text>
                
                {activeChats.length === 0 ? (
                    <Text style={{ color: 'gray', fontStyle: 'italic', marginTop: 10 }}>No messages yet. Start chatting with your matches!</Text>
                ) : (
                    activeChats.map((chat: any) => (
                        <TouchableOpacity 
                            key={chat.id} 
                            style={styles.messageItem}
                            onPress={() => openChat(chat.name, chat.img)}
                        >
                            <Image source={{ uri: chat.img }} style={styles.msgAvatar} />
                            <View style={styles.msgContent}>
                                <Text style={styles.msgName}>{chat.name}</Text>
                                <Text style={styles.msgText} numberOfLines={1}>
                                    You: {chat.lastMessage}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 40 },
    header: { padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#FE3C72' },
    content: { paddingHorizontal: 20 },
    searchContainer: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 10, marginBottom: 20 },
    input: { fontSize: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
    horizontalList: { flexDirection: 'row', marginBottom: 30 },
    matchItem: { marginRight: 15, alignItems: 'center' },
    avatar: { width: 70, height: 70, borderRadius: 35 },
    name: { marginTop: 5, fontWeight: '600' },
    messageItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    msgAvatar: { width: 60, height: 60, borderRadius: 30 },
    msgContent: { marginLeft: 15, flex: 1 },
    msgName: { fontSize: 18, fontWeight: 'bold' },
    msgText: { color: 'gray', marginTop: 2 },
    avatarContainer: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center' },
    likesContainer: { backgroundColor: '#E1BEE7', borderWidth: 2, borderColor: '#FE3C72' },
    likesText: { fontWeight: 'bold', color: '#fff', fontSize: 16 },
    likesLabel: { fontSize: 10, color: '#fff' },
});