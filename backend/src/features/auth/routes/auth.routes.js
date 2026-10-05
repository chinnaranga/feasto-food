import express from "express";
import { signup, login, loginWithOTP, verifyDeviceOTP } from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

//Apply strict rate limiting to all auth routes
router.use(authLimiter);

// Firebase to JWT token exchange (OTP Login)
router.post("/exchange", loginWithOTP);

// Verify Device OTP
router.post("/verify-device", verifyDeviceOTP);


router.post("/refresh", (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        const payload = verifyRefreshToken(token);

        const access = signAccessToken(payload);
        const refresh = signRefreshToken(payload);

        res.cookie("refreshToken", refresh, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        res.json({ accessToken: access });
    } catch {
        res.sendStatus(403);
    }
});

router.post("/signup", signup);
router.post("/login", login);

export default router;
