"use client";

import React from "react";
import { X } from "lucide-react";

interface BaseModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl" | "4xl" | "5xl" | "full";
}

export const BaseModal: React.FC<BaseModalProps> = ({ id, isOpen, onClose, title, icon, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: "max-w-md",
    lg: "max-w-lg", 
    xl: "max-w-xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  };

  return (
    <div 
      id={`modal-overlay-${id}`}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/95 p-0 backdrop-blur-xl animate-in fade-in duration-300 sm:items-center sm:p-4"
    >
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0 sm:hidden" 
        onClick={onClose}
      />
      
      <div 
        id={`modal-container-${id}`}
        className={`relative w-full overflow-y-auto border-t-2 border-t-emerald-500 bg-neutral-950 p-4 animate-in slide-in-from-bottom duration-300 rounded-t-3xl sm:rounded-3xl sm:border-2 sm:border-neutral-800 sm:p-6 md:p-8 ${sizeClasses[size]} max-h-[90dvh] sm:max-h-[85dvh]`}
      >
        {/* Drag handle for mobile */}
        <div className="hidden sm:flex justify-center mb-2">
          <div className="w-12 h-1.5 bg-zinc-700 rounded-full" />
        </div>
        
        <button 
          id={`btn-modal-close-${id}`}
          onClick={onClose} 
          className="absolute right-3 top-3 rounded-xl p-2.5 text-neutral-500 transition-colors hover:bg-white/10 hover:text-white sm:right-5 sm:top-5 bg-zinc-900 touch-manipulation z-10"
        >
          <X id={`icon-modal-close-x-${id}`} className="w-5 h-5" />
        </button>
        
        <h3 id={`txt-modal-title-${id}`} className="mb-4 flex items-center gap-3 pr-12 text-lg font-black uppercase tracking-wide text-white sm:mb-6 sm:text-xl">
          <span id={`cont-modal-icon-${id}`} className="text-emerald-500">{icon}</span>
          <span id={`lbl-modal-title-txt-${id}`}>{title}</span>
        </h3>

        <div id={`modal-content-wrapper-${id}`} className="pb-safe">
          {children}
        </div>
      </div>
    </div>
  );
};