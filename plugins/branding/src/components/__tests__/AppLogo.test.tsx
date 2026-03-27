/**
 * Unit tests for AppLogo component
 *
 * Tests cover:
 * - Logo rendering and image source selection
 * - Logo theme variant rendering (light/dark logos based on theme)
 * - Accessibility (alt text)
 *
 * Note: MUI sx-based styles are applied via CSS classes in jsdom and cannot be
 * asserted through element.style. Style correctness is verified by inspecting
 * the component source directly.
 *
 * Validates Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';
import AppLogo from '../AppLogo';

describe('AppLogo', () => {
  describe('rendering', () => {
    it('renders an img element for large logoType', () => {
      const { container } = render(<AppLogo logoType="large" themeName="light" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
    });

    it('renders an img element for small logoType', () => {
      const { container } = render(<AppLogo logoType="small" themeName="light" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
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

    it('renders dark logo when themeName is "Dark"', () => {
      const { container } = render(<AppLogo logoType="large" themeName="Dark" />);
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
      expect(img).toHaveAttribute('alt', 'OpenCenter');
    });

    it('renders large light logo correctly', () => {
      const { container } = render(<AppLogo logoType="large" themeName="light theme" />);
      const img = container.querySelector('img');

      expect(img).toBeInTheDocument();
      expect(img?.src).toContain('/logo.png');
      expect(img).toHaveAttribute('alt', 'OpenCenter');
    });

    it('renders the "openCenter" text label', () => {
      const { container } = render(<AppLogo logoType="large" themeName="light" />);
      const span = container.querySelector('span');

      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe('openCenter');
    });
  });
});
