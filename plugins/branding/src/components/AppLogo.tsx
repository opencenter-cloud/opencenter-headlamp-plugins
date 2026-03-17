import React from 'react';
import { Box } from '@mui/material';
import type { AppLogoProps } from '@kinvolk/headlamp-plugin/lib';
import logoLight from '../../assets/logo.png';
import logoDark from '../../assets/logo_dark.png';

function isDarkTheme(themeName = ''): boolean {
  const normalized = themeName.trim().toLowerCase();

  // Follow Headlamp built-in theme naming first.
  if (normalized === 'dark') {
    return true;
  }
  if (normalized === 'light') {
    return false;
  }

  // Fallback for custom names.
  if (normalized.includes('dark') || normalized.includes('night')) {
    return true;
  }

  // Final fallback: user's system preference.
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
}

const AppLogo: React.FC<AppLogoProps> = ({
  logoType = 'large',
  themeName = '',
  className,
  sx,
}) => {
  const isDark = isDarkTheme(themeName);
  const logoSrc = isDark ? logoDark : logoLight;
  const logoHeight = logoType === 'small' ? 26 : 32;
  const textSize = logoType === 'small' ? '1.2rem' : '1.55rem';
  const textColor = isDark ? '#F5F8FF' : '#0D1C3D';

  return (
    <Box
      className={className}
      sx={[
        {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.1,
          lineHeight: 1,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        component="img"
        src={logoSrc}
        alt="OpenCenter"
        sx={{
          height: `${logoHeight}px`,
          maxHeight: `${logoHeight}px`,
          width: 'auto',
          display: 'block',
        }}
      />
      <Box
        component="span"
        sx={{
          fontSize: textSize,
          fontWeight: 700,
          letterSpacing: '0.02em',
          color: textColor,
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
        }}
      >
        openCenter
      </Box>
    </Box>
  );
};

export default AppLogo;
