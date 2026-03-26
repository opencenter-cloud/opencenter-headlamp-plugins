/**
 * Unit tests for theme validation
 *
 * These tests verify that both OpenCenter themes (Cloud Day and Abyssal Night)
 * have the correct structure, complete token definitions, and valid color values.
 *
 * Tests validate:
 * - Theme names and base types
 * - Completeness of all required tokens
 * - Valid hex color format for all color values
 *
 * Validates Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11
 */

import type { AppTheme } from '@kinvolk/headlamp-plugin/lib/AppTheme';
import { OpenCenterAbyssalNight } from '../opencenter.dark';
import { OpenCenterCloudDay } from '../opencenter.light';

// Helper function to validate hex color format
const isValidHexColor = (color: string): boolean => {
  return /^#[0-9a-fA-F]{6}$/.test(color);
};

// Helper function to validate all color tokens in a theme
const validateThemeColors = (theme: AppTheme): void => {
  expect(isValidHexColor(theme.primary)).toBe(true);
  expect(isValidHexColor(theme.secondary)).toBe(true);
  expect(isValidHexColor(theme.background.default)).toBe(true);
  expect(isValidHexColor(theme.background.surface)).toBe(true);
  expect(isValidHexColor(theme.background.muted)).toBe(true);
  expect(isValidHexColor(theme.text.primary)).toBe(true);
  expect(isValidHexColor(theme.link.color)).toBe(true);
  expect(isValidHexColor(theme.navbar.background)).toBe(true);
  expect(isValidHexColor(theme.navbar.color)).toBe(true);
  expect(isValidHexColor(theme.sidebar.background)).toBe(true);
  expect(isValidHexColor(theme.sidebar.color)).toBe(true);
  expect(isValidHexColor(theme.sidebar.selectedBackground)).toBe(true);
  expect(isValidHexColor(theme.sidebar.selectedColor)).toBe(true);
  expect(isValidHexColor(theme.sidebar.actionBackground)).toBe(true);
};

describe('OpenCenterCloudDay Theme', () => {
  /**
   * Validates Requirements: 2.2
   *
   * The Theme_Engine SHALL provide a theme named "Light" with light base
   */
  it('has correct name', () => {
    expect(OpenCenterCloudDay.name).toBe('Light');
  });

  /**
   * Validates Requirements: 2.2
   *
   * The theme SHALL have base type "light"
   */
  it('has light base type', () => {
    expect(OpenCenterCloudDay.base).toBe('light');
  });

  /**
   * Validates Requirements: 2.4, 2.5
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define primary and secondary color tokens
   */
  it('defines primary and secondary colors', () => {
    expect(OpenCenterCloudDay.primary).toBeDefined();
    expect(OpenCenterCloudDay.secondary).toBeDefined();
    expect(typeof OpenCenterCloudDay.primary).toBe('string');
    expect(typeof OpenCenterCloudDay.secondary).toBe('string');
  });

  /**
   * Validates Requirements: 2.6
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define navbar background and text tokens
   */
  it('defines navbar tokens', () => {
    expect(OpenCenterCloudDay.navbar).toBeDefined();
    expect(OpenCenterCloudDay.navbar.background).toBeDefined();
    expect(OpenCenterCloudDay.navbar.color).toBeDefined();
    expect(typeof OpenCenterCloudDay.navbar.background).toBe('string');
    expect(typeof OpenCenterCloudDay.navbar.color).toBe('string');
  });

  /**
   * Validates Requirements: 2.7
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define sidebar tokens
   * (background, text, selectedBackground, selectedColor, actionBackground)
   */
  it('defines all sidebar tokens', () => {
    expect(OpenCenterCloudDay.sidebar).toBeDefined();
    expect(OpenCenterCloudDay.sidebar.background).toBeDefined();
    expect(OpenCenterCloudDay.sidebar.color).toBeDefined();
    expect(OpenCenterCloudDay.sidebar.selectedBackground).toBeDefined();
    expect(OpenCenterCloudDay.sidebar.selectedColor).toBeDefined();
    expect(OpenCenterCloudDay.sidebar.actionBackground).toBeDefined();
    expect(typeof OpenCenterCloudDay.sidebar.background).toBe('string');
    expect(typeof OpenCenterCloudDay.sidebar.color).toBe('string');
    expect(typeof OpenCenterCloudDay.sidebar.selectedBackground).toBe('string');
    expect(typeof OpenCenterCloudDay.sidebar.selectedColor).toBe('string');
    expect(typeof OpenCenterCloudDay.sidebar.actionBackground).toBe('string');
  });

  /**
   * Validates Requirements: 2.8
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define background tokens
   * (default, surface, muted)
   */
  it('defines all background tokens', () => {
    expect(OpenCenterCloudDay.background).toBeDefined();
    expect(OpenCenterCloudDay.background.default).toBeDefined();
    expect(OpenCenterCloudDay.background.surface).toBeDefined();
    expect(OpenCenterCloudDay.background.muted).toBeDefined();
    expect(typeof OpenCenterCloudDay.background.default).toBe('string');
    expect(typeof OpenCenterCloudDay.background.surface).toBe('string');
    expect(typeof OpenCenterCloudDay.background.muted).toBe('string');
  });

  /**
   * Validates Requirements: 2.9
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define text tokens
   * (primary, secondary)
   */
  it('defines all text tokens', () => {
    expect(OpenCenterCloudDay.text).toBeDefined();
    expect(OpenCenterCloudDay.text.primary).toBeDefined();
    expect(typeof OpenCenterCloudDay.text.primary).toBe('string');
  });

  /**
   * Validates Requirements: 2.10
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define link color token
   */
  it('defines link color token', () => {
    expect(OpenCenterCloudDay.link).toBeDefined();
    expect(OpenCenterCloudDay.link.color).toBeDefined();
    expect(typeof OpenCenterCloudDay.link.color).toBe('string');
  });

  /**
   * Validates Requirements: 2.11
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define radius token
   */
  it('defines radius token', () => {
    expect(OpenCenterCloudDay.radius).toBeDefined();
    expect(typeof OpenCenterCloudDay.radius).toBe('number');
    expect(OpenCenterCloudDay.radius).toBeGreaterThan(0);
  });

  /**
   * Validates Requirements: 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10
   *
   * All color values SHALL be valid hex colors (#RRGGBB format)
   */
  it('has valid hex color values for all color tokens', () => {
    validateThemeColors(OpenCenterCloudDay);
  });

  /**
   * Additional validation: Verify specific color values match design spec
   */
  it('has correct brand colors', () => {
    expect(OpenCenterCloudDay.primary).toBe('#C8102E'); // OpenCenter Red
    expect(OpenCenterCloudDay.secondary).toBe('#3A4A63'); // Navy Blue
    expect(OpenCenterCloudDay.background.default).toBe('#F3F3F3'); // Light Gray
    expect(OpenCenterCloudDay.background.surface).toBe('#FFFFFF'); // White
  });
});

