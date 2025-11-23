import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tr from "./locales/tr.json"; // Oluşturduğumuz json dosyasını çağırıyoruz

i18n.use(initReactI18next).init({
    resources: {
        tr: { translation: tr }
    },
    lng: "tr", // Başlangıç dili
    fallbackLng: "tr",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;