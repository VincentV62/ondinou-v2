import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dinouLogo from "@/assets/dinou-logo.png";
import { badges } from "@/data/gamification";
import { restaurants } from "@/data/restaurants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import MyRestosMap from "@/components/MyRestosMap";

const OCCASIONS = [
  "Date / en amoureux",
  "Boulot / avec des clients ou collègues",
  "Déplacement professionnel",
  "Anniversaires / entre amis",
];

const ALLERGIES = [
  "Gluten",
  "Arachides",
  "Fruits à coque",
  "Lait (lactose)",
  "Œufs",
  "Poisson",
  "Crustacés",
  "Mollusques",
  "Soja",
  "Céleri",
  "Moutarde",
  "Sésame",
  "Sulfites",
  "Lupin",
];

interface HistoryItem {
  restaurantId: string;
  name: string;
  date: string;
  rating?: number;
  review?: string;
}

const STORAGE_KEY = "ondinou_profile_v1";

const loadProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
};

const ProfilePage = () => {
  const navigate = useNavigate();

  const user = { name: "Vincent", dinous: 320, friends: 8, tier: "Bronze" };

  const stored = loadProfile();
  const [tab, setTab] = useState<"infos" | "restos">("infos");
  const [allergies, setAllergies] = useState<string[]>(stored?.allergies ?? []);
  const [likes, setLikes] = useState<string>(stored?.likes ?? "");
  const [dislikes, setDislikes] = useState<string>(stored?.dislikes ?? "");
  const [favRestaurants, setFavRestaurants] = useState<string[]>(
    stored?.favRestaurants ?? ["", "", ""],
  );
  const [occasions, setOccasions] = useState<string[]>(stored?.occasions ?? []);

  // Mock history seeded from existing restaurants
  const history: HistoryItem[] = stored?.history ?? [
    {
      restaurantId: restaurants[0]?.id ?? "1",
      name: restaurants[0]?.name ?? "Rouge Barre",
      date: "12 mai 2026",
      rating: 5,
      review: "Service impeccable, plats créatifs. À refaire !",
    },
    {
      restaurantId: restaurants[1]?.id ?? "2",
      name: restaurants[1]?.name ?? "Le Bistrot",
      date: "28 avril 2026",
      rating: 4,
      review: "Bonne ambiance, un peu bruyant.",
    },
    {
      restaurantId: restaurants[2]?.id ?? "3",
      name: restaurants[2]?.name ?? "Chez Marie",
      date: "10 avril 2026",
      rating: 3,
      review: "Correct sans plus.",
    },
  ];

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ allergies, likes, dislikes, history, favRestaurants, occasions }),
    );
  }, [allergies, likes, dislikes, favRestaurants, occasions]);

  const toggleAllergy = (a: string) => {
    setAllergies((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const toggleOccasion = (o: string) => {
    setOccasions((prev) =>
      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o],
    );
  };

  return (
    <main className="flex flex-col items-center h-full bg-background text-foreground px-4 py-6 overflow-y-auto pb-24">
      {/* Sliding tabs */}
      <div className="w-full max-w-md mb-4">
        <div className="relative grid grid-cols-2 bg-secondary rounded-2xl p-1">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-xl bg-primary shadow transition-all duration-300 ${
              tab === "infos" ? "left-1" : "left-[calc(50%+0rem)]"
            }`}
          />
          <button
            onClick={() => setTab("infos")}
            className={`relative z-10 py-2 text-sm font-semibold rounded-xl transition-colors ${
              tab === "infos" ? "text-primary-foreground" : "text-foreground/70"
            }`}
          >
            Mes infos
          </button>
          <button
            onClick={() => setTab("restos")}
            className={`relative z-10 py-2 text-sm font-semibold rounded-xl transition-colors ${
              tab === "restos" ? "text-primary-foreground" : "text-foreground/70"
            }`}
          >
            Mes restos
          </button>
        </div>
      </div>

      {tab === "restos" ? (
        <div className="w-full">
          <MyRestosMap favoriteNames={favRestaurants} history={history} />
          <p className="text-xs text-muted-foreground text-center mt-3">
            Survole un logo Ondinou pour voir le détail du restaurant.
          </p>
        </div>
      ) : (
      <>
      {/* Profil */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-3xl font-bold text-primary">
          {user.name.charAt(0)}
        </div>
        <h2 className="mt-3 font-semibold text-xl">{user.name}</h2>
        <div className="flex items-center mt-2 gap-2">
          <img src={dinouLogo} alt="dinou" className="w-5 h-5" />
          <span className="text-lg font-bold">{user.dinous} Dinous</span>
        </div>
        <div className="flex space-x-4 text-sm text-muted-foreground mt-1">
          <span>{user.friends} amis</span>
          <span>#{user.rank} au classement</span>
        </div>
        <Button
          variant="default"
          className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
        >
          Ajouter des amis
        </Button>
      </div>

      {/* Badges */}
      <div className="w-full mt-8">
        <h3 className="text-center font-semibold mb-3">Mes badges 🏅</h3>
        <div className="flex justify-center flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b.id}
              className="px-3 py-1.5 rounded-xl text-sm font-medium bg-accent text-accent-foreground"
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div className="w-full mt-8">
        <h3 className="font-semibold mb-2">Mes allergies 🚫</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between rounded-xl border-primary text-left"
            >
              <span className="truncate">
                {allergies.length === 0
                  ? "Sélectionner mes allergies"
                  : allergies.join(", ")}
              </span>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-2 max-h-72 overflow-y-auto">
            {ALLERGIES.map((a) => (
              <label
                key={a}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer"
              >
                <Checkbox
                  checked={allergies.includes(a)}
                  onCheckedChange={() => toggleAllergy(a)}
                />
                <span className="text-sm">{a}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Restaurants préférés */}
      <div className="w-full mt-8">
        <h3 className="font-semibold mb-2">Mes 3 restaurants préférés 🍽️</h3>
        <div className="space-y-2">
          {favRestaurants.map((name, i) => (
            <Input
              key={i}
              value={name}
              onChange={(e) => {
                const next = [...favRestaurants];
                next[i] = e.target.value;
                setFavRestaurants(next);
              }}
              placeholder={`Restaurant n°${i + 1}`}
              className="rounded-xl"
            />
          ))}
        </div>
      </div>

      {/* Occasions */}
      <div className="w-full mt-8">
        <h3 className="font-semibold mb-2">
          Quelle est l'occasion la plus fréquente qui t'emmène au restaurant ? 🎉
        </h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between rounded-xl border-primary text-left"
            >
              <span className="truncate">
                {occasions.length === 0
                  ? "Sélectionner une ou plusieurs occasions"
                  : occasions.join(", ")}
              </span>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-2 max-h-72 overflow-y-auto">
            {OCCASIONS.map((o) => (
              <label
                key={o}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer"
              >
                <Checkbox
                  checked={occasions.includes(o)}
                  onCheckedChange={() => toggleOccasion(o)}
                />
                <span className="text-sm">{o}</span>
              </label>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {/* Préférences texte */}
      <div className="w-full mt-8 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Ce que j'aime au restaurant ❤️</h3>
          <Textarea
            value={likes}
            maxLength={180}
            onChange={(e) => setLikes(e.target.value)}
            placeholder="Ambiance cosy, plats végétariens, bons vins..."
            className="rounded-xl"
          />
          <p className="text-xs text-muted-foreground text-right mt-1">
            {likes.length}/180
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Ce que je n'aime pas 🚷</h3>
          <Textarea
            value={dislikes}
            maxLength={180}
            onChange={(e) => setDislikes(e.target.value)}
            placeholder="Trop bruyant, service lent, plats trop épicés..."
            className="rounded-xl"
          />
          <p className="text-xs text-muted-foreground text-right mt-1">
            {dislikes.length}/180
          </p>
        </div>
      </div>

      {/* Historique des réservations */}
      <div className="w-full mt-8">
        <h3 className="font-semibold mb-3">Mes réservations 📅</h3>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div
              key={i}
              className="rounded-xl border-2 border-primary/20 p-3 bg-card"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{h.name}</span>
                <span className="text-xs text-muted-foreground">{h.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes & avis */}
      <div className="w-full mt-8">
        <h3 className="font-semibold mb-3">Mes notes & avis ⭐</h3>
        <div className="space-y-2">
          {history
            .filter((h) => h.rating)
            .map((h, i) => (
              <div
                key={i}
                className="rounded-xl border-2 border-primary/20 p-3 bg-card"
              >
              <div className="flex justify-between items-center mb-1">
                  <div>
                    <span className="font-semibold">{h.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{h.date}</span>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${
                          idx < (h.rating ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {h.review && (
                  <p className="text-sm text-muted-foreground italic">
                    « {h.review} »
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Lien vers classement */}
      <Button
        onClick={() => navigate("/points")}
        variant="outline"
        className="mt-8 rounded-xl border-primary text-primary"
      >
        Voir mon classement 🚀
      </Button>
      </>
      )}
    </main>
  );
};

export default ProfilePage;
