import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false // 🔐 hide password by default
    }
  },
  { timestamps: true }
);

// 🔁 Ensure unique index is created properly
userSchema.index({ username: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
