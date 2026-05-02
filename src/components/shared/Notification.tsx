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
      className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex justify-center px-4 animate-in fade-in slide-in-from-top-3 duration-300 sm:justify-end sm:pr-6"
    >
      <div 
        id={`shared-notify-container-${type.toLowerCase()}`}
        className={`pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border p-5 shadow-2xl animate-in zoom-in duration-500 sm:p-6 ${current.bg} ${current.border}`}
      >
        <span id={`lbl-notify-id-tag-${type.toLowerCase()}`} className="absolute top-1 left-2 text-[6px] text-neutral-500 font-mono">ID: notify-{type.toLowerCase()}</span>
        
        <div id={`cont-notify-progress-bg-${type.toLowerCase()}`} className="absolute bottom-0 left-0 h-1 w-full opacity-30">
          <div id={`cont-notify-progress-bar-${type.toLowerCase()}`} className={`h-full ${current.progress} animate-progress-shrink`}></div>
        </div>

        <div id={`cont-notify-content-${type.toLowerCase()}`} className="flex items-center gap-4 text-left">
          <div id={`cont-notify-icon-box-${type.toLowerCase()}`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5">
            {current.icon}
          </div>
          <h4 id={`txt-notify-message-${type.toLowerCase()}`} className="min-w-0 flex-1 text-xs font-black uppercase tracking-widest text-white sm:text-sm">{message}</h4>
          <button 
            id={`btn-notify-close-${type.toLowerCase()}`}
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Dismiss notification"
          >
            <X id={`icon-notify-close-x-${type.toLowerCase()}`} className="h-4 w-4" />
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
