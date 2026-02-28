/**
 * Returns Tailwind glow class and text color style based on a hex color string.
 * Falls back to neon green if unrecognized.
 */
export function getRankGlowClass(hexColor: string): string {
  const normalized = hexColor.toLowerCase().replace("#", "");
  // Green variants
  if (
    normalized.startsWith("22c") ||
    normalized.startsWith("16a3") ||
    normalized.startsWith("4ade") ||
    normalized.startsWith("34d") ||
    normalized.startsWith("86ef")
  ) {
    return "glow-green";
  }
  // Blue variants
  if (
    normalized.startsWith("3b8") ||
    normalized.startsWith("60a5") ||
    normalized.startsWith("93c5") ||
    normalized.startsWith("1d4") ||
    normalized.startsWith("2563") ||
    normalized.startsWith("38b")
  ) {
    return "glow-blue";
  }
  // Purple variants
  if (
    normalized.startsWith("a85") ||
    normalized.startsWith("c084") ||
    normalized.startsWith("7c3a") ||
    normalized.startsWith("9333") ||
    normalized.startsWith("d8b4")
  ) {
    return "glow-purple";
  }
  // Gold/Yellow variants
  if (
    normalized.startsWith("f59") ||
    normalized.startsWith("fcd3") ||
    normalized.startsWith("fbbf") ||
    normalized.startsWith("f97") ||
    normalized.startsWith("eab")
  ) {
    return "glow-gold";
  }
  return "glow-green";
}

export function getRankTextGlowClass(hexColor: string): string {
  const glow = getRankGlowClass(hexColor);
  return `text-glow-${glow.replace("glow-", "")}`;
}

export function getBorderGlowStyle(hexColor: string): React.CSSProperties {
  return {
    borderColor: hexColor,
    boxShadow: `0 0 12px ${hexColor}66, 0 0 24px ${hexColor}22`,
  };
}

// Needed for TypeScript
import type React from "react";
