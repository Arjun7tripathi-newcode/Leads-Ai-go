import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  provider: string;
  createdAt: Date;
  apifyApiKey?: string;
  openaiApiKey?: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String },          // optional — Google may not always return a display name
  email: { type: String, required: true, unique: true },
  image: { type: String },
  provider: { type: String, default: "google" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  apifyApiKey: { type: String },
  openaiApiKey: { type: String },
});

// Check if the model already exists to prevent OverwriteModelError in Next.js development
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
