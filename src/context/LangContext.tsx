"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { en, LocaleType } from "@/locales/en";
import { th } from "@/locales/th";

type Language = "EN" | "TH";

interface LangContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string) => string;
}

// สร้าง Default Context เพื่อป้องกัน Error "t is not a function"
const LangContext = createContext<LangContextType>({
  lang: "EN",
  setLang: () => {},
  t: (path: string) => path,
});

const translations: Record<Language, any> = { EN: en, TH: th };

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>("EN");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as Language;
    if (savedLang && (savedLang === "EN" || savedLang === "TH")) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
  }, []);

  // ใช้ useCallback เพื่อให้ฟังก์ชัน t ไม่เปลี่ยน Reference บ่อยๆ
  const t = useCallback((path: string): string => {
    const keys = path.split(".");
    let current = translations[lang];

    if (!current) return path;

    for (const key of keys) {
      if (!current || current[key] === undefined) {
        return path; 
      }
      current = current[key];
    }

    return current as unknown as string;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LangContext);
  return context;
};
