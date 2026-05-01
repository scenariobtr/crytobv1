"use client";

import React, { useState } from "react";
import { TrendingUp, ArrowLeft, Mail, Lock, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { mockUsers } from "../../data/mockUsers"; // แก้ไข Path ให้ถูกต้อง

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // ตรวจสอบการเข้าสู่ระบบ
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("current_user_id", user.id);
        alert("เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ " + user.username);
        window.location.href = "/";
      } else {
        setError("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
      }
    } else {
      alert("ระบบสมัครสมาชิกยังไม่เปิดใช้งานในเวอร์ชันทดสอบนี้");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Back */}
        <div className="flex flex-col items-center space-y-4">
          <Link href="/" className="flex items-center gap-2 text-neutral-500 hover:text-emerald-500 transition-colors text-xs font-black uppercase tracking-widest self-start mb-4">
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </Link>
          <div className="w-12 h-12 rounded-sm bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            {isLogin ? "เข้าสู่ระบบ" : "สร้างบัญชีใหม่"}
          </h1>
          <p className="text-neutral-500 text-sm font-sans italic text-center">
            กรุณาใช้บัญชี <span className="text-emerald-500 font-bold">admin001</span> หรือ <span className="text-emerald-500 font-bold">admin002</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-neutral-900/50 border border-neutral-900 p-8 rounded-sm shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-2">ชื่อผู้ใช้งาน (Username)</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700" />
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ระบุชื่อผู้ใช้งาน..."
                  className="w-full pl-12 pr-4 py-4 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 outline-none transition-all uppercase text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-2">รหัสผ่าน (Password)</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ระบุรหัสผ่าน..."
                  className="w-full pl-12 pr-4 py-4 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 outline-none transition-all uppercase text-xs font-bold"
                />
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest text-center animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-5 bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {isLogin ? "เข้าสู่ระบบทันที" : "สมัครสมาชิกตอนนี้"}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
            >
              {isLogin ? "ยังไม่มีบัญชีใช่ไหม? สมัครสมาชิกที่นี่" : "มีบัญชีอยู่แล้ว? เข้าสู่ระบบที่นี่"}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-neutral-700 font-bold uppercase tracking-[0.2em]">
          ระบุข้อมูลให้ถูกต้องเพื่อเข้าถึงระบบ
        </p>
      </div>
    </div>
  );
}