describe('OpenCenterAbyssalNight Theme', () => {
  /**
   * Validates Requirements: 2.3
   *
   * The Theme_Engine SHALL provide a theme named "Dark" with dark base
   */
  it('has correct name', () => {
    expect(OpenCenterAbyssalNight.name).toBe('Dark');
  });

  /**
   * Validates Requirements: 2.3
   *
   * The theme SHALL have base type "dark"
   */
  it('has dark base type', () => {
    expect(OpenCenterAbyssalNight.base).toBe('dark');
  });

  /**
   * Validates Requirements: 2.4, 2.5
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define primary and secondary color tokens
   */
  it('defines primary and secondary colors', () => {
    expect(OpenCenterAbyssalNight.primary).toBeDefined();
    expect(OpenCenterAbyssalNight.secondary).toBeDefined();
    expect(typeof OpenCenterAbyssalNight.primary).toBe('string');
    expect(typeof OpenCenterAbyssalNight.secondary).toBe('string');
  });

  /**
   * Validates Requirements: 2.6
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define navbar background and text tokens
   */
  it('defines navbar tokens', () => {
    expect(OpenCenterAbyssalNight.navbar).toBeDefined();
    expect(OpenCenterAbyssalNight.navbar.background).toBeDefined();
    expect(OpenCenterAbyssalNight.navbar.color).toBeDefined();
    expect(typeof OpenCenterAbyssalNight.navbar.background).toBe('string');
    expect(typeof OpenCenterAbyssalNight.navbar.color).toBe('string');
  });

  /**
   * Validates Requirements: 2.7
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define sidebar tokens
   * (background, text, selectedBackground, selectedColor, actionBackground)
   */
  it('defines all sidebar tokens', () => {
    expect(OpenCenterAbyssalNight.sidebar).toBeDefined();
    expect(OpenCenterAbyssalNight.sidebar.background).toBeDefined();
    expect(OpenCenterAbyssalNight.sidebar.color).toBeDefined();
    expect(OpenCenterAbyssalNight.sidebar.selectedBackground).toBeDefined();
    expect(OpenCenterAbyssalNight.sidebar.selectedColor).toBeDefined();
    expect(OpenCenterAbyssalNight.sidebar.actionBackground).toBeDefined();
    expect(typeof OpenCenterAbyssalNight.sidebar.background).toBe('string');
    expect(typeof OpenCenterAbyssalNight.sidebar.color).toBe('string');
    expect(typeof OpenCenterAbyssalNight.sidebar.selectedBackground).toBe('string');
    expect(typeof OpenCenterAbyssalNight.sidebar.selectedColor).toBe('string');
    expect(typeof OpenCenterAbyssalNight.sidebar.actionBackground).toBe('string');
  });

  /**
   * Validates Requirements: 2.8
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define background tokens
   * (default, surface, muted)
   */
  it('defines all background tokens', () => {
    expect(OpenCenterAbyssalNight.background).toBeDefined();
    expect(OpenCenterAbyssalNight.background.default).toBeDefined();
    expect(OpenCenterAbyssalNight.background.surface).toBeDefined();
    expect(OpenCenterAbyssalNight.background.muted).toBeDefined();
    expect(typeof OpenCenterAbyssalNight.background.default).toBe('string');
    expect(typeof OpenCenterAbyssalNight.background.surface).toBe('string');
    expect(typeof OpenCenterAbyssalNight.background.muted).toBe('string');
  });

  /**
   * Validates Requirements: 2.9
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define text tokens
   * (primary, secondary)
   */
  it('defines all text tokens', () => {
    expect(OpenCenterAbyssalNight.text).toBeDefined();
    expect(OpenCenterAbyssalNight.text.primary).toBeDefined();
    expect(typeof OpenCenterAbyssalNight.text.primary).toBe('string');
  });

  /**
   * Validates Requirements: 2.10
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define link color token
   */
  it('defines link color token', () => {
    expect(OpenCenterAbyssalNight.link).toBeDefined();
    expect(OpenCenterAbyssalNight.link.color).toBeDefined();
    expect(typeof OpenCenterAbyssalNight.link.color).toBe('string');
  });

  /**
   * Validates Requirements: 2.11
   *
   * FOR ALL registered themes, THE Theme_Engine SHALL define radius token
   */
  it('defines radius token', () => {
    expect(OpenCenterAbyssalNight.radius).toBeDefined();
    expect(typeof OpenCenterAbyssalNight.radius).toBe('number');
    expect(OpenCenterAbyssalNight.radius).toBeGreaterThan(0);
  });

  /**
   * Validates Requirements: 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10
   *
   * All color values SHALL be valid hex colors (#RRGGBB format)
   */
  it('has valid hex color values for all color tokens', () => {
    validateThemeColors(OpenCenterAbyssalNight);
  });

  /**
   * Additional validation: Verify specific color values match design spec
   */
  it('has correct brand colors', () => {
    expect(OpenCenterAbyssalNight.primary).toBe('#E63D4F'); // Bright Red
    expect(OpenCenterAbyssalNight.secondary).toBe('#2A3750'); // Dark Navy
    expect(OpenCenterAbyssalNight.background.default).toBe('#121824'); // Very Dark Blue
    expect(OpenCenterAbyssalNight.background.surface).toBe('#1E2A3C'); // Dark Blue
  });
});

