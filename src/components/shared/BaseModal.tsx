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
  size?: "md" | "lg" | "xl" | "4xl" | "5xl";
}

export const BaseModal: React.FC<BaseModalProps> = ({ id, isOpen, onClose, title, icon, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  };

  return (
    <div 
      id={`modal-overlay-${id}`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
    >
      <div 
        id={`modal-container-${id}`}
        className={`bg-neutral-950 border border-neutral-800 w-full ${sizeClasses[size]} p-10 relative animate-in zoom-in duration-300 rounded-[32px]`}
      >
        <button 
          id={`btn-modal-close-${id}`}
          onClick={onClose} 
          className="absolute right-6 top-6 text-neutral-500 hover:text-white transition-colors"
        >
          <X id={`icon-modal-close-x-${id}`} className="w-5 h-5" />
        </button>
        
        <h3 id={`txt-modal-title-${id}`} className="text-xl font-black uppercase tracking-widest mb-10 flex items-center gap-3 text-white">
          <span id={`cont-modal-icon-${id}`}>{icon}</span>
          <span id={`lbl-modal-title-txt-${id}`}>{title}</span>
        </h3>

        <div id={`modal-content-wrapper-${id}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
