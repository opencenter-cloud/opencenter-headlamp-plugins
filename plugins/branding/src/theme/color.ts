/**
 * Color utilities for deterministic theme color generation.
 *
 * This module provides type-safe color manipulation functions that operate
 * in sRGB color space. All blending operations are deterministic and produce
 * identical output for identical inputs.
 */

/**
 * Type-safe hex color string that must start with '#'
 * @example "#FF0000", "#C8102E"
 */
export type HexColor = `#${string}`;

/**
 * Parse #RRGGBB hex color into [r, g, b] array with values 0-255
 *
 * Algorithm:
 * 1. Remove '#' prefix from hex string
 * 2. Validate length is exactly 6 characters
 * 3. Parse first 2 chars as red (base 16)
 * 4. Parse next 2 chars as green (base 16)
 * 5. Parse last 2 chars as blue (base 16)
 * 6. Return [r, g, b] array
 *
 * @param hex - Hex color string (e.g., "#FF0000")
 * @returns RGB array [r, g, b] with values 0-255
 * @throws Error if hex format is invalid
 *
 * @example
 * hexToRgb("#FF0000") // Returns [255, 0, 0]
 * hexToRgb("#C8102E") // Returns [200, 16, 46]
 */
export function hexToRgb(hex: HexColor): [number, number, number] {
  // Validate that hex starts with '#'
  if (!hex.startsWith('#')) {
    throw new Error(`Invalid hex color: ${hex} (must be #RRGGBB format)`);
  }

  // Remove '#' prefix
  const cleanHex = hex.slice(1);

  // Validate hex format (must be exactly 6 characters)
  if (cleanHex.length !== 6) {
    throw new Error(`Invalid hex color: ${hex} (must be #RRGGBB format)`);
  }

  // Parse RGB components (base 16)
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  return [r, g, b];
}

/**
 * Convert [r, g, b] array to #RRGGBB hex color
 *
 * Algorithm:
 * 1. Clamp each RGB value to 0-255 range
 * 2. Round each value to nearest integer
 * 3. Convert each value to 2-digit hex string (pad with 0 if needed)
 * 4. Concatenate as "#RRGGBB"
 * 5. Return hex string
 *
 * @param rgb - RGB array [r, g, b] with values 0-255
 * @returns Hex color string in lowercase
 *
 * @example
 * rgbToHex([255, 0, 0]) // Returns "#ff0000"
 * rgbToHex([200, 16, 46]) // Returns "#c8102e"
 * rgbToHex([300, -10, 128]) // Returns "#ff0080" (clamped)
 */
export function rgbToHex(rgb: [number, number, number]): HexColor {
  const [r, g, b] = rgb;

  // Clamp values to 0-255 range and round to nearest integer
  // Handle NaN by treating it as 0
  const clamp = (value: number): number => {
    if (isNaN(value)) {
      return 0;
    }
    return Math.round(Math.max(0, Math.min(255, value)));
  };

  const rClamped = clamp(r);
  const gClamped = clamp(g);
  const bClamped = clamp(b);

  // Convert to 2-digit hex strings (pad with 0 if needed)
  const toHex = (value: number): string => {
    return value.toString(16).padStart(2, '0');
  };

  return `#${toHex(rClamped)}${toHex(gClamped)}${toHex(bClamped)}` as HexColor;
}

/**
 * Blend two hex colors in sRGB color space using linear interpolation
 *
 * Algorithm:
 * 1. Clamp blend factor t to 0-1 range
 * 2. Convert both colors to RGB using hexToRgb
 * 3. For each channel (r, g, b): result = a + (b - a) * t
 * 4. Convert result RGB back to hex using rgbToHex
 * 5. Return blended hex color
 *
 * Mathematical formula:
 *   R_result = R_A + (R_B - R_A) × t
 *   G_result = G_A + (G_B - G_A) × t
 *   B_result = B_A + (B_B - B_A) × t
 *
 * @param a - First color (hex)
 * @param b - Second color (hex)
 * @param t - Blend factor (0 = all a, 1 = all b, 0.5 = midpoint)
 * @returns Blended color (hex)
 *
 * @example
 * blend("#FF0000", "#0000FF", 0) // Returns "#ff0000" (all red)
 * blend("#FF0000", "#0000FF", 1) // Returns "#0000ff" (all blue)
 * blend("#FF0000", "#0000FF", 0.5) // Returns "#800080" (purple)
 * blend("#FFFFFF", "#C8102E", 0.1) // Returns "#fae7ea" (pale pink)
 */
