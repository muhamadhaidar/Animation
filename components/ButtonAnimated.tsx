import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    interpolate, 
    interpolateColor 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
    type: 'close' | 'heart';
    onPress: () => void;
    isDark: boolean;
}

const AnimatedButton = ({ type, onPress, isDark }: ButtonProps) => {
    // Value: 0 = Diam, 0.5 = Hover, 1 = Tekan
    const animation = useSharedValue(0);
    const isHovered = useSharedValue(false);

    // Gesture Hover (Kursor)
    const hoverGesture = Gesture.Hover()
        .onStart(() => {
            isHovered.value = true;
            if (animation.value !== 1) {
                animation.value = withSpring(0.5, { damping: 10, stiffness: 150 });
            }
        })
        .onEnd(() => {
            isHovered.value = false;
            if (animation.value !== 1) {
                animation.value = withSpring(0);
            }
        });

    const handlePressIn = () => {
        animation.value = withSpring(1, { damping: 12, stiffness: 200 });
    };

    const handlePressOut = () => {
        animation.value = withSpring(isHovered.value ? 0.5 : 0);
    };

    // Konfigurasi Warna
    const activeColor = type === 'heart' ? '#ec4899' : '#ef4444'; 
    const outlineColor = isDark ? 'rgba(255,255,255,0.2)' : '#e2e8f0'; 
    const iconName = type === 'heart' ? "heart" : "close";

    // Animasi Container
    const containerStyle = useAnimatedStyle(() => {
        const scale = interpolate(animation.value, [0, 0.5, 1], [1, 1.1, 1.25]); 
        
        const backgroundColor = interpolateColor(
            animation.value,
            [0, 1],
            ['transparent', activeColor]
        );

        const borderColor = interpolateColor(
            animation.value,
            [0, 1],
            [outlineColor, activeColor]
        );

        return {
            transform: [{ scale }],
            backgroundColor,
            borderColor,
        };
    });

    // Animasi Ikon Putih
    const whiteIconStyle = useAnimatedStyle(() => ({
        opacity: animation.value,
    }));

    return (
        <GestureDetector gesture={hoverGesture}>
            <TouchableWithoutFeedback 
                onPressIn={handlePressIn} 
                onPressOut={handlePressOut} 
                onPress={onPress}
            >
                <Animated.View style={[styles.buttonBase, containerStyle]}>
                    {/* Layer 1: Ikon Warna Asli */}
                    <View style={styles.iconContainer}>
                        <Ionicons name={iconName} size={35} color={activeColor} />
                    </View>

                    {/* Layer 2: Ikon Putih (Overlay) */}
                    <Animated.View style={[styles.iconContainer, whiteIconStyle]}>
                        <Ionicons name={iconName} size={35} color="white" />
                    </Animated.View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </GestureDetector>
    );
};

export default AnimatedButton;

const styles = StyleSheet.create({
    buttonBase: {
        width: 70, 
        height: 70, 
        borderRadius: 35, 
        justifyContent: 'center', 
        alignItems: 'center',
        borderWidth: 2, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    }
});