import mongoose, { Document, Schema } from "mongoose";

export interface IContent extends Document {
  content: string;
  createdAt: Date;
}

const ContentSchema = new Schema<IContent>(
  {
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Content = mongoose.model<IContent>("Content", ContentSchema);
