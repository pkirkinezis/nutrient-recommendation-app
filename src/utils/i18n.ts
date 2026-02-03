import en from "../data/i18n/en.json";
import el from "../data/i18n/el.json";

export type Language = "en" | "el";

type TranslationKeys = keyof typeof en;

const translations: Record<Language, Record<TranslationKeys, string>> = {
  en,
  el,
};

export const getTranslation = (language: Language, key: TranslationKeys): string => {
  return translations[language]?.[key] ?? translations.en[key] ?? String(key);
};
