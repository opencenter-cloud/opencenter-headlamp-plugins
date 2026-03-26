/**
 * Unit tests for color utility functions
 *
 * Tests cover:
 * - hexToRgb: valid inputs and error handling
 * - rgbToHex: valid inputs and clamping
 * - blend: boundary conditions (t=0, t=1, t=0.5)
 * - mutedFromTokens: light and dark theme calculations
 * - selectedBackgroundFromTokens: light and dark theme calculations
 *
 * Validates Requirements: 3.3, 3.4, 3.5, 3.6, 15.1, 15.2
 */

import {
  blend,
  type HexColor,
  hexToRgb,
  mutedFromTokens,
  rgbToHex,
  selectedBackgroundFromTokens,
} from '../color';

describe('hexToRgb', () => {
  describe('valid inputs', () => {
    it('converts #FF0000 to [255, 0, 0]', () => {
      expect(hexToRgb('#FF0000')).toEqual([255, 0, 0]);
    });

    it('converts #00FF00 to [0, 255, 0]', () => {
      expect(hexToRgb('#00FF00')).toEqual([0, 255, 0]);
    });

    it('converts #0000FF to [0, 0, 255]', () => {
      expect(hexToRgb('#0000FF')).toEqual([0, 0, 255]);
    });

    it('converts #C8102E to [200, 16, 46]', () => {
      expect(hexToRgb('#C8102E')).toEqual([200, 16, 46]);
    });

    it('converts #FFFFFF to [255, 255, 255]', () => {
      expect(hexToRgb('#FFFFFF')).toEqual([255, 255, 255]);
    });

    it('converts #000000 to [0, 0, 0]', () => {
      expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
    });

    it('handles lowercase hex colors', () => {
      expect(hexToRgb('#ff0000' as HexColor)).toEqual([255, 0, 0]);
    });

    it('handles mixed case hex colors', () => {
      expect(hexToRgb('#FfAa00' as HexColor)).toEqual([255, 170, 0]);
    });
  });

  describe('error handling', () => {
    it('throws error for invalid format (too short)', () => {
      expect(() => hexToRgb('#FFF' as HexColor)).toThrow('Invalid hex color');
    });

    it('throws error for invalid format (too long)', () => {
      expect(() => hexToRgb('#FF00000' as HexColor)).toThrow('Invalid hex color');
    });

    it('throws error for invalid format (no hash)', () => {
      expect(() => hexToRgb('FF0000' as HexColor)).toThrow('Invalid hex color');
    });

    it('throws error for empty string', () => {
      expect(() => hexToRgb('#' as HexColor)).toThrow('Invalid hex color');
    });
  });
});

describe('rgbToHex', () => {
  describe('valid inputs', () => {
    it('converts [255, 0, 0] to #ff0000', () => {
      expect(rgbToHex([255, 0, 0])).toBe('#ff0000');
    });

    it('converts [0, 255, 0] to #00ff00', () => {
      expect(rgbToHex([0, 255, 0])).toBe('#00ff00');
    });

    it('converts [0, 0, 255] to #0000ff', () => {
      expect(rgbToHex([0, 0, 255])).toBe('#0000ff');
    });

    it('converts [200, 16, 46] to #c8102e', () => {
      expect(rgbToHex([200, 16, 46])).toBe('#c8102e');
    });

    it('converts [255, 255, 255] to #ffffff', () => {
      expect(rgbToHex([255, 255, 255])).toBe('#ffffff');
    });

    it('converts [0, 0, 0] to #000000', () => {
      expect(rgbToHex([0, 0, 0])).toBe('#000000');
    });

    it('pads single digit hex values with zero', () => {
      expect(rgbToHex([1, 2, 3])).toBe('#010203');
    });
  });

  describe('clamping out-of-range values', () => {
    it('clamps values above 255', () => {
      expect(rgbToHex([300, 0, 0])).toBe('#ff0000');
    });

    it('clamps values below 0', () => {
      expect(rgbToHex([-10, 0, 0])).toBe('#000000');
    });

    it('clamps multiple out-of-range values', () => {
      expect(rgbToHex([300, -10, 128])).toBe('#ff0080');
    });

    it('rounds decimal values', () => {
      expect(rgbToHex([255.7, 128.3, 64.5])).toBe('#ff8041');
    });

    it('handles NaN by clamping to 0', () => {
      expect(rgbToHex([NaN, 128, 64])).toBe('#008040');
    });
  });
});

