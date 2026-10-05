import User from '../models/User.js';
import DeviceOTP from '../models/DeviceOTP.js';
import bcrypt from 'bcryptjs'; // Ensure correct import
import jwt from 'jsonwebtoken';
import { auth as firebaseAuth } from '../config/firebase.js';
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { sendDeviceOTPEmail, sendNewDeviceAlertEmail, sendEmail } from '../utils/email.js';
import { detectSuspiciousLogin } from '../utils/security.js';
import LoginLog from '../models/LoginLog.js';
import { emitSecurityAlert } from '../sockets/socketManager.js';

// Helper to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Firebase to JWT Token Exchange
 * Converts Firebase ID token to application JWT with roles/scopes
 */
export const loginWithOTP = async (req, res) => {
  try {
    // 1. Extract Token from Header (Preferred) or Body
    let firebaseToken = req.body.firebaseToken;
    const deviceInfo = req.body.deviceInfo; // Expected object with deviceId, deviceName, browser, etc.
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      firebaseToken = authHeader.split(" ")[1];
    }

    if (!firebaseToken) {
      return res.status(401).json({ error: "No token provided" }); // 401 for Auth missing
    }

    // 2. Verify with Firebase Admin
    const decoded = await firebaseAuth.verifyIdToken(firebaseToken);
    const uid = decoded.uid;

    // 3. Sync User to MongoDB
    let user = await User.findOne({ uid });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        uid,
        email: decoded.email,
        displayName: decoded.name || decoded.email?.split('@')[0] || "User",
        photoURL: decoded.picture,
        role: decoded.admin ? 'admin' : 'user',
        devices: [] // Initialize empty device array
      });
      console.log(`Created new MongoDB user for UID: ${uid}`);
    }

    // --- NEW: Device Recognition & Suspicious Logic ---
    if (deviceInfo && deviceInfo.deviceId) {
      const existingDeviceIndex = user.devices.findIndex(d => d.deviceId === deviceInfo.deviceId);
      const isNewDevice = existingDeviceIndex === -1;

      let isSuspicious = false;
      try {
        isSuspicious = await detectSuspiciousLogin(user, deviceInfo);
      } catch (err) {
        console.error("Error detecting suspicious login:", err);
      }

      if (isNewDevice || !user.devices[existingDeviceIndex].trusted || isSuspicious) {
        // Untrusted / New Device / Suspicious Flow: Generate OTP and halt login
        const otp = generateOTP();

        // Remove old OTPs for this device
        await DeviceOTP.deleteMany({ userId: user._id, deviceId: deviceInfo.deviceId });

        // Save new OTP
        await DeviceOTP.create({
          userId: user._id,
          deviceId: deviceInfo.deviceId,
          otp: otp
        });

        // Add the device to user profile as untrusted if it's completely new
        if (isNewDevice) {
          user.devices.push({
            deviceId: deviceInfo.deviceId,
            deviceName: deviceInfo.deviceName,
            browser: deviceInfo.browser,
            operatingSystem: deviceInfo.os || deviceInfo.operatingSystem,
            ipAddress: deviceInfo.ipAddress,
            location: deviceInfo.location,
            firstLoginAt: new Date(),
            lastLoginAt: new Date(),
            trusted: false,
            suspicious: isSuspicious
          });
          await user.save();
        } else if (isSuspicious) {
          user.devices[existingDeviceIndex].suspicious = true;
          await user.save();
        }

        // Emit Alert
        if (isSuspicious || isNewDevice) {
          emitSecurityAlert({
            type: isSuspicious ? "suspicious_login" : "new_device",
            user: { _id: user._id, email: user.email },
            device: deviceInfo,
            timestamp: new Date(),
            otp: otp
          });
        }

        // Send Email
        if (user.email) {
          if (isSuspicious) {
            const subject = "Security Alert: Suspicious Login Detected";
            const html = `<p>We detected a suspicious login attempt to your Flavor account.</p>
                            <p>Device: ${deviceInfo.deviceName}</p>
                            <p>IP: ${deviceInfo.ipAddress}</p>
                            <p>Please use this OTP to verify your identity: <strong>${otp}</strong></p>`;
            await sendEmail(user.email, subject, html);
            if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
              console.warn(`[MOCK EMAIL SUSPICIOUS] OTP is: ${otp}`);
            }
          } else {
            await sendDeviceOTPEmail(user.email, otp, deviceInfo);
          }
        }

        // Log this attempt
        await LoginLog.create({
          userId: user._id,
          deviceId: deviceInfo.deviceId,
          ipAddress: deviceInfo.ipAddress || 'Unknown',
          location: deviceInfo.location || 'Unknown',
          loginStatus: 'pending_otp',
          suspicious: isSuspicious
        });

        // Interrupt standard login, return `requireDeviceOTP` flag
        return res.status(200).json({
          requireDeviceOTP: true,
          deviceId: deviceInfo.deviceId,
          message: isSuspicious ? "Suspicious login detected. OTP sent." : "Unrecognized device. Please enter the OTP sent to your email to continue."
        });
      } else {
        // Trusted Device Flow: Update last login stats
        user.devices[existingDeviceIndex].lastLoginAt = new Date();
        user.devices[existingDeviceIndex].lastLogin = new Date(); // legacy
        user.devices[existingDeviceIndex].ipAddress = deviceInfo.ipAddress;
        user.devices[existingDeviceIndex].location = deviceInfo.location;
        await user.save();

        // Log success
        await LoginLog.create({
          userId: user._id,
          deviceId: deviceInfo.deviceId,
          ipAddress: deviceInfo.ipAddress || 'Unknown',
          location: deviceInfo.location || 'Unknown',
          loginStatus: 'success',
          suspicious: false
        });
      }
    } else {
      // Log success without device info
      await LoginLog.create({
        userId: user._id,
        deviceId: 'unknown',
        loginStatus: 'success',
        suspicious: false
      });
    }
    // --- END: Device Recognition & Suspicious Logic ---

    // 4. Generate application JWTs
    const payload = {
      uid: user.uid,
      role: user.role,
      _id: user._id
    };

    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);

    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      secure: true, // Use secure cookies in production
      sameSite: "strict"
    });

    res.json({ accessToken: access });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * Verify Device OTP and complete login process
 */
