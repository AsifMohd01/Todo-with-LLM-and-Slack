const { admin } = require("../config/db")

const validateFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" })
  }

  const token = authHeader.split("Bearer ")[1]

  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error("Error verifying token:", error)
    return res.status(401).json({ error: "Unauthorized - Invalid token" })
  }
}

module.exports = { validateFirebaseToken }
