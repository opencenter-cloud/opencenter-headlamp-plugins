import type { AppTheme } from '@kinvolk/headlamp-plugin/lib/lib/AppTheme';
import { mutedFromTokens, selectedBackgroundFromTokens } from './color';

const tokens = {
  base: 'light' as const,
  backgroundDefault: '#F3F3F3' as `#${string}`,
  surface: '#FFFFFF' as `#${string}`,
  primary: '#C8102E' as `#${string}`,
  secondary: '#3A4A63' as `#${string}`,
  textPrimary: '#1A1A1A' as `#${string}`,
  textSecondary: '#4D4D4D' as `#${string}`,
};

export const OpenCenterCloudDay: AppTheme = {
  name: 'Light',
  base: 'light',

  primary: tokens.primary,
  secondary: tokens.secondary,

  background: {
    default: tokens.backgroundDefault,
    surface: tokens.surface,
    muted: mutedFromTokens({
      backgroundDefault: tokens.backgroundDefault,
      surface: tokens.surface,
      base: tokens.base,
    }) as `#${string}`,
  },

  text: {
    primary: tokens.textPrimary,
  },

  link: { color: tokens.primary },

  navbar: {
    background: '#F4F7FC' as `#${string}`,
    color: '#0D1C3D' as `#${string}`,
  },

  sidebar: {
    background: '#F8FAFD' as `#${string}`,
    color: '#1E2F4F' as `#${string}`,
    selectedBackground: selectedBackgroundFromTokens({
      surface: tokens.surface,
      primary: tokens.primary,
      base: tokens.base,
    }) as `#${string}`,
    selectedColor: tokens.textPrimary,
    actionBackground: tokens.primary,
  },

  radius: 10,
  buttonTextTransform: 'none',
};
