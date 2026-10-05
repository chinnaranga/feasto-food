/**
 * @openapi
 * tags:
 *   - name: User Profile & Account Management
 *     description: User Profiles, Delivery Address Book, Favorites Engine, Notification & Privacy Preferences, Device Control, and Health Summary.
 */

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Read Own User Profile
 *     tags: [User Profile & Account Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile successfully retrieved
 *   patch:
 *     summary: Update Own Profile Details
 *     tags: [User Profile & Account Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               phone: { type: string, example: "+1234567890" }
 *               profilePhoto: { type: string, example: "https://res.cloudinary.com/demo/image/upload/v1/user.jpg" }
 *               preferredLanguage: { type: string, example: "en" }
 *               preferredCurrency: { type: string, example: "USD" }
 *               timezone: { type: string, example: "America/New_York" }
 *               bio: { type: string, example: "Foodie & burger lover" }
 *     responses:
 *       200:
 *         description: Profile successfully updated
 */

/**
 * @openapi
 * /users/me/summary:
 *   get:
 *     summary: Get Account Health & Activity Summary
 *     tags: [User Profile & Account Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Health score, completeness percentage, and stats returned
 */

/**
 * @openapi
 * /users/me/addresses:
 *   get:
 *     summary: List User Saved Addresses
 *     tags: [User Profile & Account Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved addresses returned
 *   post:
 *     summary: Add New Delivery Address
 *     tags: [User Profile & Account Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [label, street, city, state, zipCode]
 *             properties:
 *               label: { type: string, example: "Home" }
 *               street: { type: string, example: "123 Main Street" }
 *               building: { type: string, example: "Apt 4B" }
 *               city: { type: string, example: "San Francisco" }
 *               state: { type: string, example: "CA" }
 *               zipCode: { type: string, example: "94105" }
 *               country: { type: string, example: "US" }
 *               latitude: { type: number, example: 37.7749 }
 *               longitude: { type: number, example: -122.4194 }
 *               isDefault: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Address added
 */
