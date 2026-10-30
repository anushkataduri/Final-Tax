/**
 * ServicesGrid
 * Redesigned Services section displaying modern 3D cards matching the
 * TaxEdge reference design (2-column layout + full-width bottom card).
 */

import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/use-theme";
import {
  styles,
  getServiceCardThemedStyle,
  getServiceLabelThemedStyle,
  getServiceDescThemedStyle,
  getServiceArrowBtnThemedStyle,
} from "@/styles/app/(main)/home.styles";
import type { DashboardServiceTile } from "@/types/home.types";

interface ServiceCardProps {
  service: DashboardServiceTile;
  isDark: boolean;
  colors: ReturnType<typeof useTheme>;
  onPress: (tile: DashboardServiceTile) => void;
}

export function ServiceCard({
  service,
  isDark,
  colors,
  onPress,
}: ServiceCardProps) {
  const isFull = Boolean(service.isFullWidth);

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => onPress(service)}
      testID={`service-card-${service.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${service.label}: ${service.description.replace(/\n/g, " ")}`}
      style={[
        isFull ? styles.serviceCardFullWidth : styles.serviceCard2Col,
        getServiceCardThemedStyle(
          isDark,
          colors,
          service.bgColor,
          service.borderColor
        ),
      ]}
    >
      <View
        style={
          isFull
            ? styles.serviceCardContentFull
            : styles.serviceCardContent2Col
        }
      >
        <View>
          <Text
            style={[
              styles.serviceTitle,
              getServiceLabelThemedStyle(isDark, colors),
            ]}
            numberOfLines={1}
          >
            {service.label}
          </Text>
          <Text
            style={[
              styles.serviceDesc,
              getServiceDescThemedStyle(isDark, colors),
            ]}
            numberOfLines={isFull ? 1 : 2}
          >
            {service.description}
          </Text>
        </View>

        <View
          style={[
            styles.serviceArrowBtn,
            getServiceArrowBtnThemedStyle(isDark, colors),
          ]}
        >
          <Ionicons
            name="arrow-forward"
            size={14}
            color={service.arrowColor}
          />
        </View>
      </View>

      <Image
        source={service.image}
        style={
          isFull
            ? styles.serviceIllustrationFull
            : styles.serviceIllustration2Col
        }
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

interface ServicesGridProps {
  services: DashboardServiceTile[];
  isDark: boolean;
  colors: ReturnType<typeof useTheme>;
  onPress: (tile: DashboardServiceTile) => void;
}

export function ServicesGrid({
  services,
  isDark,
  colors,
  onPress,
}: ServicesGridProps) {
  const twoColItems = services.filter((s) => !s.isFullWidth);
  const fullWidthItems = services.filter((s) => s.isFullWidth);

  const rows: DashboardServiceTile[][] = [];
  for (let i = 0; i < twoColItems.length; i += 2) {
    rows.push(twoColItems.slice(i, i + 2));
  }

  return (
    <View style={styles.servicesContainer}>
      {rows.map((row, rowIndex) => (
        <View key={`services-row-${rowIndex}`} style={styles.servicesRow}>
          {row.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isDark={isDark}
              colors={colors}
              onPress={onPress}
            />
          ))}
        </View>
      ))}

      {fullWidthItems.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          isDark={isDark}
          colors={colors}
          onPress={onPress}
        />
      ))}
    </View>
  );
}
