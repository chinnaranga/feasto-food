/**
 * @openapi
 * tags:
 *   - name: Authentication & Identity
 *     description: User Registration, Login, Token Refresh, OTP Verification, Password Recovery, and Session Controls.
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Account Registration
 *     tags: [Authentication & Identity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, format: email, example: "john.doe@example.com" }
 *               phone: { type: string, example: "+1234567890" }
 *               password: { type: string, format: password, example: "SecurePass123!" }
 *               role: { type: string, example: "customer" }
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Authentication & Identity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: "john.doe@example.com" }
 *               password: { type: string, example: "SecurePass123!" }
 *     responses:
 *       200:
 *         description: Login successful with tokens and session
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout Current Session
 *     tags: [Authentication & Identity]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Session revoked
 */

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh Tokens with Rotation
 *     tags: [Authentication & Identity]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200:
 *         description: New access and refresh token pair issued
 */

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get Current Authenticated User Profile
 *     tags: [Authentication & Identity]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile and permissions returned
 */
