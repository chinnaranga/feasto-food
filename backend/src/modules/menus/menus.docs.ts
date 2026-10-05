/**
 * @openapi
 * tags:
 *   - name: Menu Management & Catalog System
 *     description: Menu Management, Category Hierarchy, Item Catalog, Variant Matrix, Add-on Engine, Media/Nutrition Manager, and Availability Scheduler.
 */

/**
 * @openapi
 * /restaurants/{restaurantId}/menus:
 *   get:
 *     summary: List Restaurant Menus
 *     tags: [Menu Management & Catalog System]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of menus returned
 *   post:
 *     summary: Create New Restaurant Menu
 *     tags: [Menu Management & Catalog System]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [menuName]
 *             properties:
 *               menuName: { type: string, example: "Main Dining Menu" }
 *               menuDescription: { type: string, example: "Lunch and dinner items" }
 *               menuType: { type: string, example: "regular" }
 *               currency: { type: string, example: "USD" }
 *     responses:
 *       201:
 *         description: Menu created in draft state
 */

/**
 * @openapi
 * /restaurants/{restaurantId}/menus/{menuId}/categories:
 *   get:
 *     summary: List Menu Categories
 *     tags: [Menu Management & Catalog System]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Categories returned
 *   post:
 *     summary: Create Menu Category
 *     tags: [Menu Management & Catalog System]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: menuId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [categoryName]
 *             properties:
 *               categoryName: { type: string, example: "Gourmet Pizzas" }
 *               categoryDescription: { type: string, example: "Hand-tossed wood-fired pizzas" }
 *     responses:
 *       201:
 *         description: Category created
 */
