/**
 * Integration test for plugin registration
 *
 * Property 1: Plugin Registration Completeness
 * Validates: Requirements 1.1, 2.1
 *
 * Tests that the plugin entry point correctly registers:
 * - Exactly one logo component via registerAppLogo
 * - Exactly two themes via registerAppTheme
 * - Correct components/themes passed to registration functions
 */

import { jest } from '@jest/globals';

// Mock the Headlamp plugin API before importing the plugin
const mockRegisterAppLogo = jest.fn();
const mockRegisterAppTheme = jest.fn();

jest.mock('@kinvolk/headlamp-plugin/lib', () => ({
  registerAppLogo: mockRegisterAppLogo,
  registerAppTheme: mockRegisterAppTheme,
}));

describe('Plugin Registration Integration', () => {
  beforeAll(async () => {
    // Import the plugin entry point once for all tests
    // This executes the registration code
    await import('../index');
  });

  it('registers logo component and themes when plugin loads', () => {
    // Verify registerAppLogo was called exactly once
    expect(mockRegisterAppLogo).toHaveBeenCalledTimes(1);

    // Verify registerAppTheme was called exactly twice
    expect(mockRegisterAppTheme).toHaveBeenCalledTimes(2);
  });

  it('registers AppLogo component with registerAppLogo', () => {
    // Verify the logo component was passed
    expect(mockRegisterAppLogo).toHaveBeenCalledWith(expect.any(Function));

    // Get the registered component
    const registeredComponent = mockRegisterAppLogo.mock.calls[0][0];

    // Verify it's a React component (has displayName or is a function)
    expect(typeof registeredComponent).toBe('function');
  });

  it('registers Light theme', () => {
    // Get all theme registration calls
    const themeCalls = mockRegisterAppTheme.mock.calls;

    // Find the Light theme
    const cloudDayTheme = themeCalls.find((call) => call[0]?.name === 'Light');

    expect(cloudDayTheme).toBeDefined();
    expect(cloudDayTheme?.[0]).toMatchObject({
      name: 'Light',
      base: 'light',
      primary: expect.any(String),
      secondary: expect.any(String),
    });
  });

  it('registers Dark theme', () => {
    // Get all theme registration calls
    const themeCalls = mockRegisterAppTheme.mock.calls;

    // Find the Dark theme
    const abyssalNightTheme = themeCalls.find(
      (call) => call[0]?.name === 'Dark'
    );

    expect(abyssalNightTheme).toBeDefined();
    expect(abyssalNightTheme?.[0]).toMatchObject({
      name: 'Dark',
      base: 'dark',
      primary: expect.any(String),
      secondary: expect.any(String),
    });
  });

  it('registers themes with complete token structure', () => {
    // Get all theme registration calls
    const themeCalls = mockRegisterAppTheme.mock.calls;

    // Verify both themes have complete structure
    themeCalls.forEach((call) => {
      const theme = call[0];

      // Verify required top-level tokens
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('base');
      expect(theme).toHaveProperty('primary');
      expect(theme).toHaveProperty('secondary');
      expect(theme).toHaveProperty('radius');

      // Verify background tokens
      expect(theme.background).toHaveProperty('default');
      expect(theme.background).toHaveProperty('surface');
      expect(theme.background).toHaveProperty('muted');

      // Verify text tokens
      expect(theme.text).toHaveProperty('primary');

      // Verify link tokens
      expect(theme.link).toHaveProperty('color');

      // Verify navbar tokens
      expect(theme.navbar).toHaveProperty('background');
      expect(theme.navbar).toHaveProperty('color');

      // Verify sidebar tokens
      expect(theme.sidebar).toHaveProperty('background');
      expect(theme.sidebar).toHaveProperty('color');
      expect(theme.sidebar).toHaveProperty('selectedBackground');
      expect(theme.sidebar).toHaveProperty('selectedColor');
      expect(theme.sidebar).toHaveProperty('actionBackground');
    });
  });

  it('registers exactly one light theme and one dark theme', () => {
    // Get all theme registration calls
    const themeCalls = mockRegisterAppTheme.mock.calls;

    // Count light and dark themes
    const lightThemes = themeCalls.filter((call) => call[0]?.base === 'light');
    const darkThemes = themeCalls.filter((call) => call[0]?.base === 'dark');

    expect(lightThemes).toHaveLength(1);
    expect(darkThemes).toHaveLength(1);
  });
});
