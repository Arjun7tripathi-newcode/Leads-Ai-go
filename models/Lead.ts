import mongoose, { Schema, Document, models } from 'mongoose';

export interface ILead extends Document {
  name: string;
  industry: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  rating: number;
  score: number;
  status: string;
  isEmailVerified: boolean;
  socials: {
    linkedin?: string;
    twitter?: string;
  };
  aiSummary: string;
  recommendedOutreach: string;
  campaignStatus: string;
  listIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema({
  name: { type: String, required: true },
  industry: { type: String },
  email: { type: String },
  phone: { type: String },
  website: { type: String },
  location: { type: String },
  rating: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  status: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  socials: {
    linkedin: { type: String },
    twitter: { type: String }
  },
  aiSummary: { type: String },
  recommendedOutreach: { type: String },
  campaignStatus: { type: String, default: 'None' },
  listIds: [{ type: Schema.Types.ObjectId, ref: 'ProspectList' }],
}, { timestamps: true });

export const Lead = models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
