import React, { useState, useEffect } from 'react';
import { 
    View, Text, StyleSheet, Image, TextInput, 
    TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sendMessageToUser, getMessagesForUser } from '@/utils/dataStore'; // Import fungsi baru

export default function ChatRoom() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { name, image } = params;
    
    // Load pesan dari dataStore berdasarkan Nama
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');

    // Load history saat pertama kali buka
    useEffect(() => {
        if (name) {
            const history = getMessagesForUser(name as string);
            setMessages([...history]); // Copy array
        }
    }, [name]);

    const handleSend = () => {
        if (inputText.trim().length > 0) {
            // 1. Simpan ke Global Store
            sendMessageToUser({ name, image }, inputText);

            // 2. Update tampilan lokal langsung
            const newMsg = { id: Date.now().toString(), text: inputText, sender: 'me' };
            setMessages((prev) => [...prev, newMsg]);
            
            setInputText('');
        }
    };

    const renderItem = ({ item }: any) => {
        const isMe = item.sender === 'me';
        return (
            <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={isMe ? styles.textMe : styles.textThem}>{item.text}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={30} color="#FE3C72" />
                </TouchableOpacity>
                <Image source={{ uri: (image as string) }} style={styles.avatar} />
                <Text style={styles.username}>{name}</Text>
            </View>

            {messages.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="chatbubble-ellipses-outline" size={80} color="#ddd" />
                    <Text style={styles.emptyText}>You matched with {name}!</Text>
                    <Text style={styles.emptySubText}>Send a message to start chatting.</Text>
                </View>
            ) : (
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.chatList}
                />
            )}

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Type a message..." 
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <TouchableOpacity onPress={handleSend}>
                        <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', marginTop: 30 },
    backBtn: { marginRight: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    username: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    chatList: { padding: 20 },
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 20, marginBottom: 10 },
    bubbleMe: { alignSelf: 'flex-end', backgroundColor: '#3B82F6', borderBottomRightRadius: 2 },
    bubbleThem: { alignSelf: 'flex-start', backgroundColor: '#F3F4F6', borderBottomLeftRadius: 2 },
    textMe: { color: 'white', fontSize: 16 },
    textThem: { color: 'black', fontSize: 16 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#eee', marginBottom: 10 },
    input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, fontSize: 16 },
    sendText: { color: '#FE3C72', fontWeight: 'bold', fontSize: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.6 },
    emptyText: { fontSize: 20, fontWeight: 'bold', marginTop: 10, color: '#555' },
    emptySubText: { fontSize: 14, color: '#999', marginTop: 5 }
});