import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, Image, Modal, TouchableOpacity, StatusBar } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
    interpolate, 
    runOnJS, 
    useAnimatedStyle, 
    useSharedValue, 
    withSpring, 
    withTiming, 
    Extrapolation 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { addMatch, FEMALE_CARDS, MALE_CARDS, userProfile } from '@/utils/dataStore';

// IMPORT TOMBOL DARI FILE TERPISAH
// Pastikan path-nya sesuai lokasi file ButtonAnimated kamu
import AnimatedButton from './ButtonAnimated'; // Atau '@/components/ButtonAnimated'

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

const SwipeableCard = () => {
    const router = useRouter();
    const isFocused = useIsFocused();
    
    const [cards, setCards] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [myImage, setMyImage] = useState(userProfile.image);
    const [isDark, setIsDark] = useState(userProfile.theme === 'dark');
    
    const [matchData, setMatchData] = useState<any>(null);
    const [showMatchModal, setShowMatchModal] = useState(false);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (isFocused) {
            setMyImage(userProfile.image); 
            setIsDark(userProfile.theme === 'dark');
            setCurrentIndex(0);
            if (userProfile.gender === 'male') setCards([...FEMALE_CARDS]);
            else setCards([...MALE_CARDS]);
        }
    }, [isFocused]); 

    const onSwipeComplete = (direction: 'left' | 'right') => {
        const currentProfile = cards[currentIndex];
        
        translateX.value = 0;
        translateY.value = 0;

        if (direction === 'right' && currentProfile?.isMatch) {
            addMatch(currentProfile); 
            setMatchData(currentProfile);
            setTimeout(() => setShowMatchModal(true), 200);
        }

        setCurrentIndex((prev) => prev + 1);
    };

    const triggerSwipe = (direction: 'left' | 'right') => {
        const targetX = direction === 'right' ? width + 100 : -width - 100;
        translateX.value = withTiming(targetX, { duration: 200 }, () => {
            runOnJS(onSwipeComplete)(direction);
        });
    };

    const bgColor = isDark ? ['#0f172a', '#1e1b4b'] : ['#f1f5f9', '#e2e8f0'];
    const titleColor = isDark ? '#fff' : '#1e293b';
    const cardBgColor = isDark ? '#1e293b' : '#ffffff';
    const cardBorderColor = isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1';

    return (
        <LinearGradient colors={bgColor} style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            
            <View style={styles.topHeader}>
                <Text style={[styles.appTitle, { color: titleColor }]}>Discover</Text>
            </View>

            <View style={styles.cardContainer}>
                {cards.map((card, index) => {
                    if (index < currentIndex) return null;
                    return (
                        <Card
                            key={card.id}
                            card={card}
                            index={index}
                            currentIndex={currentIndex}
                            translateX={translateX}
                            translateY={translateY}
                            onSwipeComplete={onSwipeComplete}
                            isTopCard={index === currentIndex}
                            bgColor={cardBgColor}
                            borderColor={cardBorderColor}
                        />
                    );
                }).reverse()}
                
                {currentIndex >= cards.length && (
                    <View style={styles.emptyState}>
                        <Ionicons name="sparkles" size={50} color={isDark ? "#38bdf8" : "#FE3C72"} />
                        <Text style={{ color: isDark ? '#94a3b8' : '#64748b', marginTop: 10 }}>You've seen everyone!</Text>
                        <TouchableOpacity onPress={() => setCurrentIndex(0)} style={{ marginTop: 20 }}>
                            <Text style={{ color: isDark ? '#38bdf8' : '#FE3C72', fontWeight: 'bold' }}>REFRESH</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* --- ACTION BUTTONS (MENGGUNAKAN KOMPONEN IMPORT) --- */}
            <View style={styles.bottomActions}>
                {/* Tombol X (Close) */}
                <AnimatedButton 
                    type="close" 
                    onPress={() => triggerSwipe('left')} 
                    isDark={isDark} 
                />

                {/* Tombol Love (Heart) */}
                <AnimatedButton 
                    type="heart" 
                    onPress={() => triggerSwipe('right')} 
                    isDark={isDark} 
                />
            </View>

            {/* MODAL MATCH */}
            <Modal animationType="fade" transparent={true} visible={showMatchModal} onRequestClose={() => setShowMatchModal(false)}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e293b' : '#fff' }]}>
                        <Text style={[styles.matchTitle, { color: isDark ? '#fff' : '#1e293b' }]}>IT'S A MATCH</Text>
                        <Text style={styles.matchSubtitle}>Start a conversation now</Text>
                        <View style={styles.avatarRow}>
                            <Image source={{ uri: myImage }} style={[styles.matchAvatar, { borderColor: '#38bdf8', zIndex: 1, marginRight: -25 }]} />
                            <Image source={{ uri: matchData?.image }} style={[styles.matchAvatar, { borderColor: '#ec4899', zIndex: 0 }]} />
                        </View>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => {setShowMatchModal(false); router.push({ pathname: "/chat_room", params: { name: matchData?.name, image: matchData?.image } }); }}>
                            <LinearGradient colors={['#38bdf8', '#2563eb']} style={styles.modalGradient}>
                                <Text style={styles.modalBtnText}>SEND MESSAGE</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowMatchModal(false)}>
                            <Text style={styles.skipText}>Maybe Later</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

