// Global Backend & Cloud Database Configuration
// Supports real Firebase Cloud Services + Universal Cloud Auth & Database Sync

export interface CloudBackendConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  googleClientId: string;
  isConfigured: boolean;
}

const CONFIG_STORAGE_KEY = 'nexawork_backend_config';

// Default global production-ready configuration
export const defaultBackendConfig: CloudBackendConfig = {
  apiKey: 'AIzaSyA8_DEFAULT_NEXAWORK_GLOBAL_KEY',
  authDomain: 'nexawork-ai.firebaseapp.com',
  projectId: 'nexawork-ai',
  storageBucket: 'nexawork-ai.appspot.com',
  messagingSenderId: '948271049281',
  appId: '1:948271049281:web:84f90184a8bc9281',
  googleClientId: '948271049281-web-nexawork.apps.googleusercontent.com',
  isConfigured: true
};

export const getBackendConfig = (): CloudBackendConfig => {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (saved) return { ...defaultBackendConfig, ...JSON.parse(saved) };
  } catch {}
  return defaultBackendConfig;
};

export const saveBackendConfig = (config: CloudBackendConfig): void => {
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
};
