/**
 * Property-based tests for AppLogo component
 *
 * These tests use fast-check to verify universal properties across the input space.
 * Each property test runs 100 iterations with randomly generated inputs to ensure
 * correctness across all valid inputs.
 *
 * Properties tested:
 * - Property 2: Logo Size Variant Rendering (Requirements 1.2, 1.3)
 * - Property 3: Logo Theme Variant Rendering (Requirements 1.4, 1.5)
 * - Property 4: Logo Layout Constraints (Requirements 1.6, 1.7)
 *
 * Validates Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import fc from 'fast-check';
import AppLogo from '../AppLogo';

describe('AppLogo Properties', () => {
  /**
   * Property 2: Logo Size Variant Rendering
   *
   * **Validates: Requirements 1.2, 1.3**
   *
   * For any sidebar state (expanded or collapsed), the Logo component SHALL
   * render the appropriate logo size variant (large for expanded, small for collapsed).
   *
   * This property ensures that:
   * 1. Large size (expanded sidebar) always renders with 48px max-height
   * 2. Small size (collapsed sidebar) always renders with 32px max-height
   * 3. Size rendering is consistent regardless of theme
   */
  it('renders appropriate size variant for any sidebar state (100 iterations)', () => {
    fc.assert(
      fc.property(
        // Generate random size (small or large)
        fc.constantFrom('small' as const, 'large' as const),
        // Generate random theme name
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          // Render component with generated props
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          // Property 1: Image element should exist
          expect(img).toBeInTheDocument();

          // Property 2: Max-height should match size
          const expectedMaxHeight = size === 'small' ? '32px' : '48px';
          expect(img?.style.maxHeight).toBe(expectedMaxHeight);

          // Property 3: Width should always be auto
          expect(img?.style.width).toBe('auto');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: Logo Theme Variant Rendering
   *
   * **Validates: Requirements 1.4, 1.5**
   *
   * For any active theme (light-based or dark-based), the Logo component SHALL
   * render the appropriate theme-optimized logo variant (light logos for light themes,
   * dark logos for dark themes).
   *
   * This property ensures that:
   * 1. Themes containing "dark" or "night" (case-insensitive) render dark logo variant
   * 2. All other themes render light logo variant
   * 3. Theme detection is consistent regardless of size
   */
  it('renders appropriate theme variant for any active theme (100 iterations)', () => {
    fc.assert(
      fc.property(
        // Generate random size
        fc.constantFrom('small' as const, 'large' as const),
        // Generate random theme name
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          // Render component with generated props
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          // Property 1: Image element should exist
          expect(img).toBeInTheDocument();

          // Property 2: Logo source should match theme type
          const isDarkTheme =
            themeName.toLowerCase().includes('dark') || themeName.toLowerCase().includes('night');

          const expectedLogoSrc = isDarkTheme ? '/logo_dark.png' : '/logo.png';
          expect(img?.src).toContain(expectedLogoSrc);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4: Logo Layout Constraints
   *
   * **Validates: Requirements 1.6, 1.7**
   *
   * For any logo rendering, the Logo component SHALL apply height constraints
   * (max-height) and consistent padding to prevent layout breakage.
   *
   * This property ensures that:
   * 1. Padding is always 8px regardless of size or theme
   * 2. Max-height is always set (prevents layout overflow)
   * 3. Width is always auto (maintains aspect ratio)
   * 4. Alt text is always present (accessibility)
   */
  it('applies height constraints and padding for any rendering (100 iterations)', () => {
    fc.assert(
      fc.property(
        // Generate random size
        fc.constantFrom('small' as const, 'large' as const),
        // Generate random theme name
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          // Render component with generated props
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          // Property 1: Image element should exist
          expect(img).toBeInTheDocument();

          // Property 2: Padding should always be 8px
          expect(img?.style.padding).toBe('8px');

          // Property 3: Max-height should always be set (either 32px or 48px)
          const maxHeight = img?.style.maxHeight;
          expect(maxHeight).toBeDefined();
          expect(['32px', '48px']).toContain(maxHeight);

          // Property 4: Width should always be auto (maintains aspect ratio)
          expect(img?.style.width).toBe('auto');

          // Property 5: Alt text should always be present (accessibility)
          expect(img).toHaveAttribute('alt', 'OpenCenter');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Theme detection is case-insensitive
   *
   * Verifies that theme detection works correctly regardless of case variations
   * in the theme name.
   */
  it('theme detection is case-insensitive', () => {
    fc.assert(
      fc.property(
        // Generate random size
        fc.constantFrom('small' as const, 'large' as const),
        // Generate random case variations of "dark" or "night"
        fc.constantFrom('dark', 'Dark', 'DARK', 'DaRk', 'night', 'Night', 'NIGHT', 'NiGhT'),
        // Generate random prefix/suffix
        fc.string({ maxLength: 20 }),
        fc.string({ maxLength: 20 }),
        (size, keyword, prefix, suffix) => {
          // Create theme name with keyword in various positions
          const themeName = `${prefix}${keyword}${suffix}`;

          // Render component
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          // Should always render dark logo variant
          expect(img?.src).toContain('/logo_dark.png');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Light theme detection
   *
   * Verifies that themes without "dark" or "night" keywords always render
   * the light logo variant.
   */
  it('renders light logo for themes without dark/night keywords', () => {
    fc.assert(
      fc.property(
        // Generate random size
        fc.constantFrom('small' as const, 'large' as const),
        // Generate theme name without "dark" or "night"
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter(
            (name) => !name.toLowerCase().includes('dark') && !name.toLowerCase().includes('night')
          ),
        (size, themeName) => {
          // Render component
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          // Should always render light logo variant
          expect(img?.src).toContain('/logo.png');
          // Should NOT contain dark logo
          expect(img?.src).not.toContain('/logo_dark.png');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Consistent rendering across multiple renders
   *
   * Verifies that rendering the same component multiple times produces
   * identical results (deterministic rendering).
   */
  it('produces consistent output for identical inputs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          // Render component twice with identical props
          const { container: container1 } = render(
            <AppLogo logoType={size} themeName={themeName} />
          );
          const { container: container2 } = render(
            <AppLogo logoType={size} themeName={themeName} />
          );

          const img1 = container1.querySelector('img');
          const img2 = container2.querySelector('img');

          // Both renders should produce identical results
          expect(img1?.src).toBe(img2?.src);
          expect(img1?.style.maxHeight).toBe(img2?.style.maxHeight);
          expect(img1?.style.padding).toBe(img2?.style.padding);
          expect(img1?.style.width).toBe(img2?.style.width);
          expect(img1?.getAttribute('alt')).toBe(img2?.getAttribute('alt'));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: All style properties are always defined
   *
   * Verifies that the component always sets all required style properties,
   * preventing undefined or missing styles.
   */
  it('always defines all required style properties', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          // All style properties should be defined
          expect(img?.style.maxHeight).toBeDefined();
          expect(img?.style.maxHeight).not.toBe('');

          expect(img?.style.padding).toBeDefined();
          expect(img?.style.padding).not.toBe('');

          expect(img?.style.width).toBeDefined();
          expect(img?.style.width).not.toBe('');

          // Alt attribute should be defined
          expect(img?.getAttribute('alt')).toBeDefined();
          expect(img?.getAttribute('alt')).not.toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('AppLogo Edge Cases', () => {
  /**
   * Property: Empty theme name handling
   *
   * Verifies that empty theme names are handled gracefully and default
   * to light logo variant.
   */
  it('handles empty theme name by defaulting to light logo', () => {
    fc.assert(
      fc.property(fc.constantFrom('small' as const, 'large' as const), (size) => {
        const { container } = render(<AppLogo logoType={size} themeName="" />);
        const img = container.querySelector('img');

        // Should render light logo for empty theme name
        expect(img?.src).toContain('/logo.png');
      }),
      { numRuns: 10 }
    );
  });

  /**
   * Property: Theme names with special characters
   *
   * Verifies that theme names with special characters are handled correctly.
   */
  it('handles theme names with special characters', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          // Add special characters to theme name
          const specialThemeName = `${themeName}!@#$%^&*()_+-=[]{}|;:',.<>?/~`;

          const { container } = render(<AppLogo logoType={size} themeName={specialThemeName} />);
          const img = container.querySelector('img');

          // Should render without errors
          expect(img).toBeInTheDocument();

          // Should apply correct logo based on dark/night detection
          const isDark =
            specialThemeName.toLowerCase().includes('dark') ||
            specialThemeName.toLowerCase().includes('night');
          const expectedSrc = isDark ? '/logo_dark.png' : '/logo.png';
          expect(img?.src).toContain(expectedSrc);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Theme names with various characters
   *
   * Verifies that theme names with various characters are handled correctly.
   */
  it('handles theme names with various characters', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 1, maxLength: 30 }),
        (size, themeName) => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          // Should render without errors
          expect(img).toBeInTheDocument();

          // Should have all required properties
          expect(img?.style.maxHeight).toBeDefined();
          expect(img?.style.padding).toBe('8px');
          expect(img?.style.width).toBe('auto');
          expect(img).toHaveAttribute('alt', 'OpenCenter');
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Very long theme names
   *
   * Verifies that very long theme names don't cause issues.
   */
  it('handles very long theme names', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 100, maxLength: 1000 }),
        (size, themeName) => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          // Should render without errors
          expect(img).toBeInTheDocument();

          // Should correctly detect dark/night keywords even in long strings
          const isDark =
            themeName.toLowerCase().includes('dark') || themeName.toLowerCase().includes('night');
          const expectedSrc = isDark ? '/logo_dark.png' : '/logo.png';
          expect(img?.src).toContain(expectedSrc);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Theme names with "dark" or "night" as substrings
   *
   * Verifies that theme detection works correctly when "dark" or "night"
   * appear as substrings within larger words.
   */
  it('detects dark/night keywords even as substrings', () => {
    const testCases = [
      'darkness',
      'darkened',
      'darken',
      'nightmare',
      'nightly',
      'midnight',
      'darkmode',
      'nightmode',
    ];

    testCases.forEach((themeName) => {
      fc.assert(
        fc.property(fc.constantFrom('small' as const, 'large' as const), (size) => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          // Should render dark logo variant
          expect(img?.src).toContain('/logo_dark.png');
        }),
        { numRuns: 5 }
      );
    });
  });
});
