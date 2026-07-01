import mongoose, { Schema, Document } from "mongoose";

export interface IEmailTemplate extends Document {
  userId: mongoose.Types.ObjectId;
  name: string; // e.g. "Introductory Follow-up"
  subject: string;
  body: string; // HTML or Markdown
  variables: string[]; // e.g. ["{{name}}", "{{company}}"]
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  variables: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

EmailTemplateSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>("EmailTemplate", EmailTemplateSchema);

export default EmailTemplate;
