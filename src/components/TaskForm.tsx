"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskForm({ onTaskAdded, editingTask, clearEdit }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
    }
  }, [editingTask]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const taskData = { 
      title, 
      description, 
      priority: priority.toLowerCase() 
    };

    if (editingTask) {
      await axios.patch(`/api/tasks/${editingTask._id}`, taskData);
    } else {
      await axios.post("/api/tasks", taskData);
    }
    
    onTaskAdded();
    alert("Task Success!");
  } catch (error: any) {
    alert(`Error: ${error.response?.data?.message || "Failed"}`);
  }


};

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-8 bg-[#1a1c2e]/80 backdrop-blur-xl rounded-4xl border border-white/10 shadow-2xl mb-10 text-white"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#8b5cf6] rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.4)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {editingTask ? "Edit Task" : "Create New Task"}
        </h2>
      </div>
      
      <div className="space-y-5">
        <input 
          className="w-full p-4 bg-[#252841] border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-[#8b5cf6] transition-all placeholder:text-gray-500" 
          placeholder="Task name..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        
        <textarea 
          className="w-full p-4 bg-[#252841] border border-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-[#8b5cf6] h-24 transition-all placeholder:text-gray-500 resize-none" 
          placeholder="Add description..." 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <select 
  value={priority} 
  onChange={(e) => setPriority(e.target.value)}
  className="..."
>
  
  <option value="high">🔴 High</option>
  <option value="medium">🟡 Medium</option>
  <option value="low">🟢 Low</option>
</select>
          
          <div className="flex gap-3">
            {editingTask && (
              <button type="button" onClick={clearEdit} className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="px-10 py-4 bg-[#8b5cf6] hover:bg-[#7c3aed] rounded-2xl font-bold shadow-[0_10px_25px_rgba(139,92,246,0.3)] active:scale-95 transition-all"
            >
              {editingTask ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}