import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur'; 
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TABS_COUNT = 3; 
const BAR_HEIGHT = 80;

// --- PERBAIKAN DIMENSI ---
const MARGIN_SIDE = 20; // Margin kiri/kanan container
const CONTAINER_WIDTH = SCREEN_WIDTH - (MARGIN_SIDE * 2); // Lebar ASLI container
const TAB_WIDTH = CONTAINER_WIDTH / TABS_COUNT; // Lebar per tab disesuaikan container
const ICON_SIZE = 28;

// --- KONFIGURASI OVERLAY (Bentuk Kapsul) ---
const OVERLAY_WIDTH = 95;  
const OVERLAY_HEIGHT = 55; 
const OVERLAY_RADIUS = OVERLAY_HEIGHT / 2;

const routesConfig: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  index: { icon: 'copy-outline', label: 'Discover' },
  matches: { icon: 'chatbubble-ellipses-outline', label: 'Messages' },
  profile: { icon: 'person-outline', label: 'Profile' },
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const translateX = useSharedValue(0);
  const overlayScale = useSharedValue(1);
  const activeIndex = useSharedValue(state.index);

  useEffect(() => {
    // Sinkronisasi posisi awal
    translateX.value = withSpring(state.index * TAB_WIDTH);
    activeIndex.value = state.index;
  }, [state.index]);

  const navigateToTab = (index: number) => {
    const routeName = state.routes[index].name;
    const isFocused = state.index === index;

    const event = navigation.emit({
      type: 'tabPress',
      target: routeName,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      overlayScale.value = withSpring(1.2, { damping: 15 });
    })
    .onUpdate((event) => {
      // PERBAIKAN GESTURE:
      // Kurangi MARGIN_SIDE karena absoluteX dihitung dari ujung layar kiri
      // sedangkan container kita mulai dari pixel ke-20.
      const relativeX = event.absoluteX - MARGIN_SIDE;
      
      // Pusatkan titik geser ke tengah tab
      const nextPos = relativeX - (TAB_WIDTH / 2);

      // Clamp (batasi) agar tidak keluar dari container
      translateX.value = Math.max(0, Math.min(nextPos, CONTAINER_WIDTH - TAB_WIDTH));

      const estimatedIndex = Math.round(translateX.value / TAB_WIDTH);
      if (estimatedIndex !== activeIndex.value && estimatedIndex >= 0 && estimatedIndex < TABS_COUNT) {
        activeIndex.value = estimatedIndex;
      }
    })
    .onEnd(() => {
      const finalIndex = Math.round(translateX.value / TAB_WIDTH);
      const snapPoint = finalIndex * TAB_WIDTH;

      translateX.value = withSpring(snapPoint, { damping: 15, stiffness: 150 });
      overlayScale.value = withSpring(1);
      
      runOnJS(navigateToTab)(finalIndex);
    });

  const overlayStyle = useAnimatedStyle(() => {
    const centerOffset = (TAB_WIDTH - OVERLAY_WIDTH) / 2;
    return {
      transform: [
        { translateX: translateX.value + centerOffset },
        { scale: overlayScale.value },
      ],
    };
  });

  const ContainerComponent = Platform.OS === 'ios' ? BlurView : View;
  const containerProps = Platform.OS === 'ios' ? { intensity: 80, tint: 'dark' } : {};

  return (
    <View style={styles.floatingContainer}>
      {/* @ts-ignore */}
      <ContainerComponent {...containerProps} style={[styles.blurContainer, Platform.OS === 'android' && styles.androidFallbackBG]}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={styles.gestureArea}>
            
            {/* OVERLAY PILL SHAPE */}
            <Animated.View style={[styles.overlayGlowContainer, overlayStyle]}>
               <LinearGradient
                  colors={['rgba(255, 50, 100, 0.7)', 'rgba(255, 100, 50, 0.1)']}
                  style={styles.glowGradient}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
            </Animated.View>

            {/* ICONS ROW */}
            <View style={styles.iconsRow}>
              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const config = routesConfig[route.name];
                const isFocused = state.index === index;

                const iconAnimatedStyle = useAnimatedStyle(() => {
                  const isActive = activeIndex.value === index;
                  return {
                     opacity: withTiming(isActive ? 1 : 0.5, { duration: 200 }),
                     transform: [{ scale: withSpring(isActive ? 1.1 : 1) }]
                  };
                });

                return (
                  <View key={route.key} style={styles.tabItemContainer}>
                    <Animated.View style={iconAnimatedStyle}>
                      <Ionicons
                        name={config.icon}
                        size={ICON_SIZE}
                        color={isFocused ? 'white' : '#A0A0A0'}
                      />
                    </Animated.View>
                  </View>
                );
              })}
            </View>

          </Animated.View>
        </GestureDetector>
      </ContainerComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: 25,
    // Gunakan margin yang sama dengan logika perhitungan
    left: MARGIN_SIDE,
    right: MARGIN_SIDE,
    height: BAR_HEIGHT,
    borderRadius: BAR_HEIGHT / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  blurContainer: {
    flex: 1,
    borderRadius: BAR_HEIGHT / 2,
  },
  androidFallbackBG: {
    backgroundColor: 'rgba(20, 20, 30, 0.95)',
  },
  gestureArea: {
    flex: 1,
    justifyContent: 'center',
  },
  iconsRow: {
    flexDirection: 'row',
    // Gunakan flex-start karena lebar item sudah fix (TAB_WIDTH)
    justifyContent: 'flex-start', 
    alignItems: 'center',
    height: '100%',
    zIndex: 2,
  },
  tabItemContainer: {
    width: TAB_WIDTH, // Lebar Tab sekarang pas 1/3 dari container
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayGlowContainer: {
    position: 'absolute',
    top: (BAR_HEIGHT - OVERLAY_HEIGHT) / 2,
    left: 0,
    width: OVERLAY_WIDTH,
    height: OVERLAY_HEIGHT,
    borderRadius: OVERLAY_RADIUS,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: OVERLAY_RADIUS,
    opacity: 0.8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  }
});

export default CustomTabBar;