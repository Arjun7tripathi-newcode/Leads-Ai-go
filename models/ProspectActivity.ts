import mongoose, { Schema, Document, models } from 'mongoose';

export interface IProspectActivity extends Document {
  prospectId: mongoose.Types.ObjectId;
  type: 'Lead Added' | 'Email Verified' | 'Status Changed' | 'Outreach Generated' | 'Email Sent' | 'Note Added';
  description: string;
  metadata?: any;
  createdAt: Date;
}

const ProspectActivitySchema = new Schema({
  prospectId: { type: Schema.Types.ObjectId, ref: 'Prospect', required: true },
  type: { 
    type: String, 
    enum: ['Lead Added', 'Email Verified', 'Status Changed', 'Outreach Generated', 'Email Sent', 'Note Added'],
    required: true
  },
  description: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const ProspectActivity = models.ProspectActivity || mongoose.model<IProspectActivity>('ProspectActivity', ProspectActivitySchema);
