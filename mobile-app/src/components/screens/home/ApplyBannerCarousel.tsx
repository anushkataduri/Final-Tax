/**
 * ApplyBannerCarousel
 * Paged "apply for" carousel shown at the top of the Home screen.
 *
 * Rules:
 *  - Exactly one auto-advance timer exists at a time.
 *  - Timer restarts after every page change (manual or automatic).
 *  - Timer never runs while the user is dragging or while Home is unfocused.
 *  - Page index is always derived from the real scroll offset and clamped to
 *    the banner list, so dots always match the visible banner.
 *  - After the last banner it wraps to the first without animating backwards.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useIsFocused } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/use-theme";
import { styles, CARD_WIDTH } from "@/styles/app/(main)/home.styles";
import type { ServiceCategoryId } from "@/types/domain";

/** ── Types ──────────────────────────────────────────────────────────────── */

export interface ApplyBanner {
  key: string;
  id: ServiceCategoryId;
  title: string;
  desc: string;
  cta: string;
  icon: any; // Ionicons name
  bg: string;
}

interface ApplyBannerCarouselProps {
  banners: readonly ApplyBanner[];
  colors: ReturnType<typeof useTheme>;
  onSelect: (categoryId: ServiceCategoryId) => void;
}

/** ── Constants ──────────────────────────────────────────────────────────── */

/** Delay before the carousel advances on its own (ms). */
const BANNER_AUTO_ADVANCE_MS = 4000;

/** ── Component ─────────────────────────────────────────────────────────── */

export function ApplyBannerCarousel({
  banners,
  colors,
  onSelect,
}: ApplyBannerCarouselProps) {
  const scrollRef = useRef<ScrollView>(null);
  const [pageWidth, setPageWidth] = useState(CARD_WIDTH);
  const [page, setPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const isFocused = useIsFocused();

  const count = banners.length;
  const lastIndex = Math.max(0, count - 1);
  const activePage = Math.min(Math.max(page, 0), lastIndex);

  const pageFromOffset = (offsetX: number) =>
    Math.min(Math.max(Math.round(offsetX / pageWidth), 0), lastIndex);

  // If the list ever shrinks below the current page, snap to the last valid banner.
  useEffect(() => {
    if (page > lastIndex) {
      scrollRef.current?.scrollTo({ x: lastIndex * pageWidth, animated: false });
    }
  }, [page, lastIndex, pageWidth]);

  // Auto-advance: one timeout per page; cancelled whenever dragging, unfocused, or unmounted.
  useEffect(() => {
    if (count < 2 || !isFocused || isDragging) return undefined;
    const timer = setTimeout(() => {
      const next = activePage >= lastIndex ? 0 : activePage + 1;
      scrollRef.current?.scrollTo({ x: next * pageWidth, animated: next !== 0 });
      setPage(next);
    }, BANNER_AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [activePage, count, isDragging, isFocused, lastIndex, pageWidth]);

  if (count === 0) return null;

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={count > 1}
        showsHorizontalScrollIndicator={false}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - pageWidth) > 0.5) {
            setPageWidth(w);
            scrollRef.current?.scrollTo({ x: activePage * w, animated: false });
          }
        }}
        onScrollBeginDrag={() => setIsDragging(true)}
        onScrollEndDrag={() => setIsDragging(false)}
        onMomentumScrollEnd={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
          setIsDragging(false);
          setPage(pageFromOffset(e.nativeEvent.contentOffset.x));
        }}
        scrollEventThrottle={16}
      >
        {banners.map((banner) => (
          <View key={banner.key} style={[styles.bannerPage, { width: pageWidth }]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onSelect(banner.id)}
              style={[styles.loansBanner, { backgroundColor: banner.bg }]}
            >
              <View style={styles.bannerLeft}>
                <Text style={styles.bannerTitle} numberOfLines={1}>
                  {banner.title}
                </Text>
                <Text style={styles.bannerDesc} numberOfLines={2}>
                  {banner.desc}
                </Text>
                <View style={[styles.exploreButton, { backgroundColor: colors.orange }]}>
                  <Text style={styles.exploreText}>{banner.cta}</Text>
                  <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                </View>
              </View>

              <View style={styles.dotGrid} pointerEvents="none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <View key={i} style={styles.decorDot} />
                ))}
              </View>

              <View style={styles.bannerRight}>
                <View style={styles.bannerIconCircle}>
                  <Ionicons name={banner.icon} size={44} color={colors.orange} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {count > 1 ? (
        <View style={styles.dotsRow}>
          {banners.map((b, i) => (
            <View
              key={b.key}
              style={[
                styles.pageDot,
                {
                  backgroundColor: i === activePage ? colors.primary : colors.border,
                  width: i === activePage ? 18 : 7,
                  height: 7,
                },
              ]}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
