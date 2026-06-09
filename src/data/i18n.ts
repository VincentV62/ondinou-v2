const translations: Record<string, Record<string, string>> = {
  fr: {
    splash_greeting: "Bonjour, je suis Dinou,\net je vais t'aider à trouver le restaurant dont tu as envie !",
    splash_cta: "C'est parti !",
    geo_ask: "Pour te proposer les meilleurs restaurants autour de toi, ONDINOU aimerait utiliser ta localisation.",
    geo_allow: "Autoriser",
    geo_deny: "Refuser",
    when_title: "Quand veux-tu aller manger ?",
    continue: "Continuer",
    q1: "Vous serez combien à table ?",
    q2: "Tu bouges comment ?",
    q3: "Tu veux rester dans le coin ou t'éloigner un peu ?",
    q4: "Quel budget par personne ?",
    q5: "Plutôt quoi ?",
    q6: "Ambiance ?",
    q7: "Terrasse ?",
    q8: "Nouveau spot ou valeur sûre ?",
    q9: "Un dernier détail ?",
    result_title: "Ton restaurant parfait :",
    reserve: "Réserver la table",
    view_map: "Voir sur la carte",
    change: "Changer de restaurant",
    today: "Aujourd'hui",
    tomorrow: "Demain",
    next7: "7 prochains jours",
  },
  en: {
    splash_greeting: "Hi, I'm Dinou,\nand I'll help you find the restaurant you're craving!",
    splash_cta: "Let's go!",
    geo_ask: "To suggest the best restaurants near you, ONDINOU would like to use your location.",
    geo_allow: "Allow",
    geo_deny: "Deny",
    when_title: "When do you want to eat?",
    continue: "Continue",
    q1: "How many guests?",
    q2: "How are you getting there?",
    q3: "Stay nearby or go further?",
    q4: "What's your budget per person?",
    q5: "What are you in the mood for?",
    q6: "What vibe?",
    q7: "Outdoor seating?",
    q8: "New spot or a classic?",
    q9: "One last detail?",
    result_title: "Your perfect restaurant:",
    reserve: "Reserve a table",
    view_map: "View on map",
    change: "Change restaurant",
    today: "Today",
    tomorrow: "Tomorrow",
    next7: "Next 7 days",
  },
};

let currentLang = "fr";
const stored = typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;
if (stored && ["fr", "en"].includes(stored)) {
  currentLang = stored;
} else {
  const browserLang = navigator.language.slice(0, 2);
  if (["fr", "en"].includes(browserLang)) currentLang = browserLang;
}

export function t(key: string): string {
  return translations[currentLang]?.[key] || translations.fr[key] || key;
}

export function getLang(): string {
  return currentLang;
}

export function setLang(lang: string) {
  currentLang = lang;
  if (typeof localStorage !== "undefined") localStorage.setItem("lang", lang);
}
