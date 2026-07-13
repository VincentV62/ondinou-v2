import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import dinouLogo from "@/assets/dinou-logo.png";
import { QUESTIONS, buildQuestionOrder, getQuestion, ALLERGY_TRIGGER, DIETS_TRIGGER, type QuizMode } from "@/data/quiz";

const MODE_META: { id: QuizMode; title: string; desc: string; emoji: string }[] = [
  { id: "hungry", title: "J'ai faim", desc: "Une recommandation directe, tout de suite - 7 questions, environ 1 minute", emoji: "🍽️" },
  { id: "full", title: "Expérience ONDINOU", desc: "Le restaurant fait exactement pour toi - 15 questions, environ 5 minutes", emoji: "🌟" },
  { id: "occasion", title: "Occasion particulière", desc: "Des suggestions adaptées à ton moment - 12 questions, environ 3 minutes", emoji: "✨" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const QuizPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<QuizMode | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showGeoPrompt, setShowGeoPrompt] = useState(false);
  const [pendingAfterGeo, setPendingAfterGeo] = useState<Record<string, string> | null>(null);
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>("");
  const [guests, setGuests] = useState<string>("");
  const [needs, setNeeds] = useState<Record<string, boolean>>({});
  const [multiSel, setMultiSel] = useState<Record<string, boolean>>({});
  const [locationMode, setLocationMode] = useState<"" | "around" | "city">("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [customCity, setCustomCity] = useState<string>("");
  const [showSignup, setShowSignup] = useState(false);
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string> | null>(null);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");

  const handleGeoAllow = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        sessionStorage.setItem("userLat", String(pos.coords.latitude));
        sessionStorage.setItem("userLng", String(pos.coords.longitude));
        sessionStorage.setItem("geoGranted", "true");
        setShowGeoPrompt(false);
        if (pendingAfterGeo) { finishStepInternal(pendingAfterGeo); setPendingAfterGeo(null); }
      },
      () => {
        sessionStorage.setItem("geoGranted", "denied");
        setShowGeoPrompt(false);
        if (pendingAfterGeo) { finishStepInternal(pendingAfterGeo); setPendingAfterGeo(null); }
      }
    );
  };
  const handleGeoDeny = () => {
    sessionStorage.setItem("geoGranted", "denied");
    setShowGeoPrompt(false);
    if (pendingAfterGeo) { finishStepInternal(pendingAfterGeo); setPendingAfterGeo(null); }
  };

  const chooseMode = (m: QuizMode) => {
    const ord = buildQuestionOrder(m);
    setMode(m);
    setOrder(ord);
    setStep(0);
    setAnswers({});
    sessionStorage.setItem("quizMode", m);
    sessionStorage.setItem("quizOrder", JSON.stringify(ord));
  };

  const currentId = order[step];
  const question = useMemo(() => (currentId ? getQuestion(currentId) : undefined), [currentId]);

  const conditionalOptions = useMemo(() => {
    if (!question?.conditional) return null;
    const parent = answers[question.conditional.dependsOn];
    if (!parent) return [];
    if (question.conditional.skipIf?.includes(parent)) return null;
    return question.conditional.optionsMap[parent] ?? [];
  }, [question, answers]);

  useEffect(() => {
    if (question?.conditional && conditionalOptions === null && step < order.length) {
      const t = setTimeout(() => finishStep({}), 0);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, conditionalOptions]);

  const finishStepInternal = useCallback((update: Record<string, string>) => {
    const merged = { ...answers, ...update };
    setAnswers(merged);
    setMultiSel({});
    setLocationMode("");
    setSelectedCity("");
    setCustomCity("");
    let nextOrder = order;
    const q10Val = update["q10"];
    if (currentId === "q10" && q10Val?.startsWith(ALLERGY_TRIGGER) && !order.includes("q_allergies")) {
      nextOrder = [...nextOrder.slice(0, step + 1), "q_allergies", ...nextOrder.slice(step + 1)];
      setOrder(nextOrder);
      sessionStorage.setItem("quizOrder", JSON.stringify(nextOrder));
    }
    if (currentId === "q10" && q10Val === DIETS_TRIGGER && !order.includes("q_diets")) {
      nextOrder = [...nextOrder.slice(0, step + 1), "q_diets", ...nextOrder.slice(step + 1)];
      setOrder(nextOrder);
      sessionStorage.setItem("quizOrder", JSON.stringify(nextOrder));
    }
    if (step >= nextOrder.length - 1) {
      sessionStorage.setItem("quizAnswers", JSON.stringify(merged));
      setFinalAnswers(merged);
      setShowSignup(true);
    } else {
      setDir(1);
      setStep(step + 1);
    }
  }, [answers, step, order, currentId]);

  const finishStep = useCallback((update: Record<string, string>) => {
    // Trigger geo prompt after Q6 answer
    if (currentId === "q6" && !sessionStorage.getItem("geoGranted")) {
      setAnswers((a) => ({ ...a, ...update }));
      setPendingAfterGeo(update);
      setShowGeoPrompt(true);
      return;
    }
    finishStepInternal(update);
  }, [currentId, finishStepInternal]);

  const selectOption = (val: string) => {
    finishStep({ [currentId]: val });
  };

  const confirmMulti = () => {
    const chosen = Object.entries(multiSel).filter(([, v]) => v).map(([k]) => k);
    finishStep({ [currentId]: chosen.join(", ") || "Aucune" });
  };


  const confirmGuests = () => {
    if (!guests) return;
    const suffix = Object.entries(needs).filter(([, v]) => v).map(([k]) => k).join(", ");
    const val = suffix ? `${guests} (${suffix})` : guests;
    finishStep({ [currentId]: val });
  };

  const confirmDate = () => {
    if (!customTime) return;
    const dateLabel = customDate || selectedDateLabel;
    if (!dateLabel) return;
    finishStep({ [currentId]: `${dateLabel} à ${customTime}` });
  };

  const submitSignup = () => {
    if (!signupName.trim() || !signupEmail.trim()) return;
    sessionStorage.setItem("userFirstName", signupName.trim());
    sessionStorage.setItem("userEmail", signupEmail.trim());
    navigate("/result");
  };

  const goBack = () => {
    if (step > 0) { setDir(-1); setStep(step - 1); }
  };

  // -------- Geo prompt (after Q6) --------
  if (showGeoPrompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
        <motion.img src={dinouLogo} alt="Dinou" className="w-28 h-28 object-contain animate-float" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        <motion.div className="mt-6 glass-card rounded-2xl p-6 max-w-sm text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <MapPin className="w-8 h-8 text-accent mx-auto mb-4" />
          <p className="text-foreground font-body text-base leading-relaxed">
            Pour te trouver des restos dans ce périmètre, j'ai besoin de ta localisation 📍
          </p>
        </motion.div>
        <div className="mt-8 flex gap-4">
          <button onClick={handleGeoAllow} className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-heading font-semibold shadow-md">Autoriser</button>
          <button onClick={handleGeoDeny} className="px-6 py-3 rounded-full bg-muted text-muted-foreground font-heading font-semibold">Plus tard</button>
        </div>
      </div>
    );
  }

  // -------- Signup gate before results --------
  if (showSignup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
        <motion.img src={dinouLogo} alt="Dinou" className="w-24 h-24 object-contain animate-float" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        <motion.div className="mt-6 w-full max-w-sm space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-heading font-bold text-foreground text-center">
            Avant de découvrir ta reco…
          </h2>
          <p className="text-sm font-body text-muted-foreground text-center">
            Laisse-moi ton prénom et ton email pour accéder à tes résultats.
          </p>
          <input
            type="text"
            placeholder="Prénom"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-card text-card-foreground border border-border font-body focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="email"
            placeholder="Adresse email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-card text-card-foreground border border-border font-body focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={submitSignup}
            disabled={!signupName.trim() || !signupEmail.trim()}
            className="w-full py-3 rounded-full bg-accent text-accent-foreground font-heading font-semibold shadow-md disabled:opacity-50"
          >
            Voir mes résultats
          </button>
        </motion.div>
      </div>
    );
  }


  // -------- Mode selection --------
  if (!mode) {
    return (
      <div className="flex flex-col min-h-screen bg-background px-6 py-6">
        <div className="flex flex-col items-center">
          <img src={dinouLogo} alt="Dinou" className="w-32 h-32 md:w-40 md:h-40 object-contain animate-float cursor-pointer" onClick={() => navigate("/auth")} />
          <div className="glass-card rounded-2xl px-6 py-4 mt-3 max-w-md">
            <p className="text-foreground text-center font-body text-base md:text-lg">
              Comment veux-tu qu'on trouve ton resto aujourd'hui ? 😋
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-sm space-y-4">
            {MODE_META.map((m) => {
              const isFeatured = m.id === "full";
              return (
                <motion.button
                  key={m.id}
                  onClick={() => chooseMode(m.id)}
                  whileTap={{ scale: 0.97 }}
                  className={`relative w-full rounded-2xl bg-card text-left transition-colors shadow-sm ${
                    isFeatured
                      ? "p-[calc(1.25rem+6px)] border-4 hover:border-accent"
                      : "p-5 border border-border hover:border-accent"
                  }`}
                  style={
                    isFeatured
                      ? {
                          borderColor: "hsl(24, 54%, 53%)",
                          animation: "ondinou-shimmer 2s ease-in-out infinite",
                        }
                      : undefined
                  }
                >
                  {isFeatured && (
                    <span
                      className="absolute -top-2 right-3 px-2.5 py-0.5 rounded-full text-white font-body"
                      style={{ backgroundColor: "hsl(24, 54%, 53%)", fontSize: "12px" }}
                    >
                      Notre choix
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{m.emoji}</span>
                    <div>
                      <div className="font-heading font-semibold text-foreground">{m.title}</div>
                      <div className="text-xs font-body text-muted-foreground mt-0.5">{m.desc}</div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const progress = ((step + 1) / order.length) * 100;

  // Determine options to render
  let renderOptions: string[] = question.options;
  if (question.conditional) {
    if (conditionalOptions === null) return null; // skipping
    renderOptions = conditionalOptions;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-6 overflow-hidden">
      <div className="flex flex-col items-center">
        <img src={dinouLogo} alt="Dinou" className="w-28 h-28 md:w-32 md:h-32 object-contain animate-float cursor-pointer" onClick={() => navigate("/auth")} />
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {step > 0 && (
          <button onClick={goBack} className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full md:px-14 max-w-md mx-auto"
          >
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground text-center mb-6">
              {question.title}
            </h2>

            {question.type === "date" && (
              <div className="space-y-3 max-w-xs mx-auto">
                {question.options.slice(0, -1).map((o) => (
                  <button
                    key={o}
                    onClick={() => { setSelectedDateLabel(o); setCustomDate(""); }}
                    className={`w-full px-4 py-3 rounded-xl text-left font-body border transition-colors ${selectedDateLabel === o ? "bg-accent text-accent-foreground border-accent" : "bg-card text-card-foreground border-border hover:border-accent/50"}`}
                  >
                    {o}
                  </button>
                ))}
                <div className="p-3 rounded-xl border border-border bg-card space-y-2">
                  <label className="text-xs font-body text-muted-foreground">Ou choisir une date précise</label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => { setCustomDate(e.target.value); setSelectedDateLabel(""); }}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border font-body text-sm"
                  />
                </div>
                <div className="p-3 rounded-xl border border-border bg-card space-y-2">
                  <label className="text-xs font-body text-muted-foreground">Quelle heure ?</label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border font-body text-sm"
                  />
                </div>
                <button
                  onClick={confirmDate}
                  disabled={(!customDate && !selectedDateLabel) || !customTime}
                  className="w-full py-3 rounded-full bg-accent text-accent-foreground font-heading font-semibold shadow-md disabled:opacity-50"
                >
                  Continuer
                </button>
              </div>
            )}


            {question.type === "guests" && (
              <div className="max-w-xs mx-auto space-y-4">
                <select value={guests} onChange={(e) => setGuests(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-card text-card-foreground border border-border font-body focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="" disabled>Choisir…</option>
                  {question.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <div className="space-y-2 pt-1">
                  {["Menu enfant", "Chaise haute", "Table à langer"].map((n) => (
                    <label key={n} className="flex items-center justify-between gap-3 cursor-pointer">
                      <span className="font-body text-sm text-foreground">{n}</span>
                      <input type="checkbox" checked={!!needs[n]} onChange={(e) => setNeeds({ ...needs, [n]: e.target.checked })}
                        className="h-5 w-5 rounded border-border accent-[hsl(var(--accent))]" />
                    </label>
                  ))}
                </div>
                {guests && (
                  <button onClick={confirmGuests}
                    className="w-full py-3 rounded-full bg-accent text-accent-foreground font-heading font-semibold text-lg shadow-lg">
                    Continuer
                  </button>
                )}
              </div>
            )}

            {question.type === "single" && (
              <div className="space-y-3 max-w-xs mx-auto">
                {renderOptions.map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => selectOption(option)}
                    className="w-full px-4 py-3 rounded-xl text-left font-body bg-card text-card-foreground border border-border hover:border-accent/50 transition-colors"
                    whileTap={{ scale: 0.97 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}

            {question.type === "multi" && (
              <div className="max-w-xs mx-auto space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option) => (
                    <label key={option} className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-colors ${multiSel[option] ? "bg-accent text-accent-foreground border-accent" : "bg-card text-card-foreground border-border hover:border-accent/50"}`}>
                      <input type="checkbox" checked={!!multiSel[option]} onChange={(e) => setMultiSel({ ...multiSel, [option]: e.target.checked })}
                        className="h-4 w-4 rounded border-border accent-[hsl(var(--accent))]" />
                      <span className="font-body text-xs">{option}</span>
                    </label>
                  ))}
                </div>
                <button onClick={confirmMulti}
                  className="w-full mt-4 py-3 rounded-full bg-accent text-accent-foreground font-heading font-semibold text-lg shadow-lg">
                  Continuer
                </button>
              </div>
            )}

            {question.type === "location" && (
              <div className="space-y-3 max-w-xs mx-auto">
                <button
                  onClick={() => {
                    setLocationMode("");
                    setSelectedCity("");
                    setCustomCity("");
                    finishStep({ [currentId]: "Autour de moi" });
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-left font-body border transition-colors ${locationMode === "around" ? "bg-accent text-accent-foreground border-accent" : "bg-card text-card-foreground border-border hover:border-accent/50"}`}
                >
                  Autour de moi
                </button>
                <button
                  onClick={() => setLocationMode("city")}
                  className={`w-full px-4 py-3 rounded-xl text-left font-body border transition-colors ${locationMode === "city" ? "bg-accent text-accent-foreground border-accent" : "bg-card text-card-foreground border-border hover:border-accent/50"}`}
                >
                  Une ville en particulier
                </button>
                {locationMode === "city" && (
                  <div className="p-3 rounded-xl border border-border bg-card space-y-2">
                    <label className="text-xs font-body text-muted-foreground">Laquelle ?</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSelectedCity(v);
                        if (v && v !== "Autre") {
                          sessionStorage.setItem("quizCity", v);
                          finishStep({ [currentId]: v });
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border font-body text-sm"
                    >
                      <option value="" disabled>Choisir une ville…</option>
                      {question.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {selectedCity === "Autre" && (
                      <div className="space-y-2 pt-1">
                        <input
                          type="text"
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
                          placeholder="Saisir une ville"
                          className="w-full px-3 py-2 rounded-lg bg-background border border-border font-body text-sm"
                        />
                        <button
                          onClick={() => {
                            const v = customCity.trim();
                            if (!v) return;
                            sessionStorage.setItem("quizCity", v);
                            finishStep({ [currentId]: v });
                          }}
                          disabled={!customCity.trim()}
                          className="w-full py-2 rounded-full bg-accent text-accent-foreground font-heading font-semibold text-sm shadow-md disabled:opacity-50"
                        >
                          Valider
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {step < order.length - 1 && (
          <button onClick={() => { setDir(1); setStep(step + 1); }} className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent">
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mt-auto">
        {step > 0 && (
          <button onClick={goBack} className="text-muted-foreground text-sm font-body mb-3 md:hidden">← Retour</button>
        )}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-accent rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2 font-body">
          {step + 1} / {order.length}
        </p>
      </div>
    </div>
  );
};

export default QuizPage;
