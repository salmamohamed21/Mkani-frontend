import React, { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, toggleLanguage } = useContext(LanguageContext);

  return (
    <button
      onClick={toggleLanguage}
      className="text-sm font-medium px-3 py-1 border rounded-md hover:bg-gray-100"
    >
      {lang === "ar" ? "EN" : "عربي"}
    </button>
  );
}
