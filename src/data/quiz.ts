// Quiz definitions for ONDINOU

export type QuizMode = "hungry" | "occasion" | "full";

export interface Question {
  id: string;              // q1..q17
  title: string;
  type: "single" | "multi" | "guests" | "date";
  options: string[];       // for "single" / "multi"
  conditional?: {          // Q4 depends on Q3
    dependsOn: string;
    optionsMap: Record<string, string[]>;
    skipIf?: string[];     // Q3 values that skip Q4
  };
}


export const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "Quand veux-tu aller manger ?",
    type: "date",
    options: ["Aujourd'hui", "Demain", "Ce week-end", "Dans la semaine", "Choisir une date précise"],

  },
  {
    id: "q2",
    title: "Vous serez combien à table ?",
    type: "guests",
    options: Array.from({ length: 20 }, (_, i) => String(i + 1)).concat(["20+"]),
  },
  {
    id: "q3",
    title: "Quel type de cuisine vous fait envie ?",
    type: "single",
    options: [
      "Cuisine française et du terroir",
      "Cuisine italienne et méditerranéenne",
      "Cuisine asiatique",
      "Viandes, grillades & plats généreux",
      "Poissons, fruits de mer & produits de la mer",
      "Cuisine créative & tendance",
      "Peu importe - Surprends-moi",
    ],
  },
  {
    id: "q4",
    title: "Et plus précisément ?",
    type: "single",
    options: [],
    conditional: {
      dependsOn: "q3",
      skipIf: ["Peu importe - Surprends-moi"],
      optionsMap: {
        "Cuisine française et du terroir": [
          "Estaminet & cuisine du Nord",
          "Brasserie traditionnelle",
          "Bistronomique",
          "Gastronomique & semi-gastronomique",
          "Cave à manger & bistrot à vins",
          "Peu importe",
        ],
        "Cuisine italienne et méditerranéenne": [
          "Trattoria & pasta",
          "Pizzeria artisanale",
          "Cuisine espagnole & tapas",
          "Cuisine grecque & chypriote",
          "Cuisine libanaise & levantine",
          "Peu importe",
        ],
        "Cuisine asiatique": [
          "Japonaise (sushis, ramen, izakaya)",
          "Chinoise (dim sum, cantonais, sichuan)",
          "Thaïlandaise & sud-est asiatique",
          "Coréenne (BBQ, bibimbap)",
          "Indienne & pakistanaise",
          "Peu importe",
        ],
        "Viandes, grillades & plats généreux": [
          "Steakhouse & viandes maturées",
          "BBQ & grillades",
          "Burgers artisanaux",
          "Boucherie-restaurant & bistrot carnivore",
          "Cuisine du monde autour de la viande",
          "Peu importe",
        ],
        "Poissons, fruits de mer & produits de la mer": [
          "Plateau de fruits de mer",
          "Poissonnerie & cuisine de la mer",
          "Bar à huîtres & vins blancs",
          "Sushi bar & cuisine maritime japonaise",
          "Cuisine nordique & maritime",
          "Peu importe",
        ],
        "Cuisine créative & tendance": [
          "Bistronomique moderne & cuisine de saison",
          "Fusion & métissage culinaire",
          "Végétal & plant-based gastronomique",
          "Small plates & bar à manger",
          "Street food gastronomique",
          "Peu importe",
        ],
      },
    },
  },
  {
    id: "q5",
    title: "Comment vous déplacez-vous ?",
    type: "single",
    options: ["À pied", "En voiture", "En transports en commun", "En vélo ou trottinette", "En taxi ou VTC"],
  },
  {
    id: "q6",
    title: "Jusqu'où êtes-vous prêts à aller ?",
    type: "single",
    options: ["5 minutes", "10 minutes", "30 minutes", "Peu importe la distance"],
  },
  {
    id: "q7",
    title: "Quel est votre budget par personne ?",
    type: "single",
    options: ["Moins de 15 €", "15 € - 30 €", "30 € - 50 €", "50 € - 80 €", "80 € et plus"],
  },
  {
    id: "q8",
    title: "C'est quel type de repas ?",
    type: "single",
    options: [
      "Dîner romantique ou en tête-à-tête",
      "Repas en famille avec enfants",
      "Sortie entre amis",
      "Déjeuner ou dîner professionnel",
      "Fête ou célébration",
      "Repas du quotidien",
    ],
  },
  {
    id: "q9",
    title: "Quelle ambiance vous correspond ?",
    type: "single",
    options: ["Intime et cosy", "Animé et festif", "Chic et élégant", "Décontracté et convivial", "Original ou atypique"],
  },
  {
    id: "q10",
    title: "Y a-t-il des contraintes alimentaires à table ?",
    type: "single",
    options: ["Aucune contrainte", "Végétarien ou vegan", "Halal ou casher", "Intolérance ou allergie", "Plusieurs régimes différents"],
  },
  {
    id: "q11",
    title: "La terrasse, c'est important ?",
    type: "single",
    options: ["Grande terrasse - c'est prioritaire", "Un coin terrasse serait sympa", "Intérieur uniquement"],
  },
  {
    id: "q12",
    title: "Quel niveau sonore vous convient ?",
    type: "single",
    options: ["Calme", "Fond sonore agréable", "Ambiance animée et festive", "Peu importe"],
  },
  {
    id: "q13",
    title: "Vous avez combien de temps pour ce repas ?",
    type: "single",
    options: ["Rapide - moins d'1 heure", "Détendu - 1h30 à 2h", "On risque d'y passer la soirée", "Peu importe"],
  },
  {
    id: "q14",
    title: "Quel style d'établissement vous correspond ?",
    type: "single",
    options: ["Bistrot ou brasserie", "Bistronomique", "Gastronomique", "Bar à manger ou tapas", "Peu importe"],
  },
  {
    id: "q15",
    title: "Vous cherchez plutôt…",
    type: "single",
    options: ["Une découverte", "Une valeur sûre", "Un restaurant déjà essayé et apprécié", "Peu importe"],
  },
  {
    id: "q16",
    title: "Un critère spécifique à ajouter ?",
    type: "single",
    options: ["Salle privatisable", "Parking à proximité", "Menu enfants", "Belle carte des vins ou cocktails", "Rien de particulier"],
  },
  {
    id: "q17",
    title: "Un dernier point ?",
    type: "single",
    options: ["Accessibilité PMR", "Tickets restaurant acceptés", "Je veux pouvoir réserver ce soir", "Rien à ajouter"],
  },
  {
    id: "q_allergies",
    title: "Quelles allergies ?",
    type: "multi",
    options: [
      "Gluten",
      "Crustacés",
      "Œufs",
      "Poisson",
      "Cacahuètes / arachides",
      "Soja",
      "Lait",
      "Noix / Fruits à coque",
      "Céleri",
      "Moutarde",
      "Graines de sésame",
      "Dioxyde de soufre et sulfites",
      "Lupin",
      "Mollusques",
    ],
  },
];

export const ALLERGY_TRIGGER = "Intolérance ou allergie";


export const CORE_IDS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];
export const OPTIONAL_IDS = ["q8", "q9", "q10", "q11", "q12", "q13", "q14", "q15", "q16", "q17"];

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuestionOrder(mode: QuizMode): string[] {
  if (mode === "hungry") return [...CORE_IDS];
  const nExtra = mode === "occasion" ? 5 : 8;
  const extras = shuffle(OPTIONAL_IDS).slice(0, nExtra);
  const orderedExtras = OPTIONAL_IDS.filter((id) => extras.includes(id));
  return [...CORE_IDS, ...orderedExtras];
}

export const CATEGORIZATION_KEY = "restoCategorization";

export type RestoCategorization = Record<string, Record<string, string>>;
// restoId -> { q1: option, q3: option, ... }

export function loadCategorizations(): RestoCategorization {
  try {
    return JSON.parse(localStorage.getItem(CATEGORIZATION_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveCategorization(restoId: string, cat: Record<string, string>) {
  const all = loadCategorizations();
  all[restoId] = cat;
  localStorage.setItem(CATEGORIZATION_KEY, JSON.stringify(all));
}
