import i18n from 'i18next';
import { initReactI18next  } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translateEN from './locales/en.json';
import translateSP from './locales/sp.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next )
    .init({
        resources: {
            en: { translation: translateEN },
            sp: { translation: translateSP }
        },
        fallbackLng: 'en',
        interpolation:{
            escapeValue: false,  //react already handles escaping
        } 
    })

export default i18n;