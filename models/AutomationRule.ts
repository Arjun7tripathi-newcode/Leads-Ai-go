import mongoose, { Schema, Document } from "mongoose";

export interface IAutomationRule extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  isActive: boolean;
  conditions: {
    field: 'category' | 'sender' | 'subject';
    operator: 'equals' | 'contains' | 'startsWith';
    value: string;
  }[];
  action: 'auto_reply' | 'draft_reply' | 'notify' | 'create_prospect';
  templateId?: mongoose.Types.ObjectId; // If action is auto_reply
  priority: number;
  createdAt: Date;
}

const AutomationRuleSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  conditions: [{
    field: { type: String, required: true },
    operator: { type: String, required: true },
    value: { type: String, required: true },
  }],
  action: { type: String, required: true },
  templateId: { type: Schema.Types.ObjectId, ref: 'EmailTemplate' },
  priority: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const AutomationRule = mongoose.models.AutomationRule || mongoose.model<IAutomationRule>("AutomationRule", AutomationRuleSchema);

export default AutomationRule;
