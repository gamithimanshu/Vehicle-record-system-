import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyCO9zmyF70HZG5930jZ5i2DaH_g-zRxWD8',
  authDomain: 'vehicles-management-syst-86508.firebaseapp.com',
  projectId: 'vehicles-management-syst-86508',
  storageBucket: 'vehicles-management-syst-86508.firebasestorage.app',
  messagingSenderId: '310362287525',
  appId: '1:310362287525:web:d97d948b530e1bab204c4c',
  measurementId: 'G-GWP83FQ59E'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
