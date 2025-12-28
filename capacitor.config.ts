import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.medscanx.app',
  appName: 'MedScanX',
  webDir: 'out',
  server: {
    url: 'https://medscanx.vercel.app/',
    cleartext: true,
    allowNavigation: ['medscanx.vercel.app']
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#020617",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#06b6d4",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