describe('blend', () => {
  describe('boundary conditions', () => {
    it('returns first color when t=0', () => {
      expect(blend('#FF0000', '#0000FF', 0)).toBe('#ff0000');
    });

    it('returns second color when t=1', () => {
      expect(blend('#FF0000', '#0000FF', 1)).toBe('#0000ff');
    });

    it('blends to midpoint when t=0.5', () => {
      expect(blend('#FF0000', '#0000FF', 0.5)).toBe('#800080');
    });
  });

  describe('intermediate blending', () => {
    it('blends 25% toward second color', () => {
      // #FF0000 + 25% toward #0000FF
      // R: 255 + (0 - 255) * 0.25 = 191.25 ≈ 191 = 0xBF
      // G: 0 + (0 - 0) * 0.25 = 0
      // B: 0 + (255 - 0) * 0.25 = 63.75 ≈ 64 = 0x40
      expect(blend('#FF0000', '#0000FF', 0.25)).toBe('#bf0040');
    });

    it('blends 75% toward second color', () => {
      // #FF0000 + 75% toward #0000FF
      // R: 255 + (0 - 255) * 0.75 = 63.75 ≈ 64 = 0x40
      // G: 0 + (0 - 0) * 0.75 = 0
      // B: 0 + (255 - 0) * 0.75 = 191.25 ≈ 191 = 0xBF
      expect(blend('#FF0000', '#0000FF', 0.75)).toBe('#4000bf');
    });

    it('blends white toward red by 10%', () => {
      // #FFFFFF + 10% toward #C8102E
      // R: 255 + (200 - 255) * 0.10 = 249.5 ≈ 250 = 0xFA
      // G: 255 + (16 - 255) * 0.10 = 231.1 ≈ 231 = 0xE7
      // B: 255 + (46 - 255) * 0.10 = 234.1 ≈ 234 = 0xEA
      expect(blend('#FFFFFF', '#C8102E', 0.1)).toBe('#fae7ea');
    });
  });

  describe('edge cases', () => {
    it('clamps t values below 0 to 0', () => {
      expect(blend('#FF0000', '#0000FF', -0.5)).toBe('#ff0000');
    });

    it('clamps t values above 1 to 1', () => {
      expect(blend('#FF0000', '#0000FF', 1.5)).toBe('#0000ff');
    });

    it('handles identical colors', () => {
      expect(blend('#FF0000', '#FF0000', 0.5)).toBe('#ff0000');
    });

    it('handles black to white blend', () => {
      expect(blend('#000000', '#FFFFFF', 0.5)).toBe('#808080');
    });
  });
});

