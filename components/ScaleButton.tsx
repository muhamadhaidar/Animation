import React from 'react';
import { TouchableWithoutFeedback, ViewStyle, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface ScaleButtonProps {
    onPress?: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    scaleMin?: number; // Seberapa kecil saat ditekan (default 0.95)
}

const ScaleButton = ({ onPress, children, style, scaleMin = 0.95 }: ScaleButtonProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = () => {
        scale.value = withSpring(scaleMin, { damping: 10, stiffness: 150 });
    };

    const onPressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 150 });
    };

    return (
        <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
            <Animated.View style={[style, animatedStyle]}>
                {children}
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

export default ScaleButton;