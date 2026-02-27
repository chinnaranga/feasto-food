const required = [
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "FIREBASE_PROJECT_ID"
];

// Check required variables
required.forEach((key) => {
    if (!process.env[key]) {
        console.error(`❌ Missing env: ${key}`);
        process.exit(1);
    }
});

// One of these must exist
if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    console.error(`❌ Missing env: MONGODB_URI or MONGO_URI`);
    process.exit(1);
}