export function blend(a: HexColor, b: HexColor, t: number): HexColor {
  // Handle NaN by treating it as 0 (return color a)
  if (isNaN(t)) {
    return a;
  }

  // Clamp blend factor to 0-1 range
  const tClamped = Math.max(0, Math.min(1, t));

  // Convert both colors to RGB
  const [rA, gA, bA] = hexToRgb(a);
  const [rB, gB, bB] = hexToRgb(b);

  // Linear interpolation for each channel
  const rResult = rA + (rB - rA) * tClamped;
  const gResult = gA + (gB - gA) * tClamped;
  const bResult = bA + (bB - bA) * tClamped;

  // Convert back to hex
  return rgbToHex([rResult, gResult, bResult]);
}

/**
 * Generate muted background color from theme tokens
 *
 * Blends backgroundDefault toward surface by a percentage that depends
 * on the theme base type:
 * - Light themes: 6% blend (subtle difference)
 * - Dark themes: 12% blend (more pronounced difference)
 *
 * This creates a subtle background variant for disabled or muted UI states.
 *
 * @param opts - Theme tokens and base type
 * @param opts.backgroundDefault - Main background color
 * @param opts.surface - Elevated surface color
 * @param opts.base - Theme base type ('light' or 'dark')
 * @returns Muted background color (hex)
 *
 * @example
 * // Light theme
 * mutedFromTokens({
 *   backgroundDefault: "#F3F3F3",
 *   surface: "#FFFFFF",
 *   base: "light"
 * }) // Returns "#f4f4f4" (6% toward white)
 *
 * // Dark theme
 * mutedFromTokens({
 *   backgroundDefault: "#121824",
 *   surface: "#1E2A3C",
 *   base: "dark"
 * }) // Returns "#131a28" (12% toward surface)
 */
export function mutedFromTokens(opts: {
  backgroundDefault: HexColor;
  surface: HexColor;
  base: 'light' | 'dark';
}): HexColor {
  const { backgroundDefault, surface, base } = opts;

  // Determine blend factor based on theme base
  // Light themes use 6% blend, dark themes use 12% blend
  const blendFactor = base === 'light' ? 0.06 : 0.12;

  return blend(backgroundDefault, surface, blendFactor);
}

/**
 * Generate selected background color from theme tokens
 *
 * Blends surface toward primary by a percentage that depends on the theme
 * base type:
 * - Light themes: 10% blend (subtle highlight)
 * - Dark themes: 16% blend (more visible highlight)
 *
 * This creates a background color for selected items in navigation and lists.
 *
 * @param opts - Theme tokens and base type
 * @param opts.surface - Elevated surface color
 * @param opts.primary - Primary brand color
 * @param opts.base - Theme base type ('light' or 'dark')
 * @returns Selected background color (hex)
 *
 * @example
 * // Light theme
 * selectedBackgroundFromTokens({
 *   surface: "#FFFFFF",
 *   primary: "#C8102E",
 *   base: "light"
 * }) // Returns "#fceaed" (10% toward red)
 *
 * // Dark theme
 * selectedBackgroundFromTokens({
 *   surface: "#1E2A3C",
 *   primary: "#E63D4F",
 *   base: "dark"
 * }) // Returns "#3e2e3f" (16% toward red)
 */
export function selectedBackgroundFromTokens(opts: {
  surface: HexColor;
  primary: HexColor;
  base: 'light' | 'dark';
}): HexColor {
  const { surface, primary, base } = opts;

  // Determine blend factor based on theme base
  // Light themes use 10% blend, dark themes use 16% blend
  const blendFactor = base === 'light' ? 0.1 : 0.16;

  return blend(surface, primary, blendFactor);
}
