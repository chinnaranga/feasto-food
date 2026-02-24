export const loadCashfree = async (mode = "sandbox") => {
    return new Promise((resolve, reject) => {
        if (window.Cashfree) {
            resolve(window.Cashfree({ mode }));
            return;
        }

        const script = document.createElement("script");
        script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
        script.onload = () => {
            if (window.Cashfree) {
                // Initialize Cashfree
                const cf = window.Cashfree({ mode });
                resolve(cf);
            } else {
                reject(new Error("Cashfree script failed to expose window.Cashfree"));
            }
        };
        script.onerror = () => reject(new Error("Failed to load Cashfree script"));
        document.body.appendChild(script);
    });
};
