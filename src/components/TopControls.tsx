import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { getLang, setLang } from "@/data/i18n";

const TopControls = () => {
  const [lang, setLangState] = useState<string>(getLang());
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleLang = () => {
    const next = lang === "fr" ? "en" : "fr";
    setLang(next);
    setLangState(next);
    // Reload so all translated strings refresh across the app
    window.location.reload();
  };

  return (
    <div className="fixed top-3 left-0 right-0 z-50 flex justify-between px-4 pointer-events-none">
      <button
        onClick={toggleLang}
        className="pointer-events-auto w-10 h-10 rounded-full bg-card/90 backdrop-blur border border-border shadow-md flex items-center justify-center text-lg hover:scale-105 transition-transform"
        aria-label="Change language"
        title={lang === "fr" ? "Switch to English" : "Passer en français"}
      >
        <span>{lang === "fr" ? "🇬🇧" : "🇫🇷"}</span>
      </button>
      <button
        onClick={() => setDark((d) => !d)}
        className="pointer-events-auto w-10 h-10 rounded-full bg-card/90 backdrop-blur border border-border shadow-md flex items-center justify-center text-foreground hover:scale-105 transition-transform"
        aria-label="Toggle theme"
        title={dark ? "Mode clair" : "Mode sombre"}
      >
        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default TopControls;
