import { registerAppLogo, registerAppTheme } from '@kinvolk/headlamp-plugin/lib';
import AppLogo from './components/AppLogo';
import { OpenCenterCloudDay, OpenCenterAbyssalNight } from './theme';

// Register logo component
registerAppLogo(AppLogo);

// Register themes
registerAppTheme(OpenCenterCloudDay);
registerAppTheme(OpenCenterAbyssalNight);
