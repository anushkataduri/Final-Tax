import React from "react";
import { View } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Circle, G } from "react-native-svg";
import { styles, getWrapSizeStyle } from "./VaultIllustration.styles";

export const VaultIllustration: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <View style={[styles.wrap, getWrapSizeStyle(size)]}>
    <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <Defs>
        <LinearGradient id="fb" x1="0" y1="0" x2="56" y2="56">
          <Stop offset="0%" stopColor="#0B3C73" />
          <Stop offset="100%" stopColor="#052750" />
        </LinearGradient>
        <LinearGradient id="ff" x1="0" y1="18" x2="52" y2="48">
          <Stop offset="0%" stopColor="#125199" />
          <Stop offset="100%" stopColor="#083B75" />
        </LinearGradient>
        <LinearGradient id="sg" x1="28" y1="20" x2="48" y2="48">
          <Stop offset="0%" stopColor="#FB923C" />
          <Stop offset="100%" stopColor="#EA580C" />
        </LinearGradient>
      </Defs>
      <Path d="M6 16C6 13.8 7.8 12 10 12h10l4 4h22c2.2 0 4 1.8 4 4v22c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V16z" fill="url(#fb)" />
      <Rect x="14" y="8" width="24" height="22" rx="3" fill="#FFFFFF" />
      <Rect x="18" y="13" width="16" height="1.8" rx="0.9" fill="#94A3B8" />
      <Rect x="18" y="17" width="12" height="1.8" rx="0.9" fill="#3B82F6" />
      <Path d="M5 21C5 19.3 6.3 18 8 18h40c1.7 0 3 1.3 3 3l-1.5 22c0 2.2-1.8 4-4 4h-35c-2.2 0-4-1.8-4-4L5 21z" fill="url(#ff)" />
      <Path d="M8 19h40" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
      <G>
        <Path d="M38 23l9 3.5c0 7.5-4 14-9 16.5-5-2.5-9-9-9-16.5L38 23z" fill="url(#sg)" />
        <Path d="M35.5 32v-1.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5V32" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
        <Rect x="34.5" y="31.5" width="7" height="5.5" rx="1.4" fill="#FFF" />
        <Circle cx="38" cy="33.8" r="0.9" fill="#EA580C" />
      </G>
    </Svg>
  </View>
);

export default VaultIllustration;
