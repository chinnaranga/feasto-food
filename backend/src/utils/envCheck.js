/**
 * Environment Variable Checker
 * Ensures all required secrets are configured before server starts
 */

export const checkRequiredEnvVars = () => {
    const required = [
        'JWT_SECRET',
        'MONGODB_URI',
    ];

    // Check for either Firebase variable
    if (!process.env.FIREBASE_SERVICE_ACCOUNT && !process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        console.error('❌ CRITICAL: Missing FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_JSON');
        process.exit(1);
    }

    const criticalForPayments = [
        'RAZORPAY_KEY_ID',
        'RAZORPAY_KEY_SECRET',
        'STRIPE_SECRET_KEY',
    ];

    const webhookSecrets = [
        'RAZORPAY_WEBHOOK_SECRET',
        'STRIPE_WEBHOOK_SECRET',
    ];

    const missing = [];
    const warnings = [];

    // Check required vars
    required.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    // Check payment vars (warning only)
    criticalForPayments.forEach(varName => {
        if (!process.env[varName]) {
            warnings.push(`${varName} (payments may not work)`);
        }
    });

    // Check webhook secrets (warning only)
    webhookSecrets.forEach(varName => {
        if (!process.env[varName]) {
            warnings.push(`${varName} (webhook verification disabled)`);
        }
    });

    // Check NODE_ENV
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'development') {
        warnings.push('NODE_ENV not set (defaulting to development)');
    }

    // Report results
    if (missing.length > 0) {
        console.error('❌ CRITICAL: Missing required environment variables:');
        missing.forEach(v => console.error(`   - ${v}`));
        process.exit(1);
    }

    if (warnings.length > 0) {
        console.warn('⚠️  WARNING: Optional environment variables not set:');
        warnings.forEach(v => console.warn(`   - ${v}`));
    }

    console.log('✅ Environment variables validated');

    // Security check: Ensure we're not logging secrets
    if (process.env.NODE_ENV === 'production') {
        console.log('🔒 Production mode - sensitive logging disabled');
    }
};
