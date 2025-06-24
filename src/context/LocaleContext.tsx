"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import en from "../locales/en";
import ru from "../locales/ru";

const translations = { en, ru };

export type Locale = keyof typeof translations;

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof en) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("ru");
  const t = (key: keyof typeof en) => translations[locale][key] || translations.en[key];

  console.log('locale is', locale)

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};


export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
};
