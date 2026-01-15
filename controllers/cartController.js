import Cart from '../models/Cart.js';

/**
 * GET USER CART
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    const cart = await Cart.findOne({ userId });

    res.status(200).json(cart || { userId, items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to get cart',
      error: err.message
    });
  }
};

/**
 * ADD / UPDATE CART ITEMS
 * Expected body:
 * {
 *   productId,
 *   quantity
 * }
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { productId, quantity } = req.body;

    // ✅ Validation
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity }]
      });
    } else {
      // Check if product already exists
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        // Increase quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Add new product
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to update cart',
      error: err.message
    });
  }
};
