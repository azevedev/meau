import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB-BbsqpUx47yg11dKtFeMg838hQ_hC5nk',
  authDomain: 'meau-428dd.firebaseapp.com',
  databaseURL: 'https://meau-428dd.firebaseio.com',
  projectId: 'meau-428dd',
  storageBucket: 'meau-428dd.appspot.com',
  appId: '428dd',
};

const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);


