import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { t } from "@/data/i18n";
import dinouLogo from "@/assets/dinou-logo.png";
import type { QuizAnswers } from "@/data/restaurants";

interface QuestionDef {
  key: keyof QuizAnswers;
  titleKey: string;
  options: string[];
  dinouMsg: string;
  isDropdown?: boolean;
}

const questions: QuestionDef[] = [
  { key: "guests", titleKey: "q1", options: Array.from({ length: 15 }, (_, i) => String(i + 1)), dinouMsg: "Dis-moi ce qui te ferait plaisir aujourd'hui 😋", isDropdown: true },
  { key: "transport", titleKey: "q2", options: ["À pied", "En vélo", "En voiture", "En transports"], dinouMsg: "Super ! On continue…" },
  { key: "travelTime", titleKey: "q3", options: ["5 minutes", "15 minutes", "30 minutes", "Peu importe"], dinouMsg: "Hum… je commence à avoir une idée… 🤔" },
  { key: "budget", titleKey: "q4", options: ["Menu à 20€ environ", "Menu entre 30€ et 50€", "Pas de limite, ce soir je me fais plaisir !"], dinouMsg: "Ça se précise…" },
  { key: "food", titleKey: "q5", options: ["Viande", "Poisson", "Vegan", "Surprends-moi"], dinouMsg: "Miam miam 😋" },
  { key: "ambiance", titleKey: "q6", options: ["Cosy", "Branché", "Romantique", "Entre potes"], dinouMsg: "J'adore ton style !" },
  { key: "terrasse", titleKey: "q7", options: ["Oui", "Non", "Peu importe"], dinouMsg: "Bonne question…" },
  { key: "novelty", titleKey: "q8", options: ["Nouveau", "Classique"], dinouMsg: "Encore une question et je te trouve le restaurant parfait ! 🎯" },
  { key: "detail", titleKey: "q9", options: ["Vue sympa", "Bonne musique", "Service rapide", "Peu importe"], dinouMsg: "C'est la dernière, promis !" },
];

const budgetMap: Record<string, number> = {
  "Menu à 20€ environ": 1,
  "Menu entre 30€ et 50€": 2,
  "Pas de limite, ce soir je me fais plaisir !": 3,
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const QuizPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const q = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const goNext = useCallback(() => {
    if (step < questions.length - 1) {
      setDir(1);
      setStep(step + 1);
    }
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDir(-1);
      setStep(step - 1);
    }
  }, [step]);

  const selectAnswer = useCallback(
    (val: string) => {
      const value = q.key === "guests" ? parseInt(val) : q.key === "budget" ? budgetMap[val] || 1 : val;
      const updated = { ...answers, [q.key]: value };
      setAnswers(updated);

      setTimeout(() => {
        if (step < questions.length - 1) {
          setDir(1);
          setStep(step + 1);
        } else {
          sessionStorage.setItem("quizAnswers", JSON.stringify(updated));
          navigate("/result");
        }
      }, 300);
    },
    [step, answers, navigate, q.key]
  );

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-6 overflow-hidden">
      {/* Dinou avatar — large & prominent */}
      <div className="flex flex-col items-center">
        <img src={dinouLogo} alt="Dinou" className="w-28 h-28 md:w-36 md:h-36 object-contain animate-float" />
        <motion.div
          key={step}
          className="glass-card rounded-2xl px-5 py-3 mt-3 max-w-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-foreground text-center font-body text-sm md:text-base">{q.dinouMsg}</p>
        </motion.div>
      </div>

      {/* Question area with navigation arrows */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Left arrow (desktop) */}
        {step > 0 && (
          <button
            onClick={goBack}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
            aria-label="Question précédente"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Right arrow (desktop) */}
        {step < questions.length - 1 && (
          <button
            onClick={goNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
            aria-label="Question suivante"
          >
            <ChevronRight className="h-5 w-5" />
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
            className="w-full md:px-14"
            drag={!q.isDropdown ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 && step < questions.length - 1) {
                goNext();
              } else if (info.offset.x > 80 && step > 0) {
                goBack();
              }
            }}
          >
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-8">
              {t(q.titleKey)}
            </h2>

            {q.isDropdown ? (
              <div className="max-w-xs mx-auto">
                <select
                  onChange={(e) => selectAnswer(e.target.value)}
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-xl bg-card text-card-foreground border border-border font-body focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="" disabled>Choisir…</option>
                  {q.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3 max-w-xs mx-auto">
                {q.options.map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => selectAnswer(option)}
                    className={`w-full px-4 py-3 rounded-xl text-left font-body transition-all ${
                      answers[q.key] === option || (q.key === "budget" && answers.budget === budgetMap[option])
                        ? "bg-accent text-accent-foreground shadow-md"
                        : "bg-card text-card-foreground border border-border hover:border-accent/50"
                    }`}
                    whileTap={{ scale: 0.97 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="mt-auto">
        {step > 0 && (
          <button onClick={goBack} className="text-muted-foreground text-sm font-body mb-3 md:hidden">
            ← Retour
          </button>
        )}
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2 font-body">
          {step + 1} / {questions.length}
        </p>
      </div>
    </div>
  );
};

export default QuizPage;
