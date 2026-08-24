// MODE TEST — génération du texte Dinou par LLM (prompt v1).
// Bloc de test isolé : à retirer / remplacer lors de l'injection en V1.
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getQuestion } from "@/data/quiz";
import type { Restaurant } from "@/data/restaurants";

const FALLBACK_TEXT = "Ta table t'attend, régale-toi.";

export interface DinouPayload {
  utilisateur: {
    prenom: string | null;
    quiz_reponses: { question: string; reponse: string }[];
    profil_declare: { regime_confirme_restaurant: string | null };
  };
  restaurant: {
    nom: string;
    cuisine: string;
    tags: string[];
    distance_m: number | null;
    budget_reformulable: string | null;
    regime_confirme: string | null;
  };
  rang_recommandation: number;
  qualite_match: { niveau: "fort" | "partiel"; critere_divergent: string | null };
  historique_session: { textes_precedents_resumes: string[] };
}

function parseDistanceM(distance: string): number | null {
  if (!distance) return null;
  const km = distance.match(/([\d.,]+)\s*km/i);
  if (km) return Math.round(parseFloat(km[1].replace(",", ".")) * 1000);
  const m = distance.match(/([\d.,]+)\s*m/i);
  if (m) return Math.round(parseFloat(m[1].replace(",", ".")));
  return null;
}

const BUDGET_WORDS: Record<number, string> = {
  1: "abordable",
  2: "intermédiaire",
  3: "haut de gamme",
};

export function buildDinouPayload(restaurant: Restaurant, index: number): DinouPayload {
  let answers: Record<string, string | string[]> = {};
  try {
    answers = JSON.parse(sessionStorage.getItem("quizAnswers") || "{}");
  } catch {
    answers = {};
  }

  const quiz_reponses = Object.entries(answers)
    .filter(([, v]) => v && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== ""))
    .map(([id, v]) => ({
      question: getQuestion(id)?.title ?? id,
      reponse: Array.isArray(v) ? v.join(", ") : String(v),
    }));

  let prenom: string | null = null;
  try {
    prenom = sessionStorage.getItem("quizFirstName") || localStorage.getItem("profileFirstName") || null;
  } catch {
    prenom = null;
  }

  let historique: string[] = [];
  try {
    historique = JSON.parse(sessionStorage.getItem("dinouTextHistory") || "[]");
  } catch {
    historique = [];
  }

  return {
    utilisateur: {
      prenom,
      quiz_reponses,
      profil_declare: { regime_confirme_restaurant: null },
    },
    restaurant: {
      nom: restaurant.name,
      cuisine: restaurant.cuisine,
      tags: restaurant.tags ?? [],
      distance_m: parseDistanceM(restaurant.distance),
      budget_reformulable: BUDGET_WORDS[restaurant.budget] ?? null,
      regime_confirme: null,
    },
    rang_recommandation: index + 1,
    qualite_match: { niveau: "fort", critere_divergent: null },
    historique_session: { textes_precedents_resumes: historique },
  };
}

interface Props {
  restaurant: Restaurant;
  index: number;
}

const DinouTextTest = ({ restaurant, index }: Props) => {
  const [payload, setPayload] = useState<DinouPayload>(() => buildDinouPayload(restaurant, index));
  const [raw, setRaw] = useState(() => JSON.stringify(buildDinouPayload(restaurant, index), null, 2));
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPayload, setShowPayload] = useState(false);

  useEffect(() => {
    const p = buildDinouPayload(restaurant, index);
    setPayload(p);
    setRaw(JSON.stringify(p, null, 2));
    setText("");
    setError(null);
  }, [restaurant, index]);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setText("");
    let body: DinouPayload = payload;
    try {
      body = JSON.parse(raw);
    } catch {
      setError("Payload JSON invalide.");
      setLoading(false);
      return;
    }
    try {
      const { data, error: fnError } = await supabase.functions.invoke("dinou-text", { body });
      if (fnError) throw fnError;
      const out = (data as { text?: string })?.text?.trim();
      if (!out) {
        setText(FALLBACK_TEXT);
        setError("Réponse vide, texte de repli affiché.");
      } else {
        setText(out);
        try {
          const hist = JSON.parse(sessionStorage.getItem("dinouTextHistory") || "[]");
          hist.push(out.slice(0, 120));
          sessionStorage.setItem("dinouTextHistory", JSON.stringify(hist));
        } catch {
          /* noop */
        }
      }
    } catch (e) {
      setText(FALLBACK_TEXT);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [payload, raw]);

  return (
    <div className="max-w-sm mx-auto w-full mt-6 rounded-2xl border border-dashed border-accent/60 p-4">
      <div className="flex items-center justify-between">
        <p className="font-heading text-xs uppercase tracking-wide text-accent">Mode test · texte Dinou</p>
        <button
          onClick={() => setShowPayload((v) => !v)}
          className="text-xs font-body text-muted-foreground underline"
        >
          {showPayload ? "Masquer le payload" : "Voir le payload"}
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={generate}
          disabled={loading}
          className="flex-1 py-2 rounded-full bg-accent text-accent-foreground font-heading text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Génération…" : "Générer le texte"}
        </button>
        <select
          value={payload.qualite_match.niveau}
          onChange={(e) => {
            const niveau = e.target.value as "fort" | "partiel";
            const next = {
              ...JSON.parse(raw),
              qualite_match: {
                niveau,
                critere_divergent: niveau === "partiel" ? "distance" : null,
              },
            };
            setPayload(next);
            setRaw(JSON.stringify(next, null, 2));
          }}
          className="rounded-full border border-border bg-card text-card-foreground text-xs font-body px-3"
        >
          <option value="fort">match fort</option>
          <option value="partiel">match partiel</option>
        </select>
      </div>

      {text && (
        <p className="mt-3 text-sm font-body text-foreground whitespace-pre-line">{text}</p>
      )}
      {text && (
        <p className="mt-1 text-xs font-body text-muted-foreground">
          {text.trim().split(/\s+/).length} mots
        </p>
      )}
      {error && <p className="mt-2 text-xs font-body text-destructive">{error}</p>}

      {showPayload && (
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
          className="mt-3 w-full h-64 rounded-lg border border-border bg-card text-card-foreground text-[11px] font-mono p-2"
        />
      )}
    </div>
  );
};

export default DinouTextTest;
