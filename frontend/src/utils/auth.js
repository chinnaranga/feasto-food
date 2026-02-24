export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};

export const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
};

export const isAuthenticated = () => {
    const token = getAccessToken();
    if (!token) return false;

    const payload = parseJwt(token);
    if (!payload) return false;

    // Check expiry
    const currentTime = Date.now() / 1000;
    if (payload.exp < currentTime) return false;

    return true;
};

export const isAdmin = () => {
    const token = getAccessToken();
    if (!token) return false;

    const payload = parseJwt(token);
    return payload && payload.role === 'admin';
};
