import mongoose from "mongoose";


const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String },
  status: { type: String, default: "todo" },
  userId: { type: String, required: true } ,
  enum: ["todo", "in-progress", "done"]
});

 

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);