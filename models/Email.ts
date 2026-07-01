import mongoose, { Schema, Document } from "mongoose";

export interface IEmail extends Document {
  accountId: mongoose.Types.ObjectId; // Reference to EmailAccount
  messageId: string; // Gmail message ID
  threadId: string; // Gmail thread ID
  subject: string;
  from: string; // "Name <email@domain.com>"
  to: string[];
  cc: string[];
  bcc: string[];
  date: Date;
  snippet: string;
  bodyText: string;
  bodyHtml: string;
  attachments: { filename: string; mimeType: string; size: number; attachmentId: string }[];
  labels: string[]; // e.g. INBOX, SENT, UNREAD
  isRead: boolean;
  category?: string; // AI classification: Lead Inquiry, Support, etc.
  classificationConfidence?: number;
  prospectId?: mongoose.Types.ObjectId; // Link if a prospect was created
  createdAt: Date;
}

const EmailSchema: Schema = new Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'EmailAccount', required: true },
  messageId: { type: String, required: true, unique: true },
  threadId: { type: String, required: true },
  subject: { type: String, default: '(No Subject)' },
  from: { type: String, required: true },
  to: [{ type: String }],
  cc: [{ type: String }],
  bcc: [{ type: String }],
  date: { type: Date, required: true },
  snippet: { type: String },
  bodyText: { type: String },
  bodyHtml: { type: String },
  attachments: [{
    filename: String,
    mimeType: String,
    size: Number,
    attachmentId: String
  }],
  labels: [{ type: String }],
  isRead: { type: Boolean, default: false },
  category: { type: String },
  classificationConfidence: { type: Number },
  prospectId: { type: Schema.Types.ObjectId, ref: 'Prospect' },
  createdAt: { type: Date, default: Date.now },
});

// Create compound index for fast queries
EmailSchema.index({ accountId: 1, date: -1 });
EmailSchema.index({ threadId: 1 });

const Email = mongoose.models.Email || mongoose.model<IEmail>("Email", EmailSchema);

export default Email;
