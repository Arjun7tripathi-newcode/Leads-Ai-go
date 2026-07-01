import mongoose, { Schema, Document } from "mongoose";

export interface IEmailAccount extends Document {
  userId: mongoose.Types.ObjectId;
  emailAddress: string;
  provider: string; // 'google'
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date;
  syncHistoryId?: string; // For Gmail API partial syncs
  lastSyncAt?: Date;
  signature?: string;
  workingHoursStart?: string; // '09:00'
  workingHoursEnd?: string; // '17:00'
  autoReplyEnabled: boolean;
  brandVoice?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailAccountSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  emailAddress: { type: String, required: true },
  provider: { type: String, required: true, default: 'google' },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  tokenExpiry: { type: Date },
  syncHistoryId: { type: String },
  lastSyncAt: { type: Date },
  signature: { type: String },
  workingHoursStart: { type: String },
  workingHoursEnd: { type: String },
  autoReplyEnabled: { type: Boolean, default: false },
  brandVoice: { type: String }
}, {
  timestamps: true
});

const EmailAccount = mongoose.models.EmailAccount || mongoose.model<IEmailAccount>("EmailAccount", EmailAccountSchema);

export default EmailAccount;
