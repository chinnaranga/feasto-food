import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 Protected route
router.get("/", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "This is a protected route",
    userId: req.user.id
  });
});

export default router;
