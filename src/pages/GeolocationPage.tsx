import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { t } from "@/data/i18n";
import { useNavigate } from "react-router-dom";
import dinouLogo from "@/assets/dinou-logo.png";

const GeolocationPage = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    navigator.geolocation?.getCurrentPosition(
      () => navigate("/reservation"),
      () => navigate("/reservation")
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <motion.img
        src={dinouLogo}
        alt="Dinou"
        className="w-28 h-28 object-contain animate-float"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.div
        className="mt-6 glass-card rounded-2xl p-6 max-w-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MapPin className="w-8 h-8 text-accent mx-auto mb-4" />
        <p className="text-foreground font-body text-base leading-relaxed">{t("geo_ask")}</p>
      </motion.div>
      <div className="mt-8 flex gap-4">
        <motion.button
          onClick={handleAllow}
          className="px-6 py-3 rounded-full bg-accent text-accent-foreground font-heading font-semibold shadow-md"
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {t("geo_allow")}
        </motion.button>
        <motion.button
          onClick={() => navigate("/reservation")}
          className="px-6 py-3 rounded-full bg-muted text-muted-foreground font-heading font-semibold"
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {t("geo_deny")}
        </motion.button>
      </div>
    </div>
  );
};

export default GeolocationPage;
