import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const requiredEnv = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_APP_ID',
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    // In development, fail fast to surface missing configuration
    throw new Error(`Missing environment variable: ${key}`);
  }
}

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY as string,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string,
  appId: process.env.FIREBASE_APP_ID as string,
  // Optional values
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);


