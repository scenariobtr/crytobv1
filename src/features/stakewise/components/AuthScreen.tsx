"use client";

import React from "react";
import { Globe, Lock, ShieldCheck, Smartphone, User, Zap } from "lucide-react";

type AuthScreenProps = {
  authView: "LOGIN" | "REGISTER" | "OTP";
  usernameInput: string;
  passwordInput: string;
  phoneInput: string;
  otpInput: string;
  lang: "EN" | "TH";
  onAuthViewChange: (view: "LOGIN" | "REGISTER" | "OTP") => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onOtpChange: (value: string) => void;
  onLogin: () => void;
  onRegister: () => void;
  onVerifyOtp: () => void;
  onToggleLang: () => void;
  t: (path: string) => string;
};

export const AuthScreen: React.FC<AuthScreenProps> = ({
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
}) => {
  const btnStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px 0',
    fontSize: '16px',
    fontWeight: '900',
    textTransform: 'uppercase',
    borderRadius: '12px',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '16px',
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: '12px',
    color: 'white',
    textAlign: 'center',
    fontSize: '16px',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'black', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '24px'
    }}>
      
      {/* Language Button */}
      <button 
        onClick={onToggleLang}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          backgroundColor: '#27272a',
          border: '1px solid #3f3f46',
          borderRadius: '12px',
          color: 'white',
          fontWeight: '900',
          fontSize: '14px',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <Globe size={16} /> {lang}
      </button>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Zap size={48} color="#10b981" style={{ margin: '0 auto 8px' }} />
        <h1 style={{ fontSize: '48px', fontWeight: '900', fontStyle: 'italic', color: 'white' }}>
          STAKE<span style={{ color: '#10b981' }}>WISE</span>
        </h1>
      </div>

      {/* LOGIN FORM */}
      {authView === "LOGIN" && (
        <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" 
            value={usernameInput} 
            onChange={(e) => onUsernameChange(e.target.value)} 
            placeholder="Username"
            style={inputStyle}
          />
          <input 
            type="password" 
            value={passwordInput} 
            onChange={(e) => onPasswordChange(e.target.value)} 
            placeholder="Password"
            style={inputStyle}
          />
          <button 
            onClick={onLogin}
            style={{ ...btnStyle, backgroundColor: '#10b981', color: 'black' }}
          >
            Login
          </button>
          <button 
            onClick={() => onAuthViewChange("REGISTER")}
            style={{ ...btnStyle, backgroundColor: 'transparent', color: '#10b981', border: 'none' }}
          >
            Register
          </button>
        </div>
      )}

      {/* REGISTER FORM */}
      {authView === "REGISTER" && (
        <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" 
            value={usernameInput} 
            onChange={(e) => onUsernameChange(e.target.value)} 
            placeholder="Username"
            style={inputStyle}
          />
          <input 
            type="tel" 
            value={phoneInput} 
            onChange={(e) => onPhoneChange(e.target.value)} 
            placeholder="Phone"
            style={inputStyle}
          />
          <input 
            type="password" 
            value={passwordInput} 
            onChange={(e) => onPasswordChange(e.target.value)} 
            placeholder="Password"
            style={inputStyle}
          />
          <button 
            onClick={onRegister}
            style={{ ...btnStyle, backgroundColor: 'white', color: 'black' }}
          >
            Send OTP
          </button>
          <button 
            onClick={() => onAuthViewChange("LOGIN")}
            style={{ ...btnStyle, backgroundColor: 'transparent', color: '#71717a', border: 'none' }}
          >
            Back
          </button>
        </div>
      )}

      {/* OTP FORM */}
      {authView === "OTP" && (
        <div style={{ width: '100%', maxWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#18181b', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
            <ShieldCheck size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '12px', color: '#a1a1aa' }}>OTP sent to {phoneInput}</p>
          </div>
          <input 
            type="text" 
            maxLength={4} 
            value={otpInput} 
            onChange={(e) => onOtpChange(e.target.value)} 
            placeholder="0000"
            style={{ ...inputStyle, fontSize: '24px', letterSpacing: '8px' }}
          />
          <button 
            onClick={onVerifyOtp}
            style={{ ...btnStyle, backgroundColor: '#10b981', color: 'black' }}
          >
            Verify
          </button>
        </div>
      )}

    </div>
  );
};