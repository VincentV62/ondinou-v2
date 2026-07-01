
# Refonte du quiz ONDINOU

## 1. Nouveau modèle de questions (`src/data/quiz.ts`)

Nouveau fichier centralisant :
- Les 17 questions (Q1–Q17) avec `id`, `title`, `options`, type (`single` / `dropdown` / `date` / `conditional`).
- La logique conditionnelle Q4 (options dépendant de Q3).
- Les 3 modes de quiz :
  - `hungry` → Q1–Q7
  - `occasion` → Q1–Q7 + 5 aléatoires parmi Q8–Q17
  - `full` → Q1–Q7 + 8 aléatoires parmi Q8–Q17
- Type `QuizAnswers = Record<string, string>` (clé = id question).

## 2. Écran d'accueil du quiz

Ajout d'un écran intro dans `QuizPage.tsx` (avant Q1) proposant les 3 modes sous forme de cartes cliquables. Le mode sélectionné est stocké en `sessionStorage` et détermine la liste des questions à parcourir.

## 3. Refonte de `QuizPage.tsx`

- Suppression des anciennes questions codées en dur.
- Boucle générique sur la liste de questions du mode.
- Rendu par type : boutons single-choice, menu déroulant (Q2 nombre + cases enfants), date-picker (Q1 "date précise"), gestion Q4 conditionnelle (skip si Q3 = "Peu importe").
- Barre de progression + navigation ← / →.
- À la fin → `sessionStorage.setItem("quizAnswers", …)` + navigate `/result`.

## 4. Nouveau moteur de matching (`src/data/restaurants.ts`)

- Nouvelle fonction `matchRestaurants(answers, mode)` basée sur la catégorisation Créateur (une réponse par question par resto), stockée dans `localStorage` sous `restoCategorization` (map `restoId → { q1: option, q2: option, ... }`).
- Score = nombre de réponses identiques entre le profil resto et les réponses du user, pondéré par l'importance (Q3/Q4 cuisine ×3, Q7 budget ×2, Q6 distance filtre dur).
- Fallback : anciens champs (`foodType`, `budget`, `ambiance`) pour les restos non catégorisés.

## 5. Refonte de `ResultPage.tsx`

- Affiche la meilleure recommandation.
- Bouton **"Voir une autre suggestion"** → passe au suivant dans la liste triée.
- Si la liste est épuisée ET que le mode = `full` (17 questions posées) → affiche une **liste + carte interactive** de tous les restos correspondants (réutilise `MyRestosMap`).

## 6. Page Créateur — ajout de la section catégorisation

Sous le formulaire existant (inchangé), ajout d'une nouvelle section :
- Sélecteur du resto à catégoriser (dropdown : base locale + base DB).
- Affichage des 17 questions.
- Pour chaque question, boutons options en **single-select** (une seule réponse par question, surbrillance accent sur la réponse choisie).
- Q4 : rendu conditionnel selon Q3 sélectionnée pour ce resto.
- Sauvegarde dans `localStorage["restoCategorization"]` (map par resto).
- Bouton "Enregistrer la catégorisation".

## Détails techniques

- **Persistance catégorisation** : `localStorage` (pas de migration DB pour cette itération — évite de toucher au schema Supabase).
- **Random sampling** : Fisher-Yates sur Q8–Q17, seed par `sessionStorage` pour ne pas rechanger à chaque re-render.
- **i18n** : nouveaux textes ajoutés dans `src/data/i18n.ts` (FR uniquement pour l'instant, EN garde les anciennes clés que le quiz n'utilise plus).
- **Compat** : suppression de l'ancien `QuizAnswers` typé → passage à `Record<string,string>`. `ResultPage` et `matchRestaurants` mis à jour en conséquence.

## Fichiers modifiés / créés

- ✏️ `src/pages/QuizPage.tsx` — refonte complète
- ✏️ `src/pages/ResultPage.tsx` — bouton "autre suggestion", fallback carte
- ✏️ `src/pages/CreatorPage.tsx` — section catégorisation en bas
- ✏️ `src/data/restaurants.ts` — nouveau `matchRestaurants` + `QuizAnswers`
- 🆕 `src/data/quiz.ts` — 17 questions + modes
