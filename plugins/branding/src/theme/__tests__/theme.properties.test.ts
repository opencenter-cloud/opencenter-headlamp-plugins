/**
 * Property-based tests for theme token completeness
 *
 * These tests verify that all registered themes have complete token definitions
 * using property-based testing to ensure universal correctness.
 *
 * Property tested:
 * - Property 5: Theme Token Completeness (Requirements 2.4-2.11)
 *
 * Validates Requirements: 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11
 */

import type { AppTheme } from '@kinvolk/headlamp-plugin/lib';
import { OpenCenterAbyssalNight } from '../opencenter.dark';
import { OpenCenterCloudDay } from '../opencenter.light';

/**
 * Helper function to validate that a theme has all required tokens defined
 *
 * This function checks for the presence and type of all required theme tokens
 * as specified in Requirements 2.4-2.11.
 *
 * @param theme - The theme object to validate
 * @returns Object with validation results
 */
const validateThemeTokens = (
  theme: AppTheme
): {
  isValid: boolean;
  missingTokens: string[];
  invalidTypes: string[];
} => {
  const missingTokens: string[] = [];
  const invalidTypes: string[] = [];

  // Helper to check if a value is defined and not null/undefined
  const isDefined = (value: unknown): boolean => value !== undefined && value !== null;

  // Helper to check if a value is a valid hex color
  const isValidHexColor = (value: unknown): boolean => {
    return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
  };

  // Requirement 2.4: Primary color token
  if (!isDefined(theme.primary)) {
    missingTokens.push('primary');
  } else if (!isValidHexColor(theme.primary)) {
    invalidTypes.push('primary (not a valid hex color)');
  }

  // Requirement 2.5: Secondary color token
  if (!isDefined(theme.secondary)) {
    missingTokens.push('secondary');
  } else if (!isValidHexColor(theme.secondary)) {
    invalidTypes.push('secondary (not a valid hex color)');
  }

  // Requirement 2.6: Navbar tokens
  if (!isDefined(theme.navbar)) {
    missingTokens.push('navbar');
  } else {
    if (!isDefined(theme.navbar.background)) {
      missingTokens.push('navbar.background');
    } else if (!isValidHexColor(theme.navbar.background)) {
      invalidTypes.push('navbar.background (not a valid hex color)');
    }

    if (!isDefined(theme.navbar.color)) {
      missingTokens.push('navbar.color');
    } else if (!isValidHexColor(theme.navbar.color)) {
      invalidTypes.push('navbar.color (not a valid hex color)');
    }
  }

  // Requirement 2.7: Sidebar tokens
  if (!isDefined(theme.sidebar)) {
    missingTokens.push('sidebar');
  } else {
    if (!isDefined(theme.sidebar.background)) {
      missingTokens.push('sidebar.background');
    } else if (!isValidHexColor(theme.sidebar.background)) {
      invalidTypes.push('sidebar.background (not a valid hex color)');
    }

    if (!isDefined(theme.sidebar.color)) {
      missingTokens.push('sidebar.color');
    } else if (!isValidHexColor(theme.sidebar.color)) {
      invalidTypes.push('sidebar.color (not a valid hex color)');
    }

    if (!isDefined(theme.sidebar.selectedBackground)) {
      missingTokens.push('sidebar.selectedBackground');
    } else if (!isValidHexColor(theme.sidebar.selectedBackground)) {
      invalidTypes.push('sidebar.selectedBackground (not a valid hex color)');
    }

    if (!isDefined(theme.sidebar.selectedColor)) {
      missingTokens.push('sidebar.selectedColor');
    } else if (!isValidHexColor(theme.sidebar.selectedColor)) {
      invalidTypes.push('sidebar.selectedColor (not a valid hex color)');
    }

    if (!isDefined(theme.sidebar.actionBackground)) {
      missingTokens.push('sidebar.actionBackground');
    } else if (!isValidHexColor(theme.sidebar.actionBackground)) {
      invalidTypes.push('sidebar.actionBackground (not a valid hex color)');
    }
  }

  // Requirement 2.8: Background tokens
  if (!isDefined(theme.background)) {
    missingTokens.push('background');
  } else {
    if (!isDefined(theme.background.default)) {
      missingTokens.push('background.default');
    } else if (!isValidHexColor(theme.background.default)) {
      invalidTypes.push('background.default (not a valid hex color)');
    }

    if (!isDefined(theme.background.surface)) {
      missingTokens.push('background.surface');
    } else if (!isValidHexColor(theme.background.surface)) {
      invalidTypes.push('background.surface (not a valid hex color)');
    }

    if (!isDefined(theme.background.muted)) {
      missingTokens.push('background.muted');
    } else if (!isValidHexColor(theme.background.muted)) {
      invalidTypes.push('background.muted (not a valid hex color)');
    }
  }

  // Requirement 2.9: Text tokens
  if (!isDefined(theme.text)) {
    missingTokens.push('text');
  } else {
    if (!isDefined(theme.text.primary)) {
      missingTokens.push('text.primary');
    } else if (!isValidHexColor(theme.text.primary)) {
      invalidTypes.push('text.primary (not a valid hex color)');
    }
  }

  // Requirement 2.10: Link color token
  if (!isDefined(theme.link)) {
    missingTokens.push('link');
  } else {
    if (!isDefined(theme.link.color)) {
      missingTokens.push('link.color');
    } else if (!isValidHexColor(theme.link.color)) {
      invalidTypes.push('link.color (not a valid hex color)');
    }
  }

  // Requirement 2.11: Radius token
  if (!isDefined(theme.radius)) {
    missingTokens.push('radius');
  } else if (typeof theme.radius !== 'number') {
    invalidTypes.push('radius (not a number)');
  } else if (theme.radius < 0) {
    invalidTypes.push('radius (negative value)');
  }

  // Additional validation: name and base
  if (!isDefined(theme.name)) {
    missingTokens.push('name');
  } else if (typeof theme.name !== 'string' || theme.name.trim() === '') {
    invalidTypes.push('name (not a non-empty string)');
  }

  if (!isDefined(theme.base)) {
    missingTokens.push('base');
  } else if (theme.base !== 'light' && theme.base !== 'dark') {
    invalidTypes.push('base (not "light" or "dark")');
  }

  return {
    isValid: missingTokens.length === 0 && invalidTypes.length === 0,
    missingTokens,
    invalidTypes,
  };
};

