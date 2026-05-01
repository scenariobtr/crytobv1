"use client";

import React, { createContext, useContext, ReactNode, useCallback, useSyncExternalStore } from "react";
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

const translations: Record<Language, LocaleType> = { EN: en, TH: th };
const LANGUAGE_STORAGE_KEY = "app_lang";
const LANGUAGE_CHANGE_EVENT = "stakewise-language-change";

const isLanguage = (value: string | null): value is Language => value === "EN" || value === "TH";

const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return "EN";
  const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isLanguage(savedLang) ? savedLang : "EN";
};

const subscribeToLanguage = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  };
};

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const lang = useSyncExternalStore<Language>(subscribeToLanguage, getStoredLanguage, () => "EN");

  const setLang = useCallback((newLang: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  }, []);

  // ใช้ useCallback เพื่อให้ฟังก์ชัน t ไม่เปลี่ยน Reference บ่อยๆ
  const t = useCallback((path: string): string => {
    const keys = path.split(".");
    let current: unknown = translations[lang];

    for (const key of keys) {
      if (!current || typeof current !== "object" || !(key in current)) {
        return path; 
      }
      current = (current as Record<string, unknown>)[key];
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
  return context;
};
