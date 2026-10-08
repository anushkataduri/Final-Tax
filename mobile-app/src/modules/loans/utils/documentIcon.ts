import type React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const isIoniconName = (name: string): name is IoniconName =>
  Object.prototype.hasOwnProperty.call(Ionicons.glyphMap, name);

/** A document template's `iconName`, or `fallback` when it is missing or not an Ionicons glyph. */
export function getDocumentIconName(iconName: string | undefined, fallback: IoniconName = "document-text"): IoniconName {
  return iconName && isIoniconName(iconName) ? iconName : fallback;
}
