import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      Search: "Search datasets, models, benchmarks,…",
      SearchShort: "Search",
      "Welcome back": "Welcome back",
      "We've missed you": "We've missed you",
    },
  },
  fr: {
    translation: {
      Search: "Rechercher…",
      SearchShort: "Rechercher",
      "Welcome back": "Bon retour",
      "We've missed you": "Tu nous as manqué",
    },
  },
  de: {
    translation: {
      Search: "Suchen…",
      SearchShort: "Suchen",
      "Welcome back": "Willkommen zurück",
      "We've missed you": "Wir haben dich vermisst",
    },
  },
  nl: {
    translation: {
      Search: "Zoeken…",
      SearchShort: "Zoeken",
      "Welcome back": "Welkom terug",
      "We've missed you": "We hebben je gemist",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
