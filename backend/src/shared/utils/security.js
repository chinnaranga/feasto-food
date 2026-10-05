import LoginLog from '../models/LoginLog.js';

/**
 * Detects if a login attempt is suspicious.
 * @param {Object} user - The user document
 * @param {Object} deviceInfo - From getDeviceFingerprint
 * @returns {Promise<boolean>}
 */
export const detectSuspiciousLogin = async (user, deviceInfo) => {
    // 1. New device check
    const existingDeviceIndex = user.devices.findIndex(d => d.deviceId === deviceInfo.deviceId);
    if (existingDeviceIndex === -1) {
        return true;
    }

    const previousDevice = user.devices[existingDeviceIndex];

    // 2. New country/location check (highly simplified here, can be enhanced with geo libraries)
    if (previousDevice.location && deviceInfo.location) {
        // e.g., "Malkajgiri, Telangana, India" -> "India"
        const prevCountry = previousDevice.location.split(',').pop().trim();
        const currCountry = deviceInfo.location.split(',').pop().trim();
        if (prevCountry !== 'Unknown' && currCountry !== 'Unknown' && prevCountry !== currCountry) {
            return true;
        }
    }

    // 3. Multiple IPs within a short time
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentLogs = await LoginLog.find({
        userId: user._id,
        createdAt: { $gte: oneHourAgo }
    }).select('ipAddress');

    const uniqueIPs = new Set(recentLogs.map(log => log.ipAddress).filter(ip => ip !== 'Unknown' && ip !== '::1' && ip !== '127.0.0.1'));
    if (deviceInfo.ipAddress && deviceInfo.ipAddress !== 'Unknown' && !uniqueIPs.has(deviceInfo.ipAddress)) {
        uniqueIPs.add(deviceInfo.ipAddress);
    }

    if (uniqueIPs.size > 3) {
        return true; // Used more than 3 distinct external IPs in an hour
    }

    // 4. Too many failed attempts
    const recentFailedAttempts = await LoginLog.countDocuments({
        userId: user._id,
        loginStatus: 'failed',
        createdAt: { $gte: oneHourAgo }
    });

    if (recentFailedAttempts >= 5) {
        return true;
    }

    return false;
};
