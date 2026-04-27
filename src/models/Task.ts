import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
  userId?: mongoose.Types.ObjectId;
}

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { 
    type: String, 
   
    enum: ['high', 'medium', 'low', 'High', 'Medium', 'Low'], 
    lowercase: true, 
    default: 'medium' 
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
   
    required: false 
  },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);