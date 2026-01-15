console.log("DEBUG: Starting...");

(async () => {
    try {
        console.log("DEBUG: Importing dotenv/config...");
        await import("dotenv/config");

        console.log("DEBUG: Importing express...");
        const express = (await import("express")).default;

        console.log("DEBUG: Importing cors...");
        const cors = (await import("cors")).default;

        console.log("DEBUG: Importing firebase-admin...");
        const admin = (await import("firebase-admin")).default;

        console.log("DEBUG: Importing fs...");
        const fs = (await import("fs"));

        console.log("DEBUG: Importing connectDB...");
        const connectDB = (await import("./db.js")).default;

        console.log("DEBUG: Importing authRoutes...");
        const authRoutes = (await import("./routes/auth.js")).default;

        console.log("DEBUG: Importing cartRoutes...");
        const cartRoutes = (await import("./routes/cart.js")).default;

        console.log("DEBUG: Importing protectedRoutes...");
        const protectedRoutes = (await import("./routes/protected.js")).default;

        console.log("DEBUG: All imports successful.");

        const app = express();
        const PORT = process.env.PORT || 5001;

        console.log("DEBUG: Attempting to connect to DB...");
        await connectDB();

        app.listen(PORT, () => {
            console.log(`DEBUG: Server listening on ${PORT}`);
        });

    } catch (error) {
        console.error("DEBUG: Crash occurred:", error);
    }
})();
