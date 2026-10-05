import { Schema, model, Document, Types } from 'mongoose';

export type DocumentType =
  | 'driver_license'
  | 'national_id'
  | 'vehicle_registration'
  | 'insurance_proof'
  | 'background_check';

export type DocumentStatus = 'pending_review' | 'approved' | 'rejected';

export interface IRiderDocumentDocument extends Document {
  riderId: Types.ObjectId;
  documentType: DocumentType;
  documentNumber?: string;
  documentUrl: string;
  expiryDate?: Date;
  status: DocumentStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const riderDocumentSchema = new Schema<IRiderDocumentDocument>(
  {
    riderId: {
      type: Schema.Types.ObjectId,
      ref: 'Rider',
      required: true,
      index: true,
    },
    documentType: {
      type: String,
      enum: [
        'driver_license',
        'national_id',
        'vehicle_registration',
        'insurance_proof',
        'background_check',
      ],
      required: true,
    },
    documentNumber: { type: String, trim: true },
    documentUrl: { type: String, required: true },
    expiryDate: { type: Date },
    status: {
      type: String,
      enum: ['pending_review', 'approved', 'rejected'],
      default: 'pending_review',
      index: true,
    },
    rejectionReason: { type: String },
  },
  {
    timestamps: true,
  }
);

riderDocumentSchema.index({ riderId: 1, documentType: 1 });

export const RiderDocument = model<IRiderDocumentDocument>(
  'RiderDocument',
  riderDocumentSchema
);
