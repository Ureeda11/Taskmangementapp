"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskModal({ isOpen, onClose, onTaskAdded, initialData }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPriority(initialData.priority);
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const taskData = { title, description, priority, userId: user.id, status: initialData ? initialData.status : "todo" };

    try {
      if (initialData) {
        await axios.put(`/api/tasks/${initialData._id}`, taskData);
      } else {
        await axios.post("/api/tasks", taskData);
      }
      onTaskAdded();
      onClose();
    } catch (error) {
      alert("Error saving task");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1c2e] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">{initialData ? "Edit Task" : "New Task"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-purple-500 h-32" />
          
          <div className="flex justify-between items-center bg-white/5 p-2 rounded-2xl">
            {["Low", "Medium", "High"].map((p) => (
              <button 
                key={p} 
                type="button" 
                onClick={() => setPriority(p)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${priority === p ? "bg-purple-600 text-white" : "text-gray-500 hover:text-white"}`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-gray-400 font-bold">Cancel</button>
            <button type="submit" className="flex-1 bg-purple-600 py-4 rounded-2xl font-bold shadow-lg shadow-purple-500/20">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}