import { Schema, model, Document, Types } from 'mongoose';

export interface IDailySchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  open: string;  // HH:mm 24-hr format e.g. "09:00"
  close: string; // HH:mm 24-hr format e.g. "22:00"
  isOpen: boolean;
}

export interface IHolidaySchedule {
  date: string; // YYYY-MM-DD
  reason: string;
  isOpen: boolean;
  open?: string;
  close?: string;
}

export interface IRestaurantHoursDocument extends Document {
  restaurantId: Types.ObjectId;
  branchId?: Types.ObjectId;
  openingHours: IDailySchedule[];
  kitchenHours: IDailySchedule[];
  deliveryHours: IDailySchedule[];
  pickupHours: IDailySchedule[];
  holidayHours: IHolidaySchedule[];
  createdAt: Date;
  updatedAt: Date;
}

const dailyScheduleSchema = new Schema<IDailySchedule>(
  {
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    open: { type: String, default: '09:00' },
    close: { type: String, default: '22:00' },
    isOpen: { type: Boolean, default: true },
  },
  { _id: false }
);

const holidayScheduleSchema = new Schema<IHolidaySchedule>(
  {
    date: { type: String, required: true },
    reason: { type: String, required: true },
    isOpen: { type: Boolean, default: false },
    open: { type: String },
    close: { type: String },
  },
  { _id: false }
);

const defaultWeeklySchedule: IDailySchedule[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
].map((day) => ({
  day: day as IDailySchedule['day'],
  open: '09:00',
  close: '22:00',
  isOpen: true,
}));

const restaurantHoursSchema = new Schema<IRestaurantHoursDocument>(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      unique: true,
      index: true,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'RestaurantBranch',
    },
    openingHours: {
      type: [dailyScheduleSchema],
      default: defaultWeeklySchedule,
    },
    kitchenHours: {
      type: [dailyScheduleSchema],
      default: defaultWeeklySchedule,
    },
    deliveryHours: {
      type: [dailyScheduleSchema],
      default: defaultWeeklySchedule,
    },
    pickupHours: {
      type: [dailyScheduleSchema],
      default: defaultWeeklySchedule,
    },
    holidayHours: {
      type: [holidayScheduleSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const RestaurantHours = model<IRestaurantHoursDocument>(
  'RestaurantHours',
  restaurantHoursSchema
);
