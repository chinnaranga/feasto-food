import { getAuth } from "firebase/auth";

/**
 * Frontend API Utility to prevent 401s and JSON errors
 */

// 4️⃣ Always Send Firebase Token
export async function authFetch(url, options = {}) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("AUTH_REQUIRED: User not logged in");
    }

    const token = await user.getIdToken();

    // Ensure Base URL
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
    const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

    return fetch(fullUrl, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });
}

// 5️⃣ Safe JSON Parsing
export async function safeJson(res) {
    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        console.error("Non-JSON Response:", text.substring(0, 100)); // Log first 100 chars
        throw new Error("SERVER_RETURNED_INVALID_JSON");
    }
}
