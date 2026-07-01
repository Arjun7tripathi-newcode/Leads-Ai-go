import mongoose, { Schema, Document } from "mongoose";

export interface IEmailLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: 'sync' | 'auto_reply' | 'manual_reply' | 'draft_generated' | 'prospect_created' | 'error';
  description: string;
  emailId?: mongoose.Types.ObjectId;
  metadata?: any;
  createdAt: Date;
}

const EmailLogSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  description: { type: String, required: true },
  emailId: { type: Schema.Types.ObjectId, ref: 'Email' },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

const EmailLog = mongoose.models.EmailLog || mongoose.model<IEmailLog>("EmailLog", EmailLogSchema);

export default EmailLog;