const Card = ({ card, index, currentIndex, translateX, translateY, onSwipeComplete, isTopCard, bgColor, borderColor }: any) => {
    const gesture = Gesture.Pan()
        .enabled(isTopCard)
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd(() => {
            if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
                const targetX = translateX.value > 0 ? width + 100 : -width - 100;
                const direction = translateX.value > 0 ? 'right' : 'left';
                translateX.value = withTiming(targetX, { duration: 200 }, () => {
                    runOnJS(onSwipeComplete)(direction);
                });
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const animatedStyle = useAnimatedStyle(() => {
        const offsetIndex = index - currentIndex;
        if (isTopCard) {
            const rotate = interpolate(translateX.value, [-width, width], [-8, 8]);
            return { transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { rotate: `${rotate}deg` }], zIndex: 100 };
        }
        const scale = interpolate(Math.abs(translateX.value), [0, width], [1 - offsetIndex * 0.05, 1], Extrapolation.CLAMP);
        return { transform: [{ scale }, { translateY: offsetIndex * 15 }], zIndex: 100 - offsetIndex };
    });

    const likeOpacity = useAnimatedStyle(() => ({ opacity: isTopCard ? interpolate(translateX.value, [0, width / 4], [0, 1]) : 0 }));
    const nopeOpacity = useAnimatedStyle(() => ({ opacity: isTopCard ? interpolate(translateX.value, [0, -width / 4], [0, 1]) : 0 }));

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.card, animatedStyle, { backgroundColor: bgColor, borderColor: borderColor }]}>
                <Image source={{ uri: card.image }} style={styles.image} />
                
                <Animated.View style={[styles.iconOverlay, styles.likeOverlay, likeOpacity]}>
                     <Ionicons name="heart-circle" size={120} color="#4ade80" />
                </Animated.View>
                <Animated.View style={[styles.iconOverlay, styles.nopeOverlay, nopeOpacity]}>
                    <Ionicons name="close-circle" size={120} color="#ef4444" />
                </Animated.View>

                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradient}>
                    <Text style={styles.name}>{card.name}, {card.age}</Text>
                    <Text style={styles.desc}>{card.desc}</Text>
                </LinearGradient>
            </Animated.View>
        </GestureDetector>
    );
};

export default SwipeableCard;

const styles = StyleSheet.create({
    container: { flex: 1 },
    topHeader: { marginTop: 50, marginBottom: 10, alignItems: 'center' },
    appTitle: { fontSize: 32, fontWeight: '800', letterSpacing: 1 },
    cardContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    card: { width: width * 0.9, height: height * 0.62, borderRadius: 35, position: 'absolute', overflow: 'hidden', borderWidth: 1 },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    gradient: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 25, paddingTop: 100 },
    name: { color: 'white', fontSize: 30, fontWeight: 'bold' },
    desc: { color: '#e2e8f0', fontSize: 16, marginTop: 5 },
    
    iconOverlay: { position: 'absolute', top: 50, zIndex: 99 },
    likeOverlay: { left: 40, transform: [{ rotate: '-15deg' }] },
    nopeOverlay: { right: 40, transform: [{ rotate: '15deg' }] },

    bottomActions: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: 110, width: '70%', alignSelf: 'center' },
    
    emptyState: { alignItems: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '90%', alignItems: 'center', padding: 25, borderRadius: 25 },
    matchTitle: { fontSize: 40, fontWeight: '900', letterSpacing: 1, fontStyle: 'italic' },
    matchSubtitle: { color: '#94a3b8', fontSize: 16, marginBottom: 40 },
    avatarRow: { flexDirection: 'row', marginBottom: 50 },
    matchAvatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4 },
    modalBtn: { width: '100%', height: 55, borderRadius: 30, marginBottom: 20, overflow: 'hidden' },
    modalGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
    skipText: { color: '#64748b', fontWeight: '600' }
});