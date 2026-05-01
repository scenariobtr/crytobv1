"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Zap, X } from "lucide-react";

export type NotifyType = "SUCCESS" | "ERROR" | "INFO";

interface NotificationProps {
  isOpen: boolean;
  message: string;
  type: NotifyType;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ isOpen, message, type, onClose }) => {
  if (!isOpen) return null;

  const config = {
    SUCCESS: {
      bg: "bg-emerald-950",
      border: "border-emerald-500",
      icon: <CheckCircle2 id="icon-notify-success" className="w-6 h-6 text-emerald-500" />,
      progress: "bg-emerald-500"
    },
    ERROR: {
      bg: "bg-red-950",
      border: "border-red-500",
      icon: <AlertTriangle id="icon-notify-error" className="w-6 h-6 text-red-500" />,
      progress: "bg-red-500"
    },
    INFO: {
      bg: "bg-neutral-900",
      border: "border-neutral-700",
      icon: <Zap id="icon-notify-info" className="w-6 h-6 text-white" />,
      progress: "bg-white"
    }
  };

  const current = config[type];

  return (
    <div 
      id={`shared-notify-overlay-${type.toLowerCase()}`}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div 
        id={`shared-notify-container-${type.toLowerCase()}`}
        className={`w-full max-w-sm p-8 border shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-500 relative overflow-hidden ${current.bg} ${current.border}`}
      >
        <span id={`lbl-notify-id-tag-${type.toLowerCase()}`} className="absolute top-1 left-2 text-[6px] text-neutral-500 font-mono">ID: notify-{type.toLowerCase()}</span>
        
        <div id={`cont-notify-progress-bg-${type.toLowerCase()}`} className="absolute bottom-0 left-0 h-1 w-full opacity-30">
          <div id={`cont-notify-progress-bar-${type.toLowerCase()}`} className={`h-full ${current.progress} animate-progress-shrink`}></div>
        </div>

        <div id={`cont-notify-content-${type.toLowerCase()}`} className="flex flex-col items-center text-center space-y-4">
          <div id={`cont-notify-icon-box-${type.toLowerCase()}`} className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5">
            {current.icon}
          </div>
          <h4 id={`txt-notify-message-${type.toLowerCase()}`} className="text-sm font-black uppercase tracking-widest text-white">{message}</h4>
          <button 
            id={`btn-notify-close-${type.toLowerCase()}`}
            onClick={onClose}
            className="text-[10px] font-black uppercase text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <X id={`icon-notify-close-x-${type.toLowerCase()}`} className="w-3 h-3" /> Dismiss
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes progress-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress-shrink {
          animation: progress-shrink 3s linear forwards;
        }
      `}</style>
    </div>
  );
};
