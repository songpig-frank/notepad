
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey) {
  console.error("Firebase configuration is missing. Please check your environment variables in Secrets.");
}

let db;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase connection successful!");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

const testConnection = async () => {
  try {
    const testCollection = collection(db, 'test');
    await addDoc(testCollection, {
      test: true,
      timestamp: new Date()
    });
    console.log("Successfully wrote to Firestore!");
  } catch (error) {
    console.error("Error writing to Firestore:", error);
  }
};

testConnection();

export { db };
