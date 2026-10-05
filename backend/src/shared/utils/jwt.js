import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;


export const signAccessToken = (user) =>
    jwt.sign(
        { uid: user.uid, role: user.role },
        ACCESS_SECRET,
        { expiresIn: "15m" }
    );

export const signRefreshToken = (user) =>
    jwt.sign(
        { uid: user.uid },
        REFRESH_SECRET,
        { expiresIn: "7d" }
    );

export const verifyRefreshToken = (token) =>
    jwt.verify(token, REFRESH_SECRET);
