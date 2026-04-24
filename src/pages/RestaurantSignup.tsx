import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import dinouLogo from "@/assets/dinou-logo.png";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const TAGS = [
  "Romantique", "Cosy", "Branché", "Familial", "Gastronomique",
  "Rapide", "Terrasse", "Vue sympa", "Entre amis",
];

const RestaurantSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"auth" | "info">("auth");
  const [mode, setMode] = useState<"login" | "signup">("signup");

  // Auth fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Restaurant fields
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [managerName, setManagerName] = useState("");
  const [restaurantPhone, setRestaurantPhone] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const redirectIfRestaurantExists = async (userId: string) => {
    const { data: existingRestaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingRestaurant) {
      navigate("/restaurant-dashboard");
      return true;
    }

    return false;
  };

  const handleAuth = async () => {
    setLoading(true);
    setError("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: managerName.split(" ")[0] || "", last_name: managerName.split(" ").slice(1).join(" ") || "" },
          emailRedirectTo: window.location.origin + "/restaurant-signup",
        },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setMessage("Vérifie ton email pour confirmer ton compte, puis connecte-toi !");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data.user && await redirectIfRestaurantExists(data.user.id)) { setLoading(false); return; }
      setStep("info");
    }
    setLoading(false);
  };

  const handleSubmitRestaurant = async () => {
    setLoading(true);
    setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Tu dois être connecté."); setLoading(false); return; }

    const payload = {
      name: restaurantName.trim(),
      address: restaurantAddress.trim(),
      manager_name: managerName.trim(),
      phone: restaurantPhone.trim(),
      cuisine: selectedTags[0] || "Française",
      tags: selectedTags,
      ambiance: selectedTags.filter((t) => ["Romantique", "Cosy", "Branché", "Familial", "Entre amis"].includes(t)),
      owner_id: user.id,
      city: "Lille",
    };

    const { data: existingRestaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    const { error } = existingRestaurant
      ? await supabase.from("restaurants").update(payload).eq("id", existingRestaurant.id)
      : await supabase.from("restaurants").insert(payload);

    if (error) { setError(error.message); setLoading(false); return; }
    navigate("/restaurant-dashboard");
  };

  useEffect(() => {
    const checkExistingRestaurant = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (await redirectIfRestaurantExists(user.id)) return;

      setStep("info");
    };

    checkExistingRestaurant();
  }, [navigate]);

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-card text-card-foreground border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-colors";

  return (
    <div className="flex flex-col items-center min-h-screen bg-background px-6 py-8">
      {/* Header */}
      <div className="w-full max-w-sm flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <motion.img
        src={dinouLogo}
        alt="Dinou"
        className="w-16 h-16 object-contain"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      />

      <h1 className="text-xl font-heading font-semibold text-foreground mt-3">
        {step === "auth" ? "Espace Restaurateur" : "Mon restaurant"}
      </h1>
      <p className="text-sm text-muted-foreground font-body mt-1 text-center max-w-xs">
        {step === "auth"
          ? "Connecte-toi ou crée ton compte restaurateur"
          : "Complète les informations de ton établissement"}
      </p>

      {message && (
        <div className="mt-4 p-3 rounded-lg bg-secondary/30 text-foreground text-sm font-body max-w-xs text-center">
          {message}
        </div>
      )}

      {error && (
        <p className="mt-3 text-destructive text-xs font-body max-w-xs text-center">{error}</p>
      )}

      {/* AUTH STEP */}
      {step === "auth" && (
        <motion.div
          className="mt-6 w-full max-w-xs space-y-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input type="email" placeholder="Email professionnel" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          {mode === "signup" && (
            <input type="text" placeholder="Nom du gérant" value={managerName} onChange={(e) => setManagerName(e.target.value)} className={inputClass} />
          )}

          <button
            onClick={handleAuth}
            disabled={loading || !email || !password}
            className="w-full py-3 rounded-full bg-primary text-primary-foreground font-heading font-semibold shadow-md disabled:opacity-50 transition-opacity"
          >
            {loading ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>

          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
            className="w-full text-sm text-accent font-body underline text-center"
          >
            {mode === "login" ? "Pas encore de compte ? Inscris-toi" : "Déjà un compte ? Connecte-toi"}
          </button>

          <div className="pt-3 mt-3 border-t border-border">
            <button
              onClick={() => {
                sessionStorage.setItem("demo_restaurant", "table-de-vincent");
                navigate("/restaurant-dashboard");
              }}
              className="w-full py-3 rounded-full bg-accent/20 text-foreground border border-accent font-body text-sm hover:bg-accent/30 transition-colors"
            >
              🧪 Accès démo : Table de Vincent
            </button>
            <p className="mt-2 text-[11px] text-muted-foreground font-body text-center">
              Accès direct au tableau de bord sans identification
            </p>
          </div>
        </motion.div>
      )}

      {/* INFO STEP */}
      {step === "info" && (
        <motion.div
          className="mt-6 w-full max-w-sm space-y-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input type="text" placeholder="Nom du restaurant" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className={inputClass} />
          <input type="text" placeholder="Adresse du restaurant" value={restaurantAddress} onChange={(e) => setRestaurantAddress(e.target.value)} className={inputClass} />
          <input type="text" placeholder="Nom du gérant" value={managerName} onChange={(e) => setManagerName(e.target.value)} className={inputClass} />
          <input type="tel" placeholder="Téléphone du restaurant" value={restaurantPhone} onChange={(e) => setRestaurantPhone(e.target.value)} className={inputClass} />

          {/* Tags */}
          <div>
            <p className="text-sm font-heading font-semibold text-foreground mb-2">Tags de ton restaurant</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <motion.button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-body border transition-colors ${
                      active
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-card text-card-foreground border-border hover:border-accent/50"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {active && <Check className="inline h-3 w-3 mr-1" />}
                    {tag}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSubmitRestaurant}
            disabled={loading || !restaurantName || !restaurantAddress}
            className="w-full py-3 rounded-full bg-accent text-accent-foreground font-heading font-semibold shadow-md disabled:opacity-50 transition-opacity"
          >
            {loading ? "..." : "Enregistrer mon restaurant"}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default RestaurantSignup;
