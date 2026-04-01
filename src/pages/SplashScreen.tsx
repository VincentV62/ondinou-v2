import { motion } from "framer-motion";
import dinouLogo from "@/assets/dinou-logo.png";
import { t } from "@/data/i18n";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SplashScreen = () => {
  const navigate = useNavigate();

  const handleRestaurantEntry = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate("/restaurant-signup");
      return;
    }

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1)
      .maybeSingle();

    navigate(restaurant ? "/restaurant-dashboard" : "/restaurant-signup");
  };

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] bg-background px-6 overflow-hidden">
      <motion.img
        src={dinouLogo}
        alt="Dinou"
        className="w-40 h-40 sm:w-48 sm:h-48 object-contain animate-glow-pulse"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.8 }}
      />
      <motion.p
        className="mt-6 text-center text-base sm:text-lg font-body text-foreground leading-relaxed whitespace-pre-line max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {t("splash_greeting")}
      </motion.p>
      <motion.button
        onClick={() => navigate("/auth")}
        className="mt-8 px-8 py-4 rounded-full bg-accent text-accent-foreground font-heading font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        whileTap={{ scale: 0.95 }}
      >
        {t("splash_cta")}
      </motion.button>
      <motion.button
        onClick={handleRestaurantEntry}
        className="mt-3 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-sm shadow-md hover:shadow-lg transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        whileTap={{ scale: 0.95 }}
      >
        Je suis restaurateur
      </motion.button>
    </div>
  );
};

export default SplashScreen;
