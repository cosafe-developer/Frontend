// Import Dependencies
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Local Imports
import { defaultTheme } from "configs/theme.config";
import { safeGetItem } from "utils/safeStorage";

// ----------------------------------------------------------------------

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ["navigator"],
      caches: [],
    },
    fallbackLng: defaultTheme.fallbackLang,
    lng: safeGetItem("i18nextLng", defaultTheme.defaultLang),
    supportedLngs: ["en", "es", "ar", "zh-cn"],
    ns: ["translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false,
    },
    lowerCaseLng: true,
    debug: false,
  }).languages = ["en", "es", "ar", "zh-cn"];

export default i18n
