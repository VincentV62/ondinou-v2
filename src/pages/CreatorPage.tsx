import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Star, Users, Utensils } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { restaurants as localRestaurants } from "@/data/restaurants";

const FOOD_TYPES = ["Italien", "Japonais", "Poisson", "Viande", "Asiatique", "Estaminet", "Bistronomie", "Végétarien"];
const AMBIANCES = ["Cosy", "Branché", "Romantique", "Entre potes"];
const PRICE_RANGES = [
  { label: "€ (≈20€)", value: 1, range: "€" },
  { label: "€€ (30-50€)", value: 2, range: "€€" },
  { label: "€€€ (50€+)", value: 3, range: "€€€" },
];

type RestoRow = {
  id: string;
  name: string;
  cuisine: string;
  address: string | null;
  city: string | null;
  rating: number | null;
  budget: number | null;
  price_range: string | null;
  food_type: string[] | null;
  ambiance: string[] | null;
  terrasse: boolean | null;
  is_new: boolean | null;
  available_tables: number | null;
  photo: string | null;
};

const CreatorPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Required fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  // Fake data
  const [cuisine, setCuisine] = useState("Estaminet");
  const [foodTypes, setFoodTypes] = useState<string[]>(["Estaminet"]);
  const [ambiance, setAmbiance] = useState<string[]>(["Cosy"]);
  const [budget, setBudget] = useState(2);
  const [rating, setRating] = useState(4.5);
  const [availableTables, setAvailableTables] = useState(8);
  const [weeklyUses, setWeeklyUses] = useState(42);
  const [terrasse, setTerrasse] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [photo, setPhoto] = useState("");
  const [city, setCity] = useState("Lille");
  const [phone, setPhone] = useState("");
  const [openingHours, setOpeningHours] = useState("12h-14h / 19h-22h");
  const [fakeReview, setFakeReview] = useState("Une vraie pépite, on y reviendra !");

  // List tab
  const [dbRestaurants, setDbRestaurants] = useState<RestoRow[]>([]);
  const [tab, setTab] = useState("create");

  const loadRestaurants = async () => {
    const { data } = await supabase
      .from("restaurants")
      .select("id,name,cuisine,address,city,rating,budget,price_range,food_type,ambiance,terrasse,is_new,available_tables,photo")
      .order("created_at", { ascending: false });
    setDbRestaurants((data as RestoRow[]) ?? []);
  };

  useEffect(() => {
    if (tab === "list") loadRestaurants();
  }, [tab]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !address.trim()) {
      toast.error("Nom, description et adresse sont obligatoires");
      return;
    }
    setLoading(true);

    const priceMeta = PRICE_RANGES.find((p) => p.value === budget)!;

    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .insert({
        name,
        cuisine,
        address,
        city,
        phone: phone || null,
        photo: photo || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        rating,
        budget,
        price_range: priceMeta.range,
        food_type: foodTypes,
        ambiance,
        tags: [description.slice(0, 60), ...foodTypes],
        terrasse,
        is_new: isNew,
        available_tables: availableTables,
        opening_hours: openingHours,
        distance: "1.2 km",
        distance_minutes: 8,
      } as any)
      .select()
      .single();

    if (error || !restaurant) {
      toast.error("Erreur : " + (error?.message ?? "inconnue"));
      setLoading(false);
      return;
    }

    if (fakeReview.trim()) {
      await supabase.from("reviews").insert({
        restaurant_id: restaurant.id,
        user_id: crypto.randomUUID(),
        rating: Math.round(rating),
        text: fakeReview,
      } as any);
    }

    const uses = JSON.parse(localStorage.getItem("fakeWeeklyUses") || "{}");
    uses[restaurant.id] = weeklyUses;
    localStorage.setItem("fakeWeeklyUses", JSON.stringify(uses));

    toast.success(`✓ "${name}" ajouté à la base !`);
    setLoading(false);
    setName("");
    setDescription("");
    setAddress("");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground font-body text-sm mb-4 hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Page créateur</h1>
            <p className="text-sm text-muted-foreground font-body mt-1">
              Ajoute un restaurant et visualise tous ceux qui peuvent ressortir dans le quiz.
            </p>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="create">Créer un resto</TabsTrigger>
              <TabsTrigger value="list">Restaurants & critères</TabsTrigger>
            </TabsList>

            {/* ---------- CREATE TAB ---------- */}
            <TabsContent value="create" className="space-y-6 mt-4">
              <section className="space-y-3 p-4 rounded-xl border border-border bg-card">
                <h2 className="font-heading font-semibold text-sm uppercase tracking-wide text-accent">Infos principales</h2>
                <Field label="Nom du resto *">
                  <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="La Table de Vincent" />
                </Field>
                <Field label="Description rapide *">
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} placeholder="Bistrot chaleureux…" />
                </Field>
                <Field label="Adresse *">
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} placeholder="12 rue de la Monnaie, Lille" />
                </Field>
              </section>

              <section className="space-y-3 p-4 rounded-xl border border-border bg-card">
                <h2 className="font-heading font-semibold text-sm uppercase tracking-wide text-accent">Données de démo</h2>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ville"><input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} /></Field>
                  <Field label="Téléphone"><input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="03 20 …" /></Field>
                </div>

                <Field label="Cuisine principale">
                  <select value={cuisine} onChange={(e) => setCuisine(e.target.value)} className={inputCls}>
                    {FOOD_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </Field>

                <Field label="Types de cuisine (multi)">
                  <div className="flex flex-wrap gap-2">
                    {FOOD_TYPES.map((f) => (
                      <Chip key={f} active={foodTypes.includes(f)} onClick={() => toggle(foodTypes, setFoodTypes, f)}>{f}</Chip>
                    ))}
                  </div>
                </Field>

                <Field label="Ambiance">
                  <div className="flex flex-wrap gap-2">
                    {AMBIANCES.map((a) => (
                      <Chip key={a} active={ambiance.includes(a)} onClick={() => toggle(ambiance, setAmbiance, a)}>{a}</Chip>
                    ))}
                  </div>
                </Field>

                <Field label="Budget">
                  <div className="flex gap-2">
                    {PRICE_RANGES.map((p) => (
                      <Chip key={p.value} active={budget === p.value} onClick={() => setBudget(p.value)}>{p.label}</Chip>
                    ))}
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label={`Note ⭐ (${rating.toFixed(1)})`}>
                    <input type="range" min="1" max="5" step="0.1" value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} className="w-full accent-[hsl(var(--accent))]" />
                  </Field>
                  <Field label="Tables dispos">
                    <input type="number" min="0" value={availableTables} onChange={(e) => setAvailableTables(parseInt(e.target.value) || 0)} className={inputCls} />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Utilisations cette semaine">
                    <input type="number" min="0" value={weeklyUses} onChange={(e) => setWeeklyUses(parseInt(e.target.value) || 0)} className={inputCls} />
                  </Field>
                  <Field label="Horaires">
                    <input value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} className={inputCls} />
                  </Field>
                </div>

                <Field label="Photo (URL)">
                  <input value={photo} onChange={(e) => setPhoto(e.target.value)} className={inputCls} placeholder="https://…" />
                </Field>

                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={terrasse} onChange={(e) => setTerrasse(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--accent))]" />
                    <span className="text-sm font-body">Terrasse</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--accent))]" />
                    <span className="text-sm font-body">Nouveauté</span>
                  </label>
                </div>

                <Field label="Faux avis client">
                  <textarea value={fakeReview} onChange={(e) => setFakeReview(e.target.value)} rows={2} className={inputCls} />
                </Field>
              </section>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-full bg-accent text-accent-foreground font-heading font-semibold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {loading ? "Ajout…" : "Ajouter à la base"}
              </button>
            </TabsContent>

            {/* ---------- LIST TAB ---------- */}
            <TabsContent value="list" className="mt-4 space-y-4">
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs font-body text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground mb-1">Comment le quiz retrouve un resto ?</p>
                Le matching croise les réponses du quiz avec ces critères : <b>cuisine</b> (foodType), <b>ambiance</b>, <b>budget</b>,
                <b> terrasse</b>, <b>nouveauté</b>, et la <b>note</b>. Un resto remonte s'il coche au moins un critère choisi.
              </div>

              <div className="space-y-3">
                <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Base locale ({localRestaurants.length})
                </h3>
                {localRestaurants.map((r) => (
                  <RestoCard
                    key={r.id}
                    name={r.name}
                    cuisine={r.cuisine}
                    rating={r.rating}
                    priceRange={r.priceRange}
                    foodType={r.foodType}
                    ambiance={r.ambiance}
                    terrasse={r.terrasse}
                    isNew={r.isNew}
                    availableTables={r.availableTables}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Ajoutés via la page créateur ({dbRestaurants.length})
                </h3>
                {dbRestaurants.length === 0 && (
                  <p className="text-sm text-muted-foreground font-body italic">Aucun resto ajouté pour le moment.</p>
                )}
                {dbRestaurants.map((r) => (
                  <RestoCard
                    key={r.id}
                    name={r.name}
                    cuisine={r.cuisine}
                    rating={r.rating ?? 0}
                    priceRange={r.price_range ?? "—"}
                    foodType={r.food_type ?? []}
                    ambiance={r.ambiance ?? []}
                    terrasse={!!r.terrasse}
                    isNew={!!r.is_new}
                    availableTables={r.available_tables ?? 0}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

const inputCls = "w-full px-3 py-2.5 rounded-xl bg-background text-foreground border border-border font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-body font-semibold text-muted-foreground">{label}</label>
    {children}
  </div>
);

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
      active ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
    }`}
  >
    {children}
  </button>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-body">{children}</span>
);

const RestoCard = ({
  name, cuisine, rating, priceRange, foodType, ambiance, terrasse, isNew, availableTables,
}: {
  name: string; cuisine: string; rating: number; priceRange: string;
  foodType: string[]; ambiance: string[]; terrasse: boolean; isNew: boolean; availableTables: number;
}) => (
  <div className="p-4 rounded-xl border border-border bg-card space-y-2">
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="font-heading font-semibold text-foreground">{name}</div>
        <div className="text-xs font-body text-muted-foreground flex items-center gap-1">
          <Utensils className="w-3 h-3" /> {cuisine}
        </div>
      </div>
      <div className="flex items-center gap-1 text-sm font-body">
        <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {rating.toFixed(1)}
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 pt-1">
      <Tag>💰 {priceRange}</Tag>
      {foodType.map((f) => <Tag key={f}>🍽️ {f}</Tag>)}
      {ambiance.map((a) => <Tag key={a}>✨ {a}</Tag>)}
      {terrasse && <Tag>☀️ Terrasse</Tag>}
      {isNew && <Tag>🆕 Nouveau</Tag>}
      <Tag><Users className="w-3 h-3 inline -mt-0.5" /> {availableTables} tables</Tag>
    </div>
  </div>
);

export default CreatorPage;
