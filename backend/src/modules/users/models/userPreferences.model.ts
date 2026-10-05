import { Schema, model, Document, Types } from 'mongoose';

export interface IUserPreferencesDocument extends Document {
  userId: Types.ObjectId;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    showProfilePhoto: boolean;
    allowDataAnalytics: boolean;
  };
  accessibility: {
    highContrast: boolean;
    screenReader: boolean;
  };
  dietary: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userPreferencesSchema = new Schema<IUserPreferencesDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    privacy: {
      showProfilePhoto: { type: Boolean, default: true },
      allowDataAnalytics: { type: Boolean, default: true },
    },
    accessibility: {
      highContrast: { type: Boolean, default: false },
      screenReader: { type: Boolean, default: false },
    },
    dietary: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserPreferences = model<IUserPreferencesDocument>(
  'UserPreferences',
  userPreferencesSchema
);
