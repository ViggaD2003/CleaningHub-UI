import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyB0vomVGoXf8ruta4koj2cZtUhs3uBH9J0",
  authDomain: "cleaning-hub-c07b5.firebaseapp.com",
  projectId: "cleaning-hub-c07b5",
  storageBucket: "cleaning-hub-c07b5.appspot.com",
  messagingSenderId: "653762912497",
  appId: "1:653762912497:web:bc64a29c181c92c5c0c950",
  measurementId: "G-9P5DKM4ZL4"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app); 
