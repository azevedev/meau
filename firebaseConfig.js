import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB-BbsqpUx47yg11dKtFeMg838hQ_hC5nk",
  authDomain: "meau-428dd.firebaseapp.com",
  projectId: "meau-428dd",
  storageBucket: "meau-428dd.firebasestorage.app",
  messagingSenderId: "396554394642",
  appId: "1:396554394642:web:3337c84c8dd8f6aabb4ccb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
