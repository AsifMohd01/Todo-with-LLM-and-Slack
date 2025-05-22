import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Check if all required Firebase config variables are present
const checkFirebaseConfig = () => {
  const requiredVars = ["VITE_FIREBASE_API_KEY", "VITE_FIREBASE_AUTH_DOMAIN", "VITE_FIREBASE_PROJECT_ID"]

  const missingVars = requiredVars.filter((varName) => !import.meta.env[varName])

  if (missingVars.length > 0) {
    console.error(`Missing required Firebase configuration: ${missingVars.join(", ")}`)
    console.error("Please check your .env file and make sure all Firebase variables are set")
    return false
  }

  return true
}

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app, db

try {
  if (checkFirebaseConfig()) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
  } else {
    throw new Error("Invalid Firebase configuration")
  }
} catch (error) {
  console.error("Error initializing Firebase:", error)

  // Create mock objects for development
  if (import.meta.env.DEV) {
    console.warn("Using mock Firebase objects for development")
    app = {}
    db = {
      collection: () => ({
        where: () => ({
          get: async () => ({ docs: [], forEach: () => {} }),
        }),
        add: async () => ({ id: "mock-id" }),
        doc: () => ({
          get: async () => ({ data: () => ({}) }),
          update: async () => ({}),
          delete: async () => ({}),
        }),
      }),
    }
  }
}

export { app, db }
