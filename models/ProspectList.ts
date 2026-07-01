import mongoose, { Schema, Document, models } from 'mongoose';

export interface IProspectList extends Document {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  visibility: 'Private' | 'Team' | 'Public';
  tags: string[];
  prospectIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProspectListSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  color: { type: String, default: '#3b82f6' },
  icon: { type: String, default: 'list' },
  visibility: { type: String, enum: ['Private', 'Team', 'Public'], default: 'Private' },
  tags: [{ type: String }],
  prospectIds: [{ type: Schema.Types.ObjectId, ref: 'Prospect' }]
}, { timestamps: true });

export const ProspectList = models.ProspectList || mongoose.model<IProspectList>('ProspectList', ProspectListSchema);