describe('Theme Token Completeness Properties', () => {
  /**
   * Property 5: Theme Token Completeness
   *
   * **Validates: Requirements 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11**
   *
   * For all registered themes, each theme SHALL define all required tokens:
   * - primary (Requirement 2.4)
   * - secondary (Requirement 2.5)
   * - navbar.background, navbar.color (Requirement 2.6)
   * - sidebar.background, sidebar.color, sidebar.selectedBackground,
   *   sidebar.selectedColor, sidebar.actionBackground (Requirement 2.7)
   * - background.default, background.surface, background.muted (Requirement 2.8)
   * - link.color (Requirement 2.10)
   * - radius (Requirement 2.11)
   *
   * This property ensures that:
   * 1. All themes have complete token definitions
   * 2. No required tokens are missing
   * 3. All color tokens are valid hex colors
   * 4. All numeric tokens are valid numbers
   * 5. Theme structure is consistent across all themes
   */
  it('all registered themes have all required tokens defined', () => {
    // Array of all registered themes
    const themes: AppTheme[] = [OpenCenterCloudDay, OpenCenterAbyssalNight];

    // Validate each theme
    themes.forEach((theme) => {
      const validation = validateThemeTokens(theme);

      // Assert that the theme is valid
      if (!validation.isValid) {
        const errorMessage = [
          `Theme "${theme.name}" is missing required tokens or has invalid types:`,
          validation.missingTokens.length > 0
            ? `  Missing tokens: ${validation.missingTokens.join(', ')}`
            : '',
          validation.invalidTypes.length > 0
            ? `  Invalid types: ${validation.invalidTypes.join(', ')}`
            : '',
        ]
          .filter(Boolean)
          .join('\n');

        throw new Error(errorMessage);
      }

      // Explicit assertions for clarity
      expect(validation.isValid).toBe(true);
      expect(validation.missingTokens).toEqual([]);
      expect(validation.invalidTypes).toEqual([]);
    });
  });

  /**
   * Additional property: Theme name uniqueness
   *
   * Verifies that all registered themes have unique names.
   * This prevents confusion and ensures themes can be distinguished.
   */
  it('all registered themes have unique names', () => {
    const themes: AppTheme[] = [OpenCenterCloudDay, OpenCenterAbyssalNight];

    const names = themes.map((theme) => theme.name);
    const uniqueNames = new Set(names);

    expect(uniqueNames.size).toBe(names.length);
  });

  /**
   * Additional property: Theme base type validity
   *
   * Verifies that all registered themes have valid base types ('light' or 'dark').
   */
  it('all registered themes have valid base types', () => {
    const themes: AppTheme[] = [OpenCenterCloudDay, OpenCenterAbyssalNight];

    themes.forEach((theme) => {
      expect(['light', 'dark']).toContain(theme.base);
    });
  });

  /**
   * Additional property: Theme structure consistency
   *
   * Verifies that all registered themes have the same structure
   * (same top-level keys and nested keys).
   */
  it('all registered themes have consistent structure', () => {
    const themes: AppTheme[] = [OpenCenterCloudDay, OpenCenterAbyssalNight];

    if (themes.length < 2) {
      // Skip test if there's only one theme
      return;
    }

    // Get keys from first theme as reference
    const referenceTheme = themes[0];
    const referenceKeys = Object.keys(referenceTheme).sort();

    // Validate all other themes have the same keys
    themes.slice(1).forEach((theme) => {
      const themeKeys = Object.keys(theme).sort();
      expect(themeKeys).toEqual(referenceKeys);

      // Validate nested structure for objects
      if (referenceTheme.background && theme.background) {
        expect(Object.keys(theme.background).sort()).toEqual(
          Object.keys(referenceTheme.background).sort()
        );
      }

      if (referenceTheme.text && theme.text) {
        expect(Object.keys(theme.text).sort()).toEqual(Object.keys(referenceTheme.text).sort());
      }

      if (referenceTheme.navbar && theme.navbar) {
        expect(Object.keys(theme.navbar).sort()).toEqual(Object.keys(referenceTheme.navbar).sort());
      }

      if (referenceTheme.sidebar && theme.sidebar) {
        expect(Object.keys(theme.sidebar).sort()).toEqual(
          Object.keys(referenceTheme.sidebar).sort()
        );
      }

      if (referenceTheme.link && theme.link) {
        expect(Object.keys(theme.link).sort()).toEqual(Object.keys(referenceTheme.link).sort());
      }
    });
  });

  /**
   * Additional property: Color token format consistency
   *
   * Verifies that all color tokens in all themes use valid hex format
   * (case-insensitive).
   */
  it('all color tokens use valid hex format', () => {
    const themes: AppTheme[] = [OpenCenterCloudDay, OpenCenterAbyssalNight];

    themes.forEach((theme) => {
      // Check all color tokens
      const colorTokens = [
        theme.primary,
        theme.secondary,
        theme.background.default,
        theme.background.surface,
        theme.background.muted,
        theme.text.primary,
        theme.link.color,
        theme.navbar.background,
        theme.navbar.color,
        theme.sidebar.background,
        theme.sidebar.color,
        theme.sidebar.selectedBackground,
        theme.sidebar.selectedColor,
        theme.sidebar.actionBackground,
      ];

      colorTokens.forEach((color) => {
        // Should match hex format (case-insensitive)
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });
  });

  /**
   * Additional property: Radius token validity
   *
   * Verifies that radius tokens are positive numbers.
   */
  it('all radius tokens are positive numbers', () => {
    const themes: AppTheme[] = [OpenCenterCloudDay, OpenCenterAbyssalNight];

    themes.forEach((theme) => {
      expect(typeof theme.radius).toBe('number');
      expect(theme.radius).toBeGreaterThan(0);
      expect(Number.isFinite(theme.radius)).toBe(true);
    });
  });
});
