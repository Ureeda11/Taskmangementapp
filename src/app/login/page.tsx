"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const res = await axios.post("/api/auth/login", formData);
      
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        router.push("/dashboard");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1120]">
      <form onSubmit={handleSubmit} className="bg-[#1a1c2e] p-10 rounded-2xl border border-white/10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        <input 
          type="email" 
          placeholder="Email" 
          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white mb-4 outline-none"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white mb-6 outline-none"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required 
        />
        <button type="submit" className="w-full bg-purple-600 py-4 rounded-xl text-white font-bold hover:bg-purple-700">
          Login
        </button>
      </form>
    </div>
  );
}