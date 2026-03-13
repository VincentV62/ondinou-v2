import { motion } from "framer-motion";
import dinouLogo from "@/assets/dinou-logo.png";
import { t } from "@/data/i18n";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <motion.img
        src={dinouLogo}
        alt="Dinou"
        className="w-48 h-48 object-contain animate-glow-pulse"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.8 }}
      />
      <motion.p
        className="mt-8 text-center text-lg font-body text-foreground leading-relaxed whitespace-pre-line max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {t("splash_greeting")}
      </motion.p>
      <motion.button
        onClick={() => navigate("/auth")}
        className="mt-10 px-8 py-4 rounded-full bg-accent text-accent-foreground font-heading font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        whileTap={{ scale: 0.95 }}
      >
        {t("splash_cta")}
      </motion.button>
    </div>
  );
};

export default SplashScreen;
