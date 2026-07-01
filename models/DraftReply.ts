import mongoose, { Schema, Document } from "mongoose";

export interface IDraftReply extends Document {
  emailId: mongoose.Types.ObjectId; // Reference to Email
  accountId: mongoose.Types.ObjectId; // Reference to EmailAccount
  subject: string;
  bodyHtml: string;
  bodyText: string;
  status: 'draft' | 'approved' | 'sent';
  generatedByAi: boolean;
  toneUsed?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DraftReplySchema: Schema = new Schema({
  emailId: { type: Schema.Types.ObjectId, ref: 'Email', required: true },
  accountId: { type: Schema.Types.ObjectId, ref: 'EmailAccount', required: true },
  subject: { type: String, required: true },
  bodyHtml: { type: String },
  bodyText: { type: String },
  status: { type: String, default: 'draft' },
  generatedByAi: { type: Boolean, default: true },
  toneUsed: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

DraftReplySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const DraftReply = mongoose.models.DraftReply || mongoose.model<IDraftReply>("DraftReply", DraftReplySchema);

export default DraftReply;