describe('mutedFromTokens', () => {
  describe('light theme', () => {
    it('generates correct muted color for light theme', () => {
      const result = mutedFromTokens({
        backgroundDefault: '#F3F3F3',
        surface: '#FFFFFF',
        base: 'light',
      });

      // Expected: blend(#F3F3F3, #FFFFFF, 0.06)
      // R: 243 + (255 - 243) * 0.06 = 243.72 ≈ 244 = 0xF4
      // G: 243 + (255 - 243) * 0.06 = 243.72 ≈ 244 = 0xF4
      // B: 243 + (255 - 243) * 0.06 = 243.72 ≈ 244 = 0xF4
      expect(result).toBe('#f4f4f4');
    });

    it('uses 6% blend factor for light theme', () => {
      const result = mutedFromTokens({
        backgroundDefault: '#000000',
        surface: '#FFFFFF',
        base: 'light',
      });

      // Expected: blend(#000000, #FFFFFF, 0.06)
      // R: 0 + (255 - 0) * 0.06 = 15.3 ≈ 15 = 0x0F
      // G: 0 + (255 - 0) * 0.06 = 15.3 ≈ 15 = 0x0F
      // B: 0 + (255 - 0) * 0.06 = 15.3 ≈ 15 = 0x0F
      expect(result).toBe('#0f0f0f');
    });
  });

  describe('dark theme', () => {
    it('generates correct muted color for dark theme', () => {
      const result = mutedFromTokens({
        backgroundDefault: '#121824',
        surface: '#1E2A3C',
        base: 'dark',
      });

      // Expected: blend(#121824, #1E2A3C, 0.12)
      // R: 18 + (30 - 18) * 0.12 = 19.44 ≈ 19 = 0x13
      // G: 24 + (42 - 24) * 0.12 = 26.16 ≈ 26 = 0x1A
      // B: 36 + (60 - 36) * 0.12 = 38.88 ≈ 39 = 0x27
      expect(result).toBe('#131a27');
    });

    it('uses 12% blend factor for dark theme', () => {
      const result = mutedFromTokens({
        backgroundDefault: '#000000',
        surface: '#FFFFFF',
        base: 'dark',
      });

      // Expected: blend(#000000, #FFFFFF, 0.12)
      // R: 0 + (255 - 0) * 0.12 = 30.6 ≈ 31 = 0x1F
      // G: 0 + (255 - 0) * 0.12 = 30.6 ≈ 31 = 0x1F
      // B: 0 + (255 - 0) * 0.12 = 30.6 ≈ 31 = 0x1F
      expect(result).toBe('#1f1f1f');
    });
  });
});

describe('selectedBackgroundFromTokens', () => {
  describe('light theme', () => {
    it('generates correct selected background for light theme', () => {
      const result = selectedBackgroundFromTokens({
        surface: '#FFFFFF',
        primary: '#C8102E',
        base: 'light',
      });

      // Expected: blend(#FFFFFF, #C8102E, 0.10)
      // R: 255 + (200 - 255) * 0.10 = 249.5 ≈ 250 = 0xFA
      // G: 255 + (16 - 255) * 0.10 = 231.1 ≈ 231 = 0xE7
      // B: 255 + (46 - 255) * 0.10 = 234.1 ≈ 234 = 0xEA
      expect(result).toBe('#fae7ea');
    });

    it('uses 10% blend factor for light theme', () => {
      const result = selectedBackgroundFromTokens({
        surface: '#FFFFFF',
        primary: '#FF0000',
        base: 'light',
      });

      // Expected: blend(#FFFFFF, #FF0000, 0.10)
      // R: 255 + (255 - 255) * 0.10 = 255 = 0xFF
      // G: 255 + (0 - 255) * 0.10 = 229.5 ≈ 230 = 0xE6
      // B: 255 + (0 - 255) * 0.10 = 229.5 ≈ 230 = 0xE6
      expect(result).toBe('#ffe6e6');
    });
  });

  describe('dark theme', () => {
    it('generates correct selected background for dark theme', () => {
      const result = selectedBackgroundFromTokens({
        surface: '#1E2A3C',
        primary: '#E63D4F',
        base: 'dark',
      });

      // Expected: blend(#1E2A3C, #E63D4F, 0.16)
      // R: 30 + (230 - 30) * 0.16 = 62 = 0x3E
      // G: 42 + (61 - 42) * 0.16 = 45.04 ≈ 45 = 0x2D
      // B: 60 + (79 - 60) * 0.16 = 63.04 ≈ 63 = 0x3F
      expect(result).toBe('#3e2d3f');
    });

    it('uses 16% blend factor for dark theme', () => {
      const result = selectedBackgroundFromTokens({
        surface: '#000000',
        primary: '#FF0000',
        base: 'dark',
      });

      // Expected: blend(#000000, #FF0000, 0.16)
      // R: 0 + (255 - 0) * 0.16 = 40.8 ≈ 41 = 0x29
      // G: 0 + (0 - 0) * 0.16 = 0 = 0x00
      // B: 0 + (0 - 0) * 0.16 = 0 = 0x00
      expect(result).toBe('#290000');
    });
  });
});
