import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/eng.json';
import translationVN from './locales/vn.json';
import translationCH from './locales/ch.json';

const language = JSON.parse(localStorage.getItem("language")) || "vn";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: translationEN },
            vn: { translation: translationVN },
            ch: { translation: translationCH }
        },
        lng: language,
        fallbackLng: 'vn',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;