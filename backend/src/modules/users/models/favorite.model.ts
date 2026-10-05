import { Schema, model, Document, Types } from 'mongoose';

export type FavoriteEntityType = 'restaurant' | 'menu_item' | 'branch';

export interface IFavoriteDocument extends Document {
  userId: Types.ObjectId;
  entityType: FavoriteEntityType;
  entityId: string;
  metadata?: {
    name?: string;
    image?: string;
    price?: number;
    rating?: number;
    cuisine?: string;
  };
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavoriteDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ['restaurant', 'menu_item', 'branch'],
      required: true,
    },
    entityId: {
      type: String,
      required: true,
    },
    metadata: {
      name: { type: String },
      image: { type: String },
      price: { type: Number },
      rating: { type: Number },
      cuisine: { type: String },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

favoriteSchema.index({ userId: 1, entityType: 1, entityId: 1 }, { unique: true });

export const Favorite = model<IFavoriteDocument>('Favorite', favoriteSchema);
