const required = [
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "FIREBASE_PROJECT_ID"
];

required.forEach((key) => {
    if (!process.env[key]) {
        console.error(`❌ Missing env: ${key}`);
        process.exit(1);
    }
});
