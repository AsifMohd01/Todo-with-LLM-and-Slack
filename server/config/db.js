const admin = require("firebase-admin")
const dotenv = require("dotenv")
const fs = require("fs")
const path = require("path")

dotenv.config()

// Initialize Firebase Admin
const initializeFirebase = () => {
  try {
    // Check if the service account is provided as an environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        })
        console.log("Firebase initialized successfully with environment variable")
        return admin.firestore()
      } catch (parseError) {
        console.error("Error parsing FIREBASE_SERVICE_ACCOUNT environment variable:", parseError.message)

        // If it's a JSON parsing error, provide a helpful message
        if (parseError instanceof SyntaxError) {
          console.error("Make sure your FIREBASE_SERVICE_ACCOUNT is a valid JSON string")
          console.error('Example format: {"type":"service_account","project_id":"your-project-id",...}')
        }
      }
    }

    // Fallback to service account file if environment variable is not available
    const serviceAccountPath =
      process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, "../serviceAccountKey.json")

    if (fs.existsSync(serviceAccountPath)) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      })
      console.log(`Firebase initialized successfully with service account file: ${serviceAccountPath}`)
      return admin.firestore()
    }

    throw new Error(
      "Firebase service account not found. Please set FIREBASE_SERVICE_ACCOUNT environment variable " +
        "with a valid JSON string or place a serviceAccountKey.json file in the server directory.",
    )
  } catch (error) {
    console.error("Error initializing Firebase:", error.message)
    console.error("\nTo fix this issue:")
    console.error("1. Go to Firebase Console > Project Settings > Service accounts")
    console.error("2. Click 'Generate new private key'")
    console.error("3. Save the file as 'serviceAccountKey.json' in the server directory")
    console.error("   OR set the FIREBASE_SERVICE_ACCOUNT environment variable with the JSON content")
    console.error("\nExample .env format:")
    console.error('FIREBASE_SERVICE_ACCOUNT=\'{"type":"service_account","project_id":"your-project",...}\'')
    console.error("\nMake sure to escape quotes properly in your environment variable.")

    // Don't exit the process in development to allow for fixing without restarting
    if (process.env.NODE_ENV === "production") {
      process.exit(1)
    } else {
      console.error("Running in development mode without Firebase. Some features will not work.")
      // Return a mock db object for development
      return {
        collection: () => ({
          where: () => ({
            get: async () => ({ docs: [], forEach: () => {} }),
          }),
          add: async () => ({ id: "mock-id", get: async () => ({ data: () => ({}) }) }),
          doc: () => ({
            get: async () => ({ data: () => ({}) }),
            update: async () => ({}),
            delete: async () => ({}),
          }),
        }),
      }
    }
  }
}

// Initialize Firebase only once
let db
try {
  db = initializeFirebase()
} catch (error) {
  console.error("Failed to initialize Firebase:", error)
}

module.exports = { db, admin }
