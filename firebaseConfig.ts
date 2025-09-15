import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const requiredEnv = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

console.log('checking env');
console.log(process.env);
for (const key of requiredEnv) {
    console.log(key);
console.log(process.env);
console.log('checking env');
  if (!process.env[key]) {
    // In development, fail fast to surface missing configuration
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string,
  // Optional values
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);


