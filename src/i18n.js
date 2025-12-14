import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationEN from './locales/en/translation.json';
import translationRW from './locales/rw/translation.json';
import translationFR from './locales/fr/translation.json';

// Translation resources
const resources = {
    en: {
        translation: translationEN
    },
    rw: {
        translation: translationRW
    },
    fr: {
        translation: translationFR
    }
};

i18n
    // Detect user language
    .use(LanguageDetector)
    // Pass the i18n instance to react-i18next
    .use(initReactI18next)
    // Initialize i18next
    .init({
        resources,
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',

        interpolation: {
            escapeValue: false // React already escapes values
        },

        // Language detector options
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
