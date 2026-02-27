import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
});

export default mongoose.model('Cart', cartSchema);