export const verifyDeviceOTP = async (req, res) => {
  try {
    const { firebaseToken, deviceId, otp, deviceInfo } = req.body;

    console.log("verifyDeviceOTP incoming body:", JSON.stringify(req.body));

    if (!deviceId) {
      return res.status(400).json({ error: "Device ID required" });
    }

    if (!firebaseToken || !otp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Verify Firebase user
    const decoded = await firebaseAuth.verifyIdToken(firebaseToken);
    const user = await User.findOne({ uid: decoded.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2. Validate OTP
    const deviceOtpRecord = await DeviceOTP.findOne({
      userId: user._id,
      deviceId: deviceId,
      otp: otp
    });

    if (!deviceOtpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // 3. Mark device as trusted
    const deviceIndex = user.devices.findIndex(d => d.deviceId === deviceId);
    if (deviceIndex > -1) {
      user.devices[deviceIndex].trusted = true;
      user.devices[deviceIndex].lastLogin = new Date();
      if (deviceInfo) {
        user.devices[deviceIndex].ipAddress = deviceInfo.ipAddress;
        user.devices[deviceIndex].location = deviceInfo.location;
      }
      await user.save();
    }

    // 4. Send "New Device Authorized" security email
    if (user.email) {
      await sendNewDeviceAlertEmail(user.email, user.devices[deviceIndex]);
    }

    // 5. Cleanup OTP
    await DeviceOTP.deleteOne({ _id: deviceOtpRecord._id });

    // 6. Generate and send JWTs
    const payload = {
      uid: user.uid,
      role: user.role,
      _id: user._id
    };

    const access = signAccessToken(payload);
    const refresh = signRefreshToken(payload);

    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    res.json({ accessToken: access, message: "Device verified successfully" });
  } catch (error) {
    console.error("Verify Device Error:", error);
    res.status(500).json({ error: "Failed to verify device" });
  }
};

export const signup = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'User created', userId: user._id, token });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};