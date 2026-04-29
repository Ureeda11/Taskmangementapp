"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import TaskModal from "@/components/TaskModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const COLUMNS = [
  { id: "todo", title: "Upcoming" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Completed" },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);
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

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // UI ko foran update karein (Optimistic UI)
    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(t => t._id === draggableId);
    updatedTasks[taskIndex].status = destination.droppableId;
    setTasks(updatedTasks);

    // Backend par status update karein
    try {
      await axios.put(`/api/tasks/${draggableId}`, { status: destination.droppableId });
    } catch (error) {
      console.error("Failed to update status");
      fetchTasks(user.id); // Error pe wapas fetch karein
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/api/tasks/${id}`);
        fetchTasks(user.id);
      } catch (error) {
        alert("Delete failed!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1120] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 bg-[#1a1c2e]/50 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
        <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>
        <button 
          onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-xl font-bold transition-all shadow-lg"
        >
          + Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <div key={col.id} className="bg-[#16182d] rounded-3xl p-4 border border-white/5 min-h-[70vh]">
              <h2 className="text-lg font-bold mb-6 px-2 flex justify-between opacity-80">
                {col.title}
                <span className="bg-white/10 px-2 py-0.5 rounded text-sm">
                  {tasks.filter(t => (t.status || 'todo') === col.id).length}
                </span>
              </h2>

              <Droppable droppableId={col.id}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 min-h-125">
                    {tasks
                      .filter((task) => (task.status || 'todo') === col.id)
                      .map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-[#1a1c2e] p-5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all group shadow-xl"
                            >
                              <div className="flex justify-between items-start">
                                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
                                  task.priority === 'High' ? 'bg-red-500/20 text-red-400' : 
                                  task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                                }`}>
                                  {task.priority}
                                </span>
                                <div className="flex gap-2">
                                  <button onClick={() => { setTaskToEdit(task); setIsModalOpen(true); }}>✏️</button>
                                  <button onClick={() => handleDelete(task._id)}>🗑️</button>
                                </div>
                              </div>
                              <h3 className="text-lg font-bold mt-3">{task.title}</h3>
                              <p className="text-gray-400 text-sm mt-1">{task.description}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskAdded={() => fetchTasks(user.id)}
        initialData={taskToEdit} 
      />
    </div>
  );
}