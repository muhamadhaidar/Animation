import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, Modal, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Pastikan import ini ada
import { useRouter } from 'expo-router';
import { addMatch } from '@/utils/dataStore';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

// 1. DATA DUMMY: SEMUA isMatch: TRUE
const CARDS = [
    { 
        id: 1, 
        name: 'Emily', 
        age: 22, 
        desc: 'Art student 🎨. Love cats!', 
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isMatch: true 
    },
    { 
        id: 2, 
        name: 'Sarah', 
        age: 24, 
        desc: 'Travel enthusiast ✈️', 
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isMatch: true // UBAH JADI TRUE
    },
    { 
        id: 3, 
        name: 'David', 
        age: 26, 
        desc: 'Coffee addict ☕', 
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isMatch: true // UBAH JADI TRUE
    },
    { 
        id: 4, 
        name: 'Michael', 
        age: 29, 
        desc: 'Photographer 📷', 
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        isMatch: true // UBAH JADI TRUE
    },
];

const SwipeableCard = () => {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matchData, setMatchData] = useState<any>(null);
    const [showMatchModal, setShowMatchModal] = useState(false);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const handleSwipeComplete = (direction: 'left' | 'right') => {
        const currentProfile = CARDS[currentIndex];
        
        // Logic Match untuk SEMUA kartu
        if (direction === 'right' && currentProfile.isMatch) {
            addMatch(currentProfile); 
            setMatchData(currentProfile);
            setTimeout(() => {
                setShowMatchModal(true);
            }, 200);
        }

        setCurrentIndex((prev) => prev + 1);
        translateX.value = 0;
        translateY.value = 0;
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd(() => {
            if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
                const isRight = translateX.value > 0;
                const targetX = isRight ? width + 100 : -width - 100;
                
                translateX.value = withTiming(targetX, { duration: 200 }, () => {
                    runOnJS(handleSwipeComplete)(isRight ? 'right' : 'left');
                });
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const handleStartChat = () => {
        setShowMatchModal(false);
        router.push({
            pathname: "/chat_room",
            params: { 
                name: matchData?.name, 
                image: matchData?.image 
            }
        });
    };

    return (
        <View style={styles.container}>
            {CARDS.map((card, index) => {
                if (index < currentIndex) return null;
                return (
                    <Card
                        key={card.id}
                        card={card}
                        index={index}
                        currentIndex={currentIndex}
                        translateX={translateX}
                        translateY={translateY}
                        gesture={panGesture}
                        isTopCard={index === currentIndex}
                    />
                );
            }).reverse()}
            
            {currentIndex >= CARDS.length && (
                <View style={styles.emptyState}>
                    <Text style={{ fontSize: 18, color: 'gray' }}>No more profiles.</Text>
                    <TouchableOpacity onPress={() => setCurrentIndex(0)} style={{ marginTop: 20 }}>
                        <Text style={{ color: '#FE3C72', fontWeight: 'bold' }}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* MODAL MATCH */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showMatchModal}
                onRequestClose={() => setShowMatchModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.matchTitle}>It's a Match!</Text>
                        <Text style={styles.matchSubtitle}>You and {matchData?.name} have liked each other.</Text>

                        <View style={styles.avatarRow}>
                            <Image 
                                source={{ uri: 'https://randomuser.me/api/portraits/men/85.jpg' }} 
                                style={[styles.matchAvatar, { borderColor: '#FE3C72', marginRight: -20, zIndex: 1 }]} 
                            />
                            <Image 
                                source={{ uri: matchData?.image }} 
                                style={[styles.matchAvatar, { borderColor: '#4ade80', zIndex: 0 }]} 
                            />
                        </View>

                        <TouchableOpacity style={styles.chatButton} onPress={handleStartChat}>
                            <Ionicons name="chatbubbles" size={24} color="white" />
                            <Text style={styles.chatButtonText}>SEND A MESSAGE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.keepSwipingButton} 
                            onPress={() => setShowMatchModal(false)}
                        >
                            <Text style={styles.keepSwipingText}>Keep Swiping</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const Card = ({ card, index, currentIndex, translateX, translateY, gesture, isTopCard }: any) => {
    const animatedStyle = useAnimatedStyle(() => {
        const offsetIndex = index - currentIndex;
        if (isTopCard) {
            const rotate = interpolate(translateX.value, [-width, width], [-15, 15]);
            return {
                transform: [
                    { translateX: translateX.value },
                    { translateY: translateY.value },
                    { rotate: `${rotate}deg` },
                ],
                zIndex: 100,
            };
        }
        const scale = interpolate(Math.abs(translateX.value), [0, width], [1 - offsetIndex * 0.05, 1], Extrapolation.CLAMP);
        return {
            transform: [{ scale }],
            zIndex: 100 - offsetIndex,
            top: offsetIndex * 10,
        };
    });

    const likeOpacityStyle = useAnimatedStyle(() => ({ opacity: isTopCard ? interpolate(translateX.value, [0, width / 4], [0, 1]) : 0 }));
    const nopeOpacityStyle = useAnimatedStyle(() => ({ opacity: isTopCard ? interpolate(translateX.value, [0, -width / 4], [0, 1]) : 0 }));

    const CardContent = (
        <Animated.View style={[styles.card, animatedStyle]}>
            <Image source={{ uri: card.image }} style={styles.image} />
            
            {/* 2. REVISI BAGIAN LIKE (GANTI ICON LOVE) */}
            <Animated.View style={[styles.overlayIcon, styles.likeIconPos, likeOpacityStyle]}>
                 <Ionicons name="heart-circle" size={120} color="#4ade80" />
            </Animated.View>

            {/* NOPE Tetap Text */}
            <Animated.View style={[styles.overlayLabel, styles.nopeLabel, nopeOpacityStyle]}>
                <Text style={[styles.overlayText, styles.nopeText]}>NOPE</Text>
            </Animated.View>

            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.gradient}>
                <Text style={styles.name}>{card.name}, {card.age}</Text>
                <Text style={styles.desc}>{card.desc}</Text>
            </LinearGradient>
        </Animated.View>
    );
    return isTopCard ? <GestureDetector gesture={gesture}>{CardContent}</GestureDetector> : CardContent;
};

export default SwipeableCard;

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    card: { width: width * 0.92, height: height * 0.7, borderRadius: 20, position: 'absolute', backgroundColor: '#fff', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, overflow: 'hidden' },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingTop: 60 },
    name: { color: 'white', fontSize: 28, fontWeight: 'bold' },
    desc: { color: 'white', fontSize: 16, marginTop: 5 },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    
    // STYLE NOPE (Teks)
    overlayLabel: { position: 'absolute', top: 50, borderWidth: 4, borderRadius: 10, paddingHorizontal: 10, zIndex: 999 },
    overlayText: { fontSize: 32, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 4 },
    nopeLabel: { right: 40, borderColor: '#ef4444', transform: [{ rotate: '15deg' }] },
    nopeText: { color: '#ef4444' },

    // STYLE LIKE (Icon Love) - Tidak perlu border
    overlayIcon: { position: 'absolute', top: 40, zIndex: 999 },
    likeIconPos: { left: 40, transform: [{ rotate: '-15deg' }] },

    // MODAL STYLES
    modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '100%', alignItems: 'center', padding: 20 },
    matchTitle: { fontSize: 40, fontStyle: 'italic', fontWeight: '800', color: '#4ade80', marginBottom: 10 },
    matchSubtitle: { color: 'white', fontSize: 16, marginBottom: 40 },
    avatarRow: { flexDirection: 'row', marginBottom: 50, justifyContent: 'center', alignItems: 'center' },
    matchAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4 },
    chatButton: { backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 50, marginBottom: 20, width: '80%', justifyContent: 'center' },
    chatButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
    keepSwipingButton: { padding: 15 },
    keepSwipingText: { color: 'white', fontSize: 16, fontWeight: '600' }
});