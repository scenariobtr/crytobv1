"use client";

import React from "react";
import { Globe, KeyRound, Lock, ShieldCheck, Smartphone, User, Wallet, Zap } from "lucide-react";
import versionInfo from "@/data/version.json";
import type { AuthView } from "../types";

const formattedLastUpdated = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "Asia/Bangkok",
}).format(new Date(versionInfo.lastUpdated));

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
  onLogin: (event: React.FormEvent<HTMLFormElement>) => void;
  onRegister: (event: React.FormEvent<HTMLFormElement>) => void;
  onVerifyOtp: (event: React.FormEvent<HTMLFormElement>) => void;
  onToggleLang: () => void;
  onBypass: () => void;
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
  onBypass,
  t,
}: AuthScreenProps) => {
  return (
    <div className="min-h-dvh bg-black flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 relative isolate overflow-x-hidden overflow-y-auto">
      {/* NO BLUR / NO GLOW for absolute hit reliability */}
      
      {/* Language Toggle - TOP LAYER */}
      <div className="absolute top-4 right-4 md:top-10 md:right-10 z-[9999]">
        <button 
          type="button"
          onClick={onToggleLang}
          className="relative z-[1] flex items-center gap-2 px-5 py-4 bg-zinc-800 border-2 border-zinc-700 rounded-2xl text-[12px] md:text-[14px] font-black text-white shadow-2xl active:bg-emerald-500 active:text-black touch-manipulation"
        >
          <Globe className="w-5 h-5" /> {lang}
        </button>
      </div>

      <div className="relative z-20 w-full max-w-sm space-y-5 py-24 text-center sm:space-y-6 sm:py-10">
        <Zap className="w-12 h-12 text-emerald-500 mx-auto" />
        <div className="space-y-2">
          <h1 className="text-6xl md:text-7xl font-black text-white italic tracking-tighter leading-none">STAKE<span className="text-emerald-500">WISE</span></h1>
          <p className="text-neutral-400 text-xs md:text-base font-bold uppercase tracking-normal opacity-80 italic">{t("auth.slogan")}</p>
        </div>

        {authView === "LOGIN" && (
          <form onSubmit={onLogin} className="space-y-4 pt-4">
            <div className="space-y-2 relative group">
              <div className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">
                <User className="w-4 h-4" />
              </div>
              <input required type="text" value={usernameInput} onChange={(e) => onUsernameChange(e.target.value)} placeholder="USERNAME" autoCapitalize="none" autoCorrect="off" spellCheck={false} inputMode="text" className="w-full pl-14 pr-8 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500 transition-all placeholder:text-zinc-700 text-sm" />
            </div>
            <div className="space-y-2 relative group">
              <div className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">
                <Lock className="w-4 h-4" />
              </div>
              <input required type="password" value={passwordInput} onChange={(e) => onPasswordChange(e.target.value)} placeholder="PASSWORD" autoCapitalize="none" autoCorrect="off" spellCheck={false} className="w-full pl-14 pr-8 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500 transition-all placeholder:text-zinc-700 text-sm" />
            </div>
            <button 
              type="submit" 
              className="w-full mt-2 px-8 py-5 bg-emerald-500 text-black font-black uppercase text-base hover:bg-white transition-all rounded-2xl shadow-xl active:scale-95 touch-manipulation"
            >
              {t("auth.access_terminal")}
            </button>
            <button 
              type="button" 
              onClick={() => onAuthViewChange("REGISTER")}
              className="w-full py-6 text-sm font-black text-emerald-500 uppercase tracking-widest hover:text-white transition-colors touch-manipulation"
            >
              {t("auth.register_link")}
            </button>
          </form>
        )}

        {authView === "REGISTER" && (
          <form onSubmit={onRegister} className="space-y-4 pt-4">
            <div className="space-y-2 relative group">
              <div className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">
                <User className="w-4 h-4" />
              </div>
              <input required type="text" value={usernameInput} onChange={(e) => onUsernameChange(e.target.value)} placeholder="CHOOSE USERNAME" autoCapitalize="none" autoCorrect="off" spellCheck={false} inputMode="text" className="w-full pl-14 pr-8 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500 transition-all placeholder:text-zinc-700 text-sm" />
            </div>
            <div className="space-y-2 relative group">
              <div className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">
                <Smartphone className="w-4 h-4" />
              </div>
              <input required type="tel" value={phoneInput} onChange={(e) => onPhoneChange(e.target.value)} placeholder="PHONE NUMBER" className="w-full pl-14 pr-8 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500 transition-all placeholder:text-zinc-700 text-sm" />
            </div>
            <div className="space-y-2 relative group">
              <div className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">
                <Lock className="w-4 h-4" />
              </div>
              <input required type="password" value={passwordInput} onChange={(e) => onPasswordChange(e.target.value)} placeholder="SET PASSWORD" autoCapitalize="none" autoCorrect="off" spellCheck={false} className="w-full pl-14 pr-8 py-5 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500 transition-all placeholder:text-zinc-700 text-sm" />
            </div>
            <button 
              type="submit" 
              className="w-full mt-2 px-8 py-5 bg-white text-black font-black uppercase text-base hover:bg-emerald-500 transition-all rounded-2xl shadow-xl active:scale-95 touch-manipulation"
            >
              {t("auth.send_otp")}
            </button>
            <button 
              type="button" 
              onClick={() => onAuthViewChange("LOGIN")}
              className="w-full py-6 text-sm font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors touch-manipulation"
            >
              BACK TO LOGIN
            </button>
          </form>
        )}

        {authView === "OTP" && (
          <form onSubmit={onVerifyOtp} className="space-y-6 pt-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
              <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest leading-relaxed">
                ENTER OTP CODE SENT TO <br />
                <span className="text-white">{phoneInput}</span>
              </p>
            </div>
            <input required type="text" maxLength={4} value={otpInput} onChange={(e) => onOtpChange(e.target.value)} placeholder="0000" className="w-full py-6 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none text-white font-black text-4xl text-center tracking-[0.5em] focus:border-emerald-500 transition-all" />
            <button 
              type="submit" 
              className="w-full px-8 py-5 bg-emerald-500 text-black font-black uppercase text-base hover:bg-white transition-all rounded-2xl shadow-xl active:scale-95 touch-manipulation"
            >
              VERIFY
            </button>
          </form>
        )}

        {authView !== "OTP" && (
          <div className="space-y-4 pt-4">
            <DisabledSocialButtons />
            <button 
              type="button" 
              onClick={onBypass}
              className="w-full py-5 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-black transition-all touch-manipulation"
            >
              [ BYPASS ADMIN LOGIN ]
            </button>
          </div>
        )}

        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest pt-8">
          STAKEWISE TERMINAL v{versionInfo.version} - UPDATED {formattedLastUpdated}
        </p>
      </div>
    </div>
  );
};
