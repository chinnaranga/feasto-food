const required = [
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "FIREBASE_PROJECT_ID"
];

// Check required variables
required.forEach((key) => {
    if (!process.env[key]) {
        if (key === "FIREBASE_PROJECT_ID") {
            console.error(`❌ Missing env: ${key}`);
            process.exit(1);
        } else {
            // Fallback for JWT secret names
            const fallback = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || process.env.JWT_REFRESH_SECRET;
            if (!fallback) {
                console.error(`❌ Missing env: ${key} (and no JWT_SECRET fallback)`);
                process.exit(1);
            }
            console.warn(`⚠️  Missing env: ${key}. Using fallback JWT secret.`);
        }
    }
});

// One of these must exist
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    console.error(`❌ Missing env: MONGODB_URI or MONGO_URI`);
    process.exit(1);
}
