/**
 * Unit tests for AppLogo component
 *
 * Tests cover:
 * - Logo size rendering (large for expanded sidebar, small for collapsed)
 * - Logo theme variant rendering (light/dark logos based on theme)
 * - Layout constraints (max-height, padding)
 * - Accessibility (alt text)
 *
 * Validates Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppLogo from '../AppLogo';

describe('AppLogo', () => {
  describe('size rendering', () => {
    it('renders large logo for expanded sidebar (logoType="large")', () => {
      const { container } = render(<AppLogo logoType="large" themeName="light" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.style.maxHeight).toBe('48px');
    });

    it('renders small logo for collapsed sidebar (logoType="small")', () => {
      const { container } = render(<AppLogo logoType="small" themeName="light" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.style.maxHeight).toBe('32px');
    });
  });

  describe('theme variant rendering', () => {
    it('renders light logo for light themes', () => {
      const { container } = render(<AppLogo logoType="large" themeName="Light" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.src).toContain('/logo.png');
    });

    it('renders dark logo when themeName contains "dark"', () => {
      const { container } = render(
        <AppLogo logoType="large" themeName="OpenCenter Abyssal Dark" />
      );
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.src).toContain('/logo_dark.png');
    });

    it('renders dark logo when themeName contains "night"', () => {
      const { container } = render(
        <AppLogo logoType="large" themeName="Dark" />
      );
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.src).toContain('/logo_dark.png');
    });

    it('renders dark logo when themeName contains "DARK" (case insensitive)', () => {
      const { container } = render(<AppLogo logoType="large" themeName="DARK Theme" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.src).toContain('/logo_dark.png');
    });

    it('renders dark logo when themeName contains "NIGHT" (case insensitive)', () => {
      const { container } = render(<AppLogo logoType="large" themeName="NIGHT Mode" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.src).toContain('/logo_dark.png');
    });

    it('renders light logo for themes without "dark" or "night"', () => {
      const { container } = render(<AppLogo logoType="large" themeName="Custom Light Theme" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.src).toContain('/logo.png');
    });
  });

  describe('layout constraints', () => {
    it('applies correct max-height for small size (32px)', () => {
      const { container } = render(<AppLogo logoType="small" themeName="light" />);
      const img = container.querySelector('img');

      expect(img?.style.maxHeight).toBe('32px');
    });

    it('applies correct max-height for large size (48px)', () => {
      const { container } = render(<AppLogo logoType="large" themeName="light" />);
      const img = container.querySelector('img');

      expect(img?.style.maxHeight).toBe('48px');
    });

    it('applies consistent padding (8px)', () => {
      const { container } = render(<AppLogo logoType="large" themeName="light" />);
      const img = container.querySelector('img');

      expect(img?.style.padding).toBe('8px');
    });

    it('applies consistent padding for small size', () => {
      const { container } = render(<AppLogo logoType="small" themeName="light" />);
      const img = container.querySelector('img');

      expect(img?.style.padding).toBe('8px');
    });

    it('sets width to auto', () => {
      const { container } = render(<AppLogo logoType="large" themeName="light" />);
      const img = container.querySelector('img');

      expect(img?.style.width).toBe('auto');
    });
  });

  describe('accessibility', () => {
    it('has alt text "OpenCenter"', () => {
      const { container } = render(<AppLogo logoType="large" themeName="light" />);
      const img = container.querySelector('img');

      expect(img).toHaveAttribute('alt', 'OpenCenter');
    });

    it('has alt text for small logo', () => {
      const { container } = render(<AppLogo logoType="small" themeName="dark" />);
      const img = container.querySelector('img');

      expect(img).toHaveAttribute('alt', 'OpenCenter');
    });

    it('has alt text for dark logo', () => {
      const { container } = render(<AppLogo logoType="large" themeName="dark" />);
      const img = container.querySelector('img');

      expect(img).toHaveAttribute('alt', 'OpenCenter');
    });
  });

  describe('combined scenarios', () => {
    it('renders small dark logo correctly', () => {
      const { container } = render(<AppLogo logoType="small" themeName="dark theme" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.src).toContain('/logo_dark.png');
      expect(img?.style.maxHeight).toBe('32px');
      expect(img?.style.padding).toBe('8px');
      expect(img).toHaveAttribute('alt', 'OpenCenter');
    });

    it('renders large light logo correctly', () => {
      const { container } = render(<AppLogo logoType="large" themeName="light theme" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.src).toContain('/logo.png');
      expect(img?.style.maxHeight).toBe('48px');
      expect(img?.style.padding).toBe('8px');
      expect(img).toHaveAttribute('alt', 'OpenCenter');
    });
  });
});
