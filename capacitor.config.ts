import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.latindancersapp.app',
  appName: 'latindancersapp',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