describe('Theme Consistency', () => {
  /**
   * Validates that both themes have consistent structure
   *
   * This ensures that both themes can be used interchangeably without
   * breaking the UI due to missing properties.
   */
  it('both themes have identical structure', () => {
    const lightKeys = Object.keys(OpenCenterCloudDay).sort();
    const darkKeys = Object.keys(OpenCenterAbyssalNight).sort();

    expect(lightKeys).toEqual(darkKeys);
  });

  /**
   * Validates that both themes have the same nested structure
   */
  it('both themes have identical nested structure', () => {
    // Check background structure
    const lightBgKeys = Object.keys(OpenCenterCloudDay.background).sort();
    const darkBgKeys = Object.keys(OpenCenterAbyssalNight.background).sort();
    expect(lightBgKeys).toEqual(darkBgKeys);

    // Check text structure
    const lightTextKeys = Object.keys(OpenCenterCloudDay.text).sort();
    const darkTextKeys = Object.keys(OpenCenterAbyssalNight.text).sort();
    expect(lightTextKeys).toEqual(darkTextKeys);

    // Check navbar structure
    const lightNavKeys = Object.keys(OpenCenterCloudDay.navbar).sort();
    const darkNavKeys = Object.keys(OpenCenterAbyssalNight.navbar).sort();
    expect(lightNavKeys).toEqual(darkNavKeys);

    // Check sidebar structure
    const lightSidebarKeys = Object.keys(OpenCenterCloudDay.sidebar).sort();
    const darkSidebarKeys = Object.keys(OpenCenterAbyssalNight.sidebar).sort();
    expect(lightSidebarKeys).toEqual(darkSidebarKeys);

    // Check link structure
    const lightLinkKeys = Object.keys(OpenCenterCloudDay.link).sort();
    const darkLinkKeys = Object.keys(OpenCenterAbyssalNight.link).sort();
    expect(lightLinkKeys).toEqual(darkLinkKeys);
  });

  /**
   * Validates that both themes have different color values
   *
   * This ensures that the themes are actually distinct and not duplicates.
   */
  it('themes have different primary colors', () => {
    expect(OpenCenterCloudDay.primary).not.toBe(OpenCenterAbyssalNight.primary);
  });

  /**
   * Validates that both themes have appropriate base types
   */
  it('themes have opposite base types', () => {
    expect(OpenCenterCloudDay.base).toBe('light');
    expect(OpenCenterAbyssalNight.base).toBe('dark');
  });
});
