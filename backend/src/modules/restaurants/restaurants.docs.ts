/**
 * @openapi
 * tags:
 *   - name: Restaurant Workspace & Branch Management
 *     description: Restaurant Identity, Branch Locations, Operating Hours, Service Settings, Business Verification, and Staff Access Control.
 */

/**
 * @openapi
 * /restaurants:
 *   get:
 *     summary: List Public or Owned Restaurants
 *     tags: [Restaurant Workspace & Branch Management]
 *     parameters:
 *       - in: query
 *         name: ownerUserId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of restaurants returned
 *   post:
 *     summary: Create New Restaurant Workspace
 *     tags: [Restaurant Workspace & Branch Management]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [restaurantName, legalBusinessName, cuisineTypes, email, phone, address, city, state]
 *             properties:
 *               restaurantName: { type: string, example: "Burger Palace" }
 *               legalBusinessName: { type: string, example: "Burger Palace LLC" }
 *               cuisineTypes: { type: array, items: { type: string }, example: ["American", "Fast Food"] }
 *               email: { type: string, example: "contact@burgerpalace.com" }
 *               phone: { type: string, example: "+14155552671" }
 *               address: { type: string, example: "789 Mission St" }
 *               city: { type: string, example: "San Francisco" }
 *               state: { type: string, example: "CA" }
 *     responses:
 *       201:
 *         description: Restaurant workspace created with auto-initialized main branch, hours, and settings
 */

/**
 * @openapi
 * /restaurants/{restaurantId}/branches:
 *   get:
 *     summary: List Restaurant Branches
 *     tags: [Restaurant Workspace & Branch Management]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Branches list returned
 *   post:
 *     summary: Create Secondary Branch
 *     tags: [Restaurant Workspace & Branch Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Branch created
 */
