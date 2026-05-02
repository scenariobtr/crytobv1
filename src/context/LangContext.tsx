"use client";

import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from "react";
import { en, LocaleType } from "@/locales/en";
import { th } from "@/locales/th";

type Language = "EN" | "TH";

interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "EN",
  setLang: () => {},
  t: (path: string) => path,
});

const translations: Record<Language, LocaleType> = { EN: en, TH: th };
const LANGUAGE_STORAGE_KEY = "app_lang";
const LANGUAGE_CHANGE_EVENT = "stakewise-language-change";

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>("EN");

  // Initial load
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLang === "EN" || savedLang === "TH") {
        setLangState(savedLang);
      }
    } catch (err) {
      console.warn("Lang initialization failed", err);
    }
  }, []);

  // Listen for changes
  useEffect(() => {
    const handleStorage = () => {
      try {
        const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLang === "EN" || savedLang === "TH") {
          setLangState(savedLang);
        }
      } catch (err) { /* ignore */ }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleStorage);
    };
  }, []);

  const setLang = useCallback((newLang: Language) => {
    try {
      setLangState(newLang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
    } catch (err) {
      console.warn("Could not save language preference:", err);
    }
  }, []);

  const t = useCallback((path: string) => {
    const keys = path.split(".");
    let current: any = translations[lang];
    
    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = current[key];
      } else {
        return path;
      }
    }
    
    return typeof current === "string" ? current : path;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LangContext);
  if (!context) {
    // Return fallback if context is missing (prevents crash)
    return { lang: "EN" as const, setLang: () => {}, t: (p: string) => p };
  }
  return context;
};
