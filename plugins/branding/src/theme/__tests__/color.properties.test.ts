/**
 * Property-based tests for color utility functions
 *
 * These tests use fast-check to verify universal properties across the input space.
 * Each property test runs 100 iterations with randomly generated inputs to ensure
 * correctness across all valid inputs.
 *
 * Properties tested:
 * - Property 6: Color Blending Validity (Requirements 3.1, 3.2)
 * - Property 7: Color Blending Determinism (Requirement 3.7)
 * - Property 8: Hex-RGB Round Trip (Requirements 15.1, 15.2)
 *
 * Validates Requirements: 3.1, 3.2, 3.7, 15.1, 15.2
 */

import fc from 'fast-check';
import { blend, type HexColor, hexToRgb, rgbToHex } from '../color';

// Helper to generate 6-character hex strings
const hexString = () =>
  fc
    .array(
      fc.constantFrom(
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f'
      ),
      { minLength: 6, maxLength: 6 }
    )
    .map(arr => arr.join(''));

describe('Color Blending Properties', () => {
  /**
   * Property 6: Color Blending Validity
   *
   * **Validates: Requirements 3.1, 3.2**
   *
   * For any two valid hex colors and blend factor, the blend function SHALL
   * produce a valid hex color with RGB values clamped to 0-255 range.
   *
   * This property ensures that:
   * 1. The output is always a valid hex color format (#RRGGBB)
   * 2. RGB values are always within the valid 0-255 range
   * 3. No invalid colors are produced regardless of input
   */
  it('blend produces valid hex colors for all inputs (100 iterations)', () => {
    fc.assert(
      fc.property(
        // Generate random 6-character hex strings (without #)
        hexString(),
        hexString(),
        // Generate blend factor between 0 and 1
        fc.double({ min: 0, max: 1 }),
        (hexA, hexB, t) => {
          // Convert to HexColor type (add # prefix)
          const colorA = `#${hexA}` as HexColor;
          const colorB = `#${hexB}` as HexColor;

          // Blend the colors
          const result = blend(colorA, colorB, t);

          // Property 1: Result should be valid hex format (#RRGGBB)
          expect(result).toMatch(/^#[0-9a-f]{6}$/);

          // Property 2: RGB values should be in valid range (0-255)
          const [r, g, b] = hexToRgb(result);
          expect(r).toBeGreaterThanOrEqual(0);
          expect(r).toBeLessThanOrEqual(255);
          expect(g).toBeGreaterThanOrEqual(0);
          expect(g).toBeLessThanOrEqual(255);
          expect(b).toBeGreaterThanOrEqual(0);
          expect(b).toBeLessThanOrEqual(255);

          // Property 3: RGB values should be integers (no decimals)
          expect(Number.isInteger(r)).toBe(true);
          expect(Number.isInteger(g)).toBe(true);
          expect(Number.isInteger(b)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 7: Color Blending Determinism
   *
   * **Validates: Requirement 3.7**
   *
   * For all color blending operations with identical inputs, the blend function
   * SHALL produce identical output (deterministic behavior).
   *
   * This property ensures that:
   * 1. Same inputs always produce same outputs
   * 2. No randomness or non-deterministic behavior
   * 3. Results are reproducible across runs
   */
  it('blend produces identical output for identical inputs', () => {
    fc.assert(
      fc.property(hexString(), hexString(), fc.double({ min: 0, max: 1 }), (hexA, hexB, t) => {
        const colorA = `#${hexA}` as HexColor;
        const colorB = `#${hexB}` as HexColor;

        // Call blend twice with identical inputs
        const result1 = blend(colorA, colorB, t);
        const result2 = blend(colorA, colorB, t);

        // Results must be identical (deterministic)
        expect(result1).toBe(result2);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Blend boundary conditions
   *
   * Verifies that blend factor boundaries work correctly:
   * - t=0 should return first color
   * - t=1 should return second color
   */
  it('blend respects boundary conditions (t=0 and t=1)', () => {
    fc.assert(
      fc.property(hexString(), hexString(), (hexA, hexB) => {
        const colorA = `#${hexA}` as HexColor;
        const colorB = `#${hexB}` as HexColor;

        // When t=0, should return first color
        const resultAtZero = blend(colorA, colorB, 0);
        expect(resultAtZero.toLowerCase()).toBe(colorA.toLowerCase());

        // When t=1, should return second color
        const resultAtOne = blend(colorA, colorB, 1);
        expect(resultAtOne.toLowerCase()).toBe(colorB.toLowerCase());
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Blend factor clamping
   *
   * Verifies that out-of-range blend factors are clamped correctly:
   * - t < 0 should be treated as t=0
   * - t > 1 should be treated as t=1
   *
   * Note: We filter out NaN values as they are not valid blend factors
   */
  it('blend clamps out-of-range blend factors', () => {
    fc.assert(
      fc.property(
        hexString(),
        hexString(),
        fc.double({ min: -10, max: -0.01, noNaN: true }), // Negative values, no NaN
        (hexA, hexB, tNegative) => {
          const colorA = `#${hexA}` as HexColor;
          const colorB = `#${hexB}` as HexColor;

          // Negative t should be clamped to 0 (return first color)
          const resultNegative = blend(colorA, colorB, tNegative);
          expect(resultNegative.toLowerCase()).toBe(colorA.toLowerCase());
        }
      ),
      { numRuns: 50 }
    );

    fc.assert(
      fc.property(
        hexString(),
        hexString(),
        fc.double({ min: 1.01, max: 10, noNaN: true }), // Values > 1, no NaN
        (hexA, hexB, tLarge) => {
          const colorA = `#${hexA}` as HexColor;
          const colorB = `#${hexB}` as HexColor;

          // t > 1 should be clamped to 1 (return second color)
          const resultLarge = blend(colorA, colorB, tLarge);
          expect(resultLarge.toLowerCase()).toBe(colorB.toLowerCase());
        }
      ),
      { numRuns: 50 }
    );
  });
});

describe('Hex-RGB Conversion Properties', () => {
  /**
   * Property 8: Hex-RGB Round Trip
   *
   * **Validates: Requirements 15.1, 15.2**
   *
   * For any valid hex color, converting to RGB and back to hex SHALL produce
   * an equivalent color value.
   *
   * This property ensures that:
   * 1. hexToRgb and rgbToHex are inverse operations
   * 2. No information is lost in the conversion
   * 3. Color values are preserved through round-trip conversion
   */
  it('hexToRgb → rgbToHex preserves color value', () => {
    fc.assert(
      fc.property(hexString(), hex => {
        const color = `#${hex}` as HexColor;

        // Convert hex → RGB → hex
        const rgb = hexToRgb(color);
        const result = rgbToHex(rgb);

        // Should produce equivalent color (case-insensitive)
        expect(result.toLowerCase()).toBe(color.toLowerCase());
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: RGB-Hex round trip with clamping
   *
   * Verifies that RGB values are properly clamped during conversion:
   * - Values outside 0-255 range are clamped
   * - Clamped values round-trip correctly
   */
  it('rgbToHex clamps and preserves values in valid range', () => {
    fc.assert(
      fc.property(
        // Generate RGB values that may be out of range
        fc.integer({ min: -100, max: 400 }),
        fc.integer({ min: -100, max: 400 }),
        fc.integer({ min: -100, max: 400 }),
        (r, g, b) => {
          // Convert RGB → hex → RGB
          const hex = rgbToHex([r, g, b]);
          const [rResult, gResult, bResult] = hexToRgb(hex);

          // Values should be clamped to 0-255 range
          expect(rResult).toBeGreaterThanOrEqual(0);
          expect(rResult).toBeLessThanOrEqual(255);
          expect(gResult).toBeGreaterThanOrEqual(0);
          expect(gResult).toBeLessThanOrEqual(255);
          expect(bResult).toBeGreaterThanOrEqual(0);
          expect(bResult).toBeLessThanOrEqual(255);

          // Clamped values should match expected clamping
          const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
          expect(rResult).toBe(clamp(r));
          expect(gResult).toBe(clamp(g));
          expect(bResult).toBe(clamp(b));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property: Hex format consistency
   *
   * Verifies that rgbToHex always produces lowercase hex colors
   * with exactly 6 characters (plus # prefix).
   */
  it('rgbToHex produces consistent hex format', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        (r, g, b) => {
          const hex = rgbToHex([r, g, b]);

          // Should match hex format: # followed by 6 lowercase hex digits
          expect(hex).toMatch(/^#[0-9a-f]{6}$/);

          // Should be lowercase
          expect(hex).toBe(hex.toLowerCase());

          // Should have exactly 7 characters (# + 6 hex digits)
          expect(hex.length).toBe(7);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Color Utility Edge Cases', () => {
  /**
   * Property: Blending identical colors
   *
   * Verifies that blending a color with itself always returns the same color,
   * regardless of blend factor.
   */
  it('blending identical colors returns the same color', () => {
    fc.assert(
      fc.property(hexString(), fc.double({ min: 0, max: 1 }), (hex, t) => {
        const color = `#${hex}` as HexColor;

        // Blending a color with itself should return the same color
        const result = blend(color, color, t);
        expect(result.toLowerCase()).toBe(color.toLowerCase());
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Blend commutativity at midpoint
   *
   * Verifies that blending A→B at 50% is the same as blending B→A at 50%.
   */
  it('blend is commutative at t=0.5', () => {
    fc.assert(
      fc.property(hexString(), hexString(), (hexA, hexB) => {
        const colorA = `#${hexA}` as HexColor;
        const colorB = `#${hexB}` as HexColor;

        // Blend A→B at 50% should equal B→A at 50%
        const resultAB = blend(colorA, colorB, 0.5);
        const resultBA = blend(colorB, colorA, 0.5);

        expect(resultAB).toBe(resultBA);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: RGB clamping handles NaN
   *
   * Verifies that NaN values in RGB arrays are handled gracefully
   * by clamping to 0.
   */
  it('rgbToHex handles NaN by clamping to 0', () => {
    // Test with NaN in different positions
    expect(rgbToHex([NaN, 128, 64])).toBe('#008040');
    expect(rgbToHex([128, NaN, 64])).toBe('#800040');
    expect(rgbToHex([128, 64, NaN])).toBe('#804000');
    expect(rgbToHex([NaN, NaN, NaN])).toBe('#000000');
  });
});
