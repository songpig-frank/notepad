
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if configuration is loaded
if (!firebaseConfig.apiKey) {
  console.error("Firebase configuration is missing. Please check your environment variables in Secrets.");
}

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  console.log("Firebase connection successful!");
  
  // Test write to Firestore
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
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}
