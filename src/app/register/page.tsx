"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend API call
      await axios.post("/api/auth/register", formData);
      alert("Registration Successful! 🎉");
      router.push("/login");
    } catch (error: any) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1120] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute w-64 h-64 bg-[#8b5cf6] opacity-10 blur-[100px] rounded-full top-1/4 left-1/4 animate-pulse"></div>
      
      <div className="relative w-full max-w-md bg-[#1a1c2e]/80 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Sign Up</h1>
          <p className="text-gray-400 text-sm">Create your account to manage tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
            <input
              type="text"
              required
              placeholder="Enter username"
              className="w-full bg-[#0f1120]/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="w-full bg-[#0f1120]/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-[#0f1120]/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#8b5cf6] transition-all"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Now"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400 text-sm">
          Already have an account? <Link href="/login" className="text-[#8b5cf6] font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}