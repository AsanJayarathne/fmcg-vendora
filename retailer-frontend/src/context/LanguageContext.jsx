import { createContext, useContext, useState, useEffect, useCallback } from "react";
import en from "../locales/en";
import si from "../locales/si";

const dictionaries = { en, si };

export const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (path, fallback) => fallback || path,
  isSinhala: false,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem("vendora_language");
      return stored === "si" ? "si" : "en";
    } catch {
      return "en";
    }
  });

  const setLanguage = useCallback((lang) => {
    const validLang = lang === "si" ? "si" : "en";
    setLanguageState(validLang);
    try {
      localStorage.setItem("vendora_language", validLang);
      document.documentElement.lang = validLang;
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "si" : "en");
  }, [language, setLanguage]);

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  const t = useCallback(
    (path, fallback = "", params = null) => {
      if (!path) return fallback || "";

      const keys = path.split(".");
      
      // Look up in selected language dictionary
      let current = dictionaries[language];
      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          current = undefined;
          break;
        }
      }

      // Fallback to English dictionary if key missing in Sinhala
      if (current === undefined || current === null) {
        let fallbackCurrent = dictionaries.en;
        for (const k of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === "object" && k in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[k];
          } else {
            fallbackCurrent = undefined;
            break;
          }
        }
        current = fallbackCurrent;
      }

      let result = current !== undefined && current !== null && typeof current === "string" 
        ? current 
        : (fallback || path);

      // Interpolate parameters e.g. {amount} or {count}
      if (params && typeof params === "object") {
        Object.entries(params).forEach(([key, val]) => {
          result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
        });
      }

      return result;
    },
    [language]
  );

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isSinhala: language === "si",
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export default LanguageProvider;
