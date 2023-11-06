import App from "./App";
import ChainedBackend from "i18next-chained-backend";
import HttpBackend from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";
import { Provider } from "react-redux";
// import React from 'react'
import ReactDOM from "react-dom/client";
import { getBackEndUrl } from "./constant";
import i18n from "i18next";
import { initData } from "./api/auth/helper";
import { initReactI18next } from "react-i18next";
import store from "./stores";

i18n
  .use(ChainedBackend)
  .use(initReactI18next)
  .init({
    lng: "vi", // if you're using a language detector, do not define the lng option
    fallbackLng: "vi",
    backend: {
      backends: [LocalStorageBackend, HttpBackend],
      backendOptions: [
        {
          expirationTime:
            import.meta.env.MODE === "development"
              ? 1 * 24 * 60 * 60 * 1000 // 1 day
              : 7 * 24 * 60 * 60 * 1000, // 7 days
          defaultVersion: "v0.0.4"
        },
        {
          loadPath: getBackEndUrl() + "api/translations/{{lng}}/{{ns}}"
        }
      ]
    },
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
initData();
