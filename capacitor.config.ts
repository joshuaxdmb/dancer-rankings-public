import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.latindancers.app',
  appName: 'latindancersapp',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
