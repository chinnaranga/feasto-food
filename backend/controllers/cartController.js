import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cart', error: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { items } = req.body;
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = await Cart.create({ userId: req.params.userId, items });
    } else {
      cart.items = items;
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
};