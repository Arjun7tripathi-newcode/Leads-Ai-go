import mongoose, { Schema, Document, models } from 'mongoose';

export interface ISearchHistory extends Document {
  query: string;
  resultsCount: number;
  durationMs: number;
  status: 'completed' | 'failed' | 'processing';
  createdAt: Date;
}

const SearchHistorySchema = new Schema({
  query: { type: String, required: true },
  resultsCount: { type: Number, default: 0 },
  durationMs: { type: Number, default: 0 },
  status: { type: String, enum: ['completed', 'failed', 'processing'], default: 'processing' }
}, { timestamps: true });

export const SearchHistory = models.SearchHistory || mongoose.model<ISearchHistory>('SearchHistory', SearchHistorySchema);
