import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { t } from "@/data/i18n";
import { Calendar, Clock } from "lucide-react";
import dinouLogo from "@/assets/dinou-logo.png";
import { format, addDays } from "date-fns";
import { fr } from "date-fns/locale";

const times = Array.from({ length: 35 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? "00" : "30";
  return `${h.toString().padStart(2, "0")}:${m}`;
});

const ReservationPage = () => {
  const navigate = useNavigate();
  const [dateOption, setDateOption] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const today = new Date();
  const dateOptions = [
    { label: t("today"), value: format(today, "EEEE d MMMM", { locale: fr }) },
    { label: t("tomorrow"), value: format(addDays(today, 1), "EEEE d MMMM", { locale: fr }) },
    { label: t("next7"), value: "next7" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-8">
      <motion.img
        src={dinouLogo}
        alt="Dinou"
        className="w-20 h-20 object-contain mx-auto animate-float cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate("/")}
      />
      <motion.div
        className="glass-card rounded-2xl p-4 mx-auto mt-4 max-w-xs"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-foreground text-center font-body text-sm">
          Dis-moi ce qui te ferait plaisir aujourd'hui 😋
        </p>
      </motion.div>

      <motion.h1
        className="text-2xl font-heading font-semibold text-foreground text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {t("when_title")}
      </motion.h1>

      <motion.div
        className="mt-6 space-y-3 max-w-sm mx-auto w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-accent" />
          <span className="font-heading font-medium text-foreground text-sm">Date</span>
        </div>
        {dateOptions.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setDateOption(opt.label)}
            className={`w-full px-4 py-3 rounded-xl text-left font-body transition-all ${
              dateOption === opt.label
                ? "bg-accent text-accent-foreground shadow-md"
                : "bg-card text-card-foreground border border-border hover:border-accent/50"
            }`}
          >
            <span className="font-medium">{opt.label}</span>
            {opt.value !== "next7" && (
              <span className="block text-xs opacity-70 capitalize">{opt.value}</span>
            )}
          </button>
        ))}
      </motion.div>

      {dateOption && (
        <motion.div
          className="mt-6 max-w-sm mx-auto w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-accent" />
            <span className="font-heading font-medium text-foreground text-sm">Heure</span>
          </div>
          <div className="grid grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto overscroll-contain pr-1" style={{ WebkitOverflowScrolling: 'touch' }}>
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`px-3 py-2 rounded-lg text-sm font-body transition-all ${
                  time === t
                    ? "bg-accent text-accent-foreground shadow-md"
                    : "bg-card text-card-foreground border border-border hover:border-accent/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {dateOption && time && (
        <motion.div
          className="mt-auto pt-6 max-w-sm mx-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => navigate("/quiz")}
            className="w-full py-4 rounded-full bg-accent text-accent-foreground font-heading font-semibold text-lg shadow-lg"
          >
            {t("continue")}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ReservationPage;
