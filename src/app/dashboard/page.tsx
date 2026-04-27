"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import TaskModal from "@/components/TaskModal";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null); // Edit ke liye task store karne ke liye
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
    } else {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchTasks(parsedUser.id);
    }
  }, []);

  const fetchTasks = async (userId: string) => {
    try {
      const res = await axios.get(`/api/tasks?userId=${userId}`);
      setTasks(res.data);
    } catch (error) {
      console.error("Error loading tasks", error);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/api/tasks/${id}`);
        fetchTasks(user.id); // List refresh karein
      } catch (error) {
        alert("Delete failed! Check if API route exists.");
      }
    }
  };

  // --- EDIT LOGIC ---
  const handleEditOpen = (task: any) => {
    setTaskToEdit(task); // Modal ko data bhejne ke liye set karein
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0f1120] text-white p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10 bg-[#1a1c2e]/50 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
        <h1 className="text-2xl font-bold font-sans">Welcome, {user?.username}</h1>
        <button 
          onClick={() => {
            setTaskToEdit(null); // Naye task ke liye reset karein
            setIsModalOpen(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
        >
          + Add Task
        </button>
      </div>

      {/* Task Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map((task: any) => (
            <div key={task._id} className="bg-[#1a1c2e] p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all group">
              <div className="flex justify-between items-start">
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {task.priority}
                </span>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleEditOpen(task)}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-lg"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(task._id)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-lg"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold mt-4 text-white/90">{task.title}</h3>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">{task.description}</p>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500 italic">No tasks found. Click "+ Add Task" to start.</p>
          </div>
        )}
      </div>

      {/* Task Modal - initialData prop match kar raha hai */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskAdded={() => fetchTasks(user.id)}
        initialData={taskToEdit} 
      />
    </div>
  );
}