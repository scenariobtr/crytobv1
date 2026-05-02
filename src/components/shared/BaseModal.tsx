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
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/95 p-3 backdrop-blur-xl animate-in fade-in duration-300 sm:items-center sm:p-4"
    >
      <div 
        id={`modal-container-${id}`}
        className={`relative max-h-[92dvh] w-full overflow-y-auto border border-neutral-800 bg-neutral-950 p-5 animate-in zoom-in duration-300 rounded-3xl sm:p-8 md:p-10 ${sizeClasses[size]}`}
      >
        <button 
          id={`btn-modal-close-${id}`}
          onClick={onClose} 
          className="absolute right-4 top-4 rounded-xl p-2 text-neutral-500 transition-colors hover:bg-white/5 hover:text-white sm:right-6 sm:top-6"
        >
          <X id={`icon-modal-close-x-${id}`} className="w-5 h-5" />
        </button>
        
        <h3 id={`txt-modal-title-${id}`} className="mb-6 flex items-start gap-3 pr-12 text-base font-black uppercase tracking-widest text-white sm:mb-10 sm:text-xl">
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
