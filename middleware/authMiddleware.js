import admin from "firebase-admin";

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "AUTH_REQUIRED" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}

// Optional Auth - Pass if no token (Guest), Verify if token exists
export async function verifyTokenOptional(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null; // Guest
    return next(); // Proceed
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.warn("Optional Auth verification failed, treating as Guest:", error.message);
    req.user = null; // Treat invalid token as guest rather than blocking? Or block?
    // Safer to block if token IS provided but invalid.
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}
