import type { AppTheme } from '@kinvolk/headlamp-plugin/lib/lib/AppTheme';
import { mutedFromTokens, selectedBackgroundFromTokens } from './color';

const tokens = {
  base: 'dark' as const,
  backgroundDefault: '#121824' as `#${string}`,
  surface: '#1E2A3C' as `#${string}`,
  primary: '#E63D4F' as `#${string}`,
  secondary: '#2A3750' as `#${string}`,
  textPrimary: '#E6EAF2' as `#${string}`,
  textSecondary: '#AAB4C8' as `#${string}`,
};

export const OpenCenterAbyssalNight: AppTheme = {
  name: 'Dark',
  base: 'dark',

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
    background: '#04173A' as `#${string}`,
    color: '#F5F8FF' as `#${string}`,
  },

  sidebar: {
    background: '#04173A' as `#${string}`,
    color: '#F5F8FF' as `#${string}`,
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
