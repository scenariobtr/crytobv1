"use client";

import { Globe, KeyRound, Lock, ShieldCheck, Smartphone, User, Wallet, Zap } from "lucide-react";
import versionInfo from "@/data/version.json";
import type { AuthView } from "../types";

type AuthScreenProps = {
  authView: AuthView;
  usernameInput: string;
  passwordInput: string;
  phoneInput: string;
  otpInput: string;
  lang: "EN" | "TH";
  onAuthViewChange: (view: AuthView) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onLogin: (event: React.FormEvent) => void;
  onRegister: (event: React.FormEvent) => void;
  onVerifyOtp: (event: React.FormEvent) => void;
  onToggleLang: () => void;
  t: (path: string) => string;
};

const DisabledSocialButtons = () => {
  return (
    <>
      <div className="flex items-center gap-6 py-2">
        <div className="h-[1px] flex-1 bg-zinc-900"></div>
        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">OR CONTINUE WITH</span>
        <div className="h-[1px] flex-1 bg-zinc-900"></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button disabled className="py-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center grayscale opacity-30 cursor-not-allowed text-sm font-black text-white">
          G
        </button>
        <button disabled className="py-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center grayscale opacity-30 cursor-not-allowed">
          <KeyRound className="w-5 h-5 text-white" />
        </button>
        <button disabled className="py-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center grayscale opacity-30 cursor-not-allowed">
          <Wallet className="w-5 h-5 text-orange-500" />
        </button>
      </div>
    </>
  );
};

export const AuthScreen = ({
  authView,
  usernameInput,
  passwordInput,
  phoneInput,
  otpInput,
  lang,
  onAuthViewChange,
  onUsernameChange,
  onPasswordChange,
  onPhoneChange,
  onOtpChange,
  onLogin,
  onRegister,
  onVerifyOtp,
  onToggleLang,
  t,
}: AuthScreenProps) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-6 right-6 md:top-10 md:right-10 z-[70] animate-in fade-in slide-in-from-right-4 duration-1000">
        <button onClick={onToggleLang} className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-[10px] md:text-[12px] font-black text-neutral-300 hover:text-emerald-500 hover:border-emerald-500/30 backdrop-blur-xl transition-all shadow-2xl group">
          <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:rotate-180 transition-transform duration-500" /> {lang}
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-emerald-500/5 blur-[80px] md:blur-[150px] rounded-full pointer-events-none"></div>
      <div className="text-center space-y-4 md:space-y-6 relative z-10 w-full max-w-sm py-10">
        <Zap className="w-10 h-10 md:w-14 md:h-14 text-emerald-500 mx-auto" />
        <div className="space-y-1 md:space-y-2">
          <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter leading-none">STAKE<span className="text-emerald-500">WISE</span></h1>
          <p className="text-neutral-400 text-xs md:text-base font-bold uppercase tracking-normal opacity-80 italic">{t("auth.slogan")}</p>
        </div>

        {authView === "LOGIN" && (
          <form onSubmit={onLogin} className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <input required type="text" value={usernameInput} onChange={(e) => onUsernameChange(e.target.value)} placeholder="USERNAME" className="w-full pl-14 pr-8 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500/50 transition-all placeholder:text-zinc-800 text-sm" />
            </div>
            <div className="space-y-2 relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input required type="password" value={passwordInput} onChange={(e) => onPasswordChange(e.target.value)} placeholder="PASSWORD" className="w-full pl-14 pr-8 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500/50 transition-all placeholder:text-zinc-800 text-sm" />
            </div>
            <button type="submit" className="w-full mt-2 px-8 md:px-10 py-4 md:py-5 bg-emerald-500 text-black font-black uppercase text-sm md:text-base hover:bg-white transition-all rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-95">{t("auth.access_terminal")}</button>
            <button type="button" onClick={() => onAuthViewChange("REGISTER")} className="w-full text-[9px] md:text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em] hover:text-white transition-colors">{t("auth.register_link")}</button>
          </form>
        )}

        {authView === "REGISTER" && (
          <form onSubmit={onRegister} className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2 relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                <User className="w-4 h-4" />
              </div>
              <input required type="text" value={usernameInput} onChange={(e) => onUsernameChange(e.target.value)} placeholder="CHOOSE USERNAME" className="w-full pl-14 pr-8 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500/50 transition-all placeholder:text-zinc-800 text-sm" />
            </div>
            <div className="space-y-2 relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                <Smartphone className="w-4 h-4" />
              </div>
              <input required type="tel" value={phoneInput} onChange={(e) => onPhoneChange(e.target.value)} placeholder="PHONE NUMBER" className="w-full pl-14 pr-8 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500/50 transition-all placeholder:text-zinc-800 text-sm" />
            </div>
            <div className="space-y-2 relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <input required type="password" value={passwordInput} onChange={(e) => onPasswordChange(e.target.value)} placeholder="SET PASSWORD" className="w-full pl-14 pr-8 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500/50 transition-all placeholder:text-zinc-800 text-sm" />
            </div>
            <button type="submit" className="w-full mt-2 px-8 md:px-10 py-4 md:py-5 bg-white text-black font-black uppercase text-sm md:text-base hover:bg-emerald-500 transition-all rounded-2xl shadow-xl active:scale-95">{t("auth.send_otp")}</button>
            <button type="button" onClick={() => onAuthViewChange("LOGIN")} className="w-full text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-white transition-colors">กลับหน้าล็อกอิน / BACK TO LOGIN</button>
          </form>
        )}

        {authView === "OTP" && (
          <form onSubmit={onVerifyOtp} className="space-y-6 pt-4 animate-in fade-in zoom-in duration-500">
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
              <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest leading-relaxed">
                กรุณากรอกรหัส OTP 4 หลัก ที่ส่งไปยัง <br />
                <span className="text-white">{phoneInput}</span>
              </p>
            </div>
            <input required type="text" maxLength={4} value={otpInput} onChange={(e) => onOtpChange(e.target.value)} placeholder="0 0 0 0" className="w-full py-6 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black text-4xl text-center tracking-[0.5em] focus:border-emerald-500 transition-all" />
            <button type="submit" className="w-full px-8 md:px-10 py-4 md:py-5 bg-emerald-500 text-black font-black uppercase text-sm md:text-base hover:bg-white transition-all rounded-2xl shadow-xl">ยืนยันตัวตน</button>
            <button type="button" onClick={() => onAuthViewChange("REGISTER")} className="w-full text-[9px] md:text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">ขอรหัสอีกครั้ง / RESEND</button>
          </form>
        )}

        {authView !== "OTP" && <DisabledSocialButtons />}

        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest pt-6">
          STAKEWISE TERMINAL v{versionInfo.version} - SECURE ACCESS ONLY - UPDATED {new Date(versionInfo.lastUpdated).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </p>
      </div>
    </div>
  );
};
