import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: 465, // Force 465 to prevent mismatch with secure: true if env has 587
    secure: true, // true for 465 (Implicit TLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        // Prevent strict TLS certificate issues on Railway
        rejectUnauthorized: false
    }
});

/**
 * Send an email using nodemailer
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML format)
 */
export const sendEmail = async (to, subject, html) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn("SMTP credentials not provided in environment variables. Email will mock-send.");
            return true;
        }

        const info = await transporter.sendMail({
            from: `"Flavor Security" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("🔥 Error sending email. Please check your SMTP settings!");
        console.error("SMTP Error Details:", error.message);
        return false;
    }
};

/**
 * Send an OTP for new device verification
 */
export const sendDeviceOTPEmail = async (email, otp, deviceInfo) => {
    // ALWAYS log the OTP to the backend console so the admin can bypass if email fails
    console.log(`\n🔑 [OTP GENERATED] User: ${email} | Device: ${deviceInfo?.deviceName || 'Unknown'} | OTP: ${otp}\n`);

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("[MOCK EMAIL] SMTP credentials missing. Email will not actually send.");
    }

    const subject = "Flavor - New Device Log In Attempt";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2>Security Alert: New Device Verification</h2>
            <p>We noticed an attempt to log into your Flavor account from a new device.</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Device:</strong> ${deviceInfo.deviceName || 'Unknown Device'}</p>
                <p><strong>Browser:</strong> ${deviceInfo.browser || 'Unknown'}</p>
                <p><strong>OS:</strong> ${deviceInfo.operatingSystem || 'Unknown'}</p>
                <p><strong>IP Address:</strong> ${deviceInfo.ipAddress || 'Unknown'}</p>
                <p><strong>Location:</strong> ${deviceInfo.location || 'Unknown'}</p>
            </div>
            <p>If this was you, please use the following OTP to verify your device. This code will expire in 5 minutes.</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #1a1a1a; color: #ff6b00; padding: 10px 20px; border-radius: 8px;">${otp}</span>
            </div>
            <p style="color: #d9534f;">If you did not attempt this login, please ignore this email and secure your account.</p>
            <p>Thanks,<br>The Flavor Security Team</p>
        </div>
    `;

    return sendEmail(email, subject, html);
};

/**
 * Send a notification that a new device has been successfully authorized
 */
export const sendNewDeviceAlertEmail = async (email, deviceInfo) => {
    const subject = "Flavor - New Device Authorized";
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2>Security Alert: New Device Logged In</h2>
            <p>A new device was just successfully authorized to access your Flavor account.</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Device:</strong> ${deviceInfo.deviceName || 'Unknown Device'}</p>
                <p><strong>Browser:</strong> ${deviceInfo.browser || 'Unknown'}</p>
                <p><strong>OS:</strong> ${deviceInfo.operatingSystem || 'Unknown'}</p>
                <p><strong>IP Address:</strong> ${deviceInfo.ipAddress || 'Unknown'}</p>
                <p><strong>Location:</strong> ${deviceInfo.location || 'Unknown'}</p>
                <p><strong>Time:</strong> ${new Date().toUTCString()}</p>
            </div>
            <p>If this was you, no further action is needed.</p>
            <p style="color: #d9534f; font-weight: bold;">If you do not recognize this activity, please contact support immediately to secure your account.</p>
            <p>Thanks,<br>The Flavor Security Team</p>
        </div>
    `;

    return sendEmail(email, subject, html);
};
