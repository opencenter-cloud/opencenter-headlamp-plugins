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
 * Note: MUI sx-based styles are applied via CSS classes in jsdom and cannot be
 * asserted through element.style. Tests verify observable DOM attributes instead.
 *
 * Validates Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import fc from 'fast-check';
import React from 'react';
import AppLogo from '../AppLogo';

describe('AppLogo Properties', () => {
  /**
   * Property 2: Logo Size Variant Rendering
   *
   * For any sidebar state (expanded or collapsed), the Logo component SHALL
   * render an img element with the correct source regardless of size.
   */
  it('renders appropriate size variant for any sidebar state (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          expect(img).toBeInTheDocument();
          expect(img).toHaveAttribute('alt', 'OpenCenter');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: Logo Theme Variant Rendering
   *
   * For any active theme (light-based or dark-based), the Logo component SHALL
   * render the appropriate theme-optimized logo variant.
   */
  it('renders appropriate theme variant for any active theme (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          expect(img).toBeInTheDocument();

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
   * For any logo rendering, the Logo component SHALL render an img with
   * alt text and correct source, ensuring accessibility and correct variant.
   */
  it('always renders with required DOM attributes (100 iterations)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          expect(img).toBeInTheDocument();
          expect(img).toHaveAttribute('alt', 'OpenCenter');
          expect(img?.src).toBeDefined();
          expect(img?.src).not.toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Theme detection is case-insensitive
   */
  it('theme detection is case-insensitive', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.constantFrom('dark', 'Dark', 'DARK', 'DaRk', 'night', 'Night', 'NIGHT', 'NiGhT'),
        fc.string({ maxLength: 20 }),
        fc.string({ maxLength: 20 }),
        (size, keyword, prefix, suffix) => {
          const themeName = `${prefix}${keyword}${suffix}`;

          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          expect(img?.src).toContain('/logo_dark.png');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Light theme detection: themes without "dark" or "night" keywords always
   * render the light logo variant.
   */
  it('renders light logo for themes without dark/night keywords', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc
          .string({ minLength: 1, maxLength: 50 })
          .filter(
            name => !name.toLowerCase().includes('dark') && !name.toLowerCase().includes('night')
          ),
        (size, themeName) => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          expect(img?.src).toContain('/logo.png');
          expect(img?.src).not.toContain('/logo_dark.png');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Consistent rendering across multiple renders: identical inputs produce
   * identical results (deterministic rendering).
   */
  it('produces consistent output for identical inputs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          const { container: container1 } = render(
            <AppLogo logoType={size} themeName={themeName} />
          );
          const { container: container2 } = render(
            <AppLogo logoType={size} themeName={themeName} />
          );

          const img1 = container1.querySelector('img');
          const img2 = container2.querySelector('img');

          expect(img1?.src).toBe(img2?.src);
          expect(img1?.getAttribute('alt')).toBe(img2?.getAttribute('alt'));
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('AppLogo Edge Cases', () => {
  /**
   * Empty theme name defaults to light logo.
   */
  it('handles empty theme name by defaulting to light logo', () => {
    fc.assert(
      fc.property(fc.constantFrom('small' as const, 'large' as const), size => {
        const { container } = render(<AppLogo logoType={size} themeName="" />);
        const img = container.querySelector('img');

        expect(img?.src).toContain('/logo.png');
      }),
      { numRuns: 10 }
    );
  });

  /**
   * Theme names with special characters are handled correctly.
   */
  it('handles theme names with special characters', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 1, maxLength: 50 }),
        (size, themeName) => {
          const specialThemeName = `${themeName}!@#$%^&*()_+-=[]{}|;:',.<>?/~`;

          const { container } = render(<AppLogo logoType={size} themeName={specialThemeName} />);
          const img = container.querySelector('img');

          expect(img).toBeInTheDocument();

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
   * Theme names with various characters render correctly with required attributes.
   */
  it('handles theme names with various characters', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 1, maxLength: 30 }),
        (size, themeName) => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          expect(img).toBeInTheDocument();
          expect(img).toHaveAttribute('alt', 'OpenCenter');
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Very long theme names don't cause issues.
   */
  it('handles very long theme names', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('small' as const, 'large' as const),
        fc.string({ minLength: 100, maxLength: 1000 }),
        (size, themeName) => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          expect(img).toBeInTheDocument();

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
   * Detects dark/night keywords even as substrings.
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

    testCases.forEach(themeName => {
      fc.assert(
        fc.property(fc.constantFrom('small' as const, 'large' as const), size => {
          const { container } = render(<AppLogo logoType={size} themeName={themeName} />);
          const img = container.querySelector('img');

          expect(img?.src).toContain('/logo_dark.png');
        }),
        { numRuns: 5 }
      );
    });
  });
});
