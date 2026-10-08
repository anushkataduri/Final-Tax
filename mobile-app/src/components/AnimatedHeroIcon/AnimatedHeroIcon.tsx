import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  CYCLE_ICONS,
  FADE_IN,
  FADE_OUT,
  SWAP_INTERVAL,
  styles,
} from "./AnimatedHeroIcon.styles";

export interface AnimatedHeroIconProps {
  size?: number;
  color?: string;
}

export function AnimatedHeroIcon({
  size = 56,
  color = "#FFFFFF",
}: AnimatedHeroIconProps) {
  const [index, setIndex] = useState(0);

  const halo = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const swapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    halo.value = withRepeat(
      withTiming(1, { duration: 1900, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, [halo]);

  useEffect(() => {
    const interval = setInterval(() => {
      opacity.value = withTiming(0, { duration: FADE_OUT });
      scale.value = withTiming(0.55, { duration: FADE_OUT });

      swapTimeout.current = setTimeout(() => {
        setIndex((i) => (i + 1) % CYCLE_ICONS.length);
        opacity.value = withTiming(1, { duration: FADE_IN });
        scale.value = withTiming(1, { duration: FADE_IN, easing: Easing.out(Easing.back(1.6)) });
      }, FADE_OUT + 20);
    }, SWAP_INTERVAL);

    return () => {
      clearInterval(interval);
      swapTimeout.current && clearTimeout(swapTimeout.current);
    };
  }, [opacity, scale]);

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + halo.value * 0.5 }],
    opacity: 0.32 * (1 - halo.value),
  }));

  const glyphStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const ring = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={[styles.wrap, ring]} pointerEvents="none">
      <Animated.View style={[styles.halo, ring, haloStyle]} />
      <View style={[styles.badge, ring]}>
        <Animated.View style={glyphStyle}>
          <Ionicons name={CYCLE_ICONS[index]} size={size * 0.44} color={color} />
        </Animated.View>
      </View>
    </View>
  );
}
