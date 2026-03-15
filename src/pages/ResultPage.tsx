import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Users, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import dinouLogo from "@/assets/dinou-logo.png";
import { matchRestaurants, type QuizAnswers, type Restaurant } from "@/data/restaurants";
import { supabase } from "@/integrations/supabase/client";
import { t } from "@/data/i18n";

const ResultPage = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  // Try fetching from Supabase, fallback to local mock
  const { data: dbRestaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data } = await supabase.from("restaurants").select("*");
      return data;
    },
  });

  const results = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("quizAnswers");
      if (!raw) return [];
      const answers: QuizAnswers = JSON.parse(raw);
      // Use local matching engine (works with mock data)
      return matchRestaurants(answers);
    } catch {
      return [];
    }
  }, []);

  if (!results.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
        <p className="text-foreground font-body">Aucun résultat. Recommence le quiz !</p>
        <button onClick={() => navigate("/quiz")} className="mt-4 px-6 py-3 rounded-full bg-accent text-accent-foreground font-heading font-semibold">
          Recommencer
        </button>
      </div>
    );
  }

  const restaurant: Restaurant = results[index];

  const handleReserve = () => {
    // Open Google search for the restaurant's reservation page
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address} réservation`);
    window.open(`https://www.google.com/search?q=${query}`, "_blank");
  };

  const handleViewMap = () => {
    const query = encodeURIComponent(`${restaurant.name} ${restaurant.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-6">
      <div className="flex flex-col items-center">
        <img src={dinouLogo} alt="Dinou" className="w-14 h-14 object-contain animate-float" />
        <motion.div
          className="glass-card rounded-2xl px-4 py-2 mt-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p className="text-foreground text-center font-body text-xs">
            J'ai trouvé le spot parfait pour toi ! 🎉
          </p>
        </motion.div>
      </div>

      <h1 className="text-xl font-heading font-semibold text-foreground text-center mt-6">
        {t("result_title")}
      </h1>

      <motion.div
        key={restaurant.id}
        className="mt-4 glass-card rounded-2xl overflow-hidden max-w-sm mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <img src={restaurant.photo} alt={restaurant.name} className="w-full h-44 object-cover" />
        <div className="p-4">
          <h2 className="text-lg font-heading font-semibold text-foreground">{restaurant.name}</h2>
          <p className="text-sm text-muted-foreground font-body">{restaurant.cuisine}</p>

          <div className="flex items-center gap-4 mt-3 text-sm font-body text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-accent fill-accent" /> {restaurant.rating}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {restaurant.distance}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {restaurant.availableTables} tables
            </span>
          </div>

          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground font-body">
            <Clock className="w-3 h-3" /> {restaurant.openingHours}
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-body">{restaurant.address}</p>

          <div className="mt-4 space-y-1">
            <p className="text-xs font-body text-accent">
              🔥 {restaurant.reservationsThisWeek} personnes ont réservé ici via ONDINOU cette semaine
            </p>
            <p className="text-xs font-body text-sage">
              👥 18 personnes avec les mêmes goûts que toi ont adoré ce restaurant
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {restaurant.reviews.map((rev, i) => (
              <div key={i} className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: rev.stars }).map((_, s) => (
                    <Star key={s} className="w-3 h-3 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-xs text-foreground font-body mt-1">{rev.text}</p>
                <p className="text-xs text-muted-foreground font-body">— {rev.author}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="mt-6 space-y-3 max-w-sm mx-auto w-full pb-6">
        <button
          onClick={handleReserve}
          className="w-full py-3 rounded-full bg-accent text-accent-foreground font-heading font-semibold shadow-lg"
        >
          {t("reserve")}
        </button>
        <button
          onClick={handleViewMap}
          className="w-full py-3 rounded-full bg-card text-card-foreground border border-border font-heading font-medium"
        >
          {t("view_map")}
        </button>
        {index < results.length - 1 && (
          <button
            onClick={() => setIndex(index + 1)}
            className="w-full py-3 rounded-full bg-muted text-muted-foreground font-heading font-medium"
          >
            {t("change")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
