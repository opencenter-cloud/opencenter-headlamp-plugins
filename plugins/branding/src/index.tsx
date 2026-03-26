import { registerAppLogo, registerAppTheme } from '@kinvolk/headlamp-plugin/lib';
import AppLogo from './components/AppLogo';
import { OpenCenterAbyssalNight,OpenCenterCloudDay } from './theme';

// Register logo component
registerAppLogo(AppLogo);

// Register themes
registerAppTheme(OpenCenterCloudDay);
registerAppTheme(OpenCenterAbyssalNight);
