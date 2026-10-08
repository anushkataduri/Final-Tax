import React from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Href } from "expo-router";
import type {
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from "expo-router/js-tabs";

import {
  ACTIVE_ICON_COLOR,
  HIDDEN_FROM_BAR,
  INACTIVE_ICON_COLOR,
  SPRING,
  TAB_META,
  metaFor,
  styles,
  type TabMeta,
} from "./FloatingTabBar.styles";

export {
  FLOATING_TAB_HEIGHT,
  FLOATING_TAB_GAP,
  type TabMeta,
} from "./FloatingTabBar.styles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TabRoute = BottomTabBarProps["state"]["routes"][number];

interface TabItemProps {
  route: TabRoute;
  isFocused: boolean;
  label: string;
  meta: TabMeta;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({
  route,
  isFocused,
  label,
  meta,
  onPress,
  onLongPress,
}: TabItemProps) {
  const pressed = useSharedValue(0);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.value * 0.08, SPRING) }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={label}
      testID={`tab-${route.name}`}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      style={[styles.tabItem, pressStyle]}
    >
      {isFocused ? (
        <View style={styles.activePill}>
          <Ionicons name={meta.icon} size={23} color={ACTIVE_ICON_COLOR} />
        </View>
      ) : (
        <View style={styles.inactivePill}>
          <Ionicons
            name={meta.iconOutline}
            size={23}
            color={INACTIVE_ICON_COLOR}
          />
        </View>
      )}
    </AnimatedPressable>
  );
}

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.floatingWrapper,
        {
          bottom: Math.max(insets.bottom, 10),
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.capsuleContainer}>
        {state.routes
          .filter((route) => {
            const options = descriptors[route.key].options as
              | (BottomTabNavigationOptions & { href?: Href | null })
              | undefined;
            const routeBase = route.name.split("/")[0];
            return (
              !route.name.includes("styles") &&
              !route.name.endsWith(".styles") &&
              !HIDDEN_FROM_BAR.has(routeBase) &&
              Boolean(TAB_META[route.name] ?? TAB_META[routeBase]) &&
              options?.href !== null
            );
          })
          .map((route) => {
            const options = descriptors[route.key]
              .options as BottomTabNavigationOptions & { href?: Href | null };
            const meta = metaFor(route.name);
            const isFocused =
              state.routes[state.index]?.key === route.key;
            const label = meta.label ?? options.title ?? route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              !isFocused &&
                !event.defaultPrevented &&
                navigation.navigate(route.name, route.params);
            };

            const onLongPress = () => {
              navigation.emit({ type: "tabLongPress", target: route.key });
            };

            return (
              <TabItem
                key={route.key}
                route={route}
                meta={meta}
                label={label}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
              />
            );
          })}
      </View>
    </View>
  );
}
