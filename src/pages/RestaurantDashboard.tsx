import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Users, CalendarCheck, Star, Heart, Download, ArrowLeft, ChevronLeft, Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface ReservationRow {
  id: string;
  date: string;
  time: string;
  guests: number;
  status: string | null;
  user_id: string;
  restaurant_id: string;
  client_note: string | null;
  profile?: { first_name: string | null; last_name: string | null } | null;
  review?: { rating: number; text: string | null } | null;
}

const CLIENT_NOTE_OPTIONS = [
  { value: "noir", label: "Noir", color: "#1a1a1a" },
  { value: "rouge", label: "Rouge", color: "#dc2626" },
  { value: "orange", label: "Orange", color: "#f97316" },
  { value: "vert", label: "Vert", color: "#22c55e" },
  { value: "soleil", label: "☀️", color: null },
];

const EMOJI_MAP: Record<number, string> = {
  1: "😢", 2: "😕", 3: "🙂", 4: "😄", 5: "🤩",
};

const MONTH_NAMES = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const DEMO_NAMES = [
  { first_name: "Marie", last_name: "Dupont" },
  { first_name: "Thomas", last_name: "Lefebvre" },
  { first_name: "Camille", last_name: "Bernard" },
  { first_name: "Julien", last_name: "Moreau" },
  { first_name: "Sophie", last_name: "Durand" },
  { first_name: "Lucas", last_name: "Petit" },
  { first_name: "Léa", last_name: "Robert" },
  { first_name: "Hugo", last_name: "Richard" },
  { first_name: "Chloé", last_name: "Simon" },
  { first_name: "Antoine", last_name: "Laurent" },
];

const DEMO_VISITORS_BY_MONTH: Record<number, number> = {
  0: 248,
  1: 316,
  2: 402,
};

function buildMonthlyData(reservations: ReservationRow[]) {
  const counts = new Array(12).fill(0);
  reservations.forEach((r) => {
    const m = new Date(r.date).getMonth();
    counts[m]++;
  });
  return MONTH_NAMES.map((month, i) => ({ label: month, reservations: counts[i], monthIndex: i }));
}

function buildMonthlyVisitorsData(visitorCounts: Record<number, number>) {
  return MONTH_NAMES.map((month, i) => ({ label: month, visitors: visitorCounts[i] || 0, monthIndex: i }));
}

function getWeeksOfMonth(reservations: ReservationRow[], monthIndex: number) {
  const year = new Date().getFullYear();
  const filtered = reservations.filter((r) => {
    const d = new Date(r.date);
    return d.getMonth() === monthIndex && d.getFullYear() === year;
  });

  const weekMap: Record<string, { label: string; reservations: number; weekStart: string }> = {};
  filtered.forEach((r) => {
    const d = new Date(r.date);
    const day = d.getDate();
    const weekNum = Math.ceil(day / 7);
    const key = `S${weekNum}`;
    if (!weekMap[key]) {
      weekMap[key] = { label: key, reservations: 0, weekStart: r.date };
    }
    weekMap[key].reservations++;
  });

  const weeks = Object.values(weekMap).sort((a, b) => a.label.localeCompare(b.label));
  return weeks.length ? weeks : [{ label: "S1", reservations: 0, weekStart: "" }];
}

function getDaysOfWeek(reservations: ReservationRow[], monthIndex: number, weekLabel: string) {
  const year = new Date().getFullYear();
  const weekNum = parseInt(weekLabel.replace("S", ""));
  const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const counts = new Array(7).fill(0);

  reservations.forEach((r) => {
    const d = new Date(r.date);
    if (d.getMonth() === monthIndex && d.getFullYear() === year) {
      const dayOfMonth = d.getDate();
      if (Math.ceil(dayOfMonth / 7) === weekNum) {
        const idx = d.getDay() === 0 ? 6 : d.getDay() - 1;
        counts[idx]++;
      }
    }
  });

  return days.map((day, i) => ({ label: day, reservations: counts[i] }));
}

function exportCSV(reservations: ReservationRow[]) {
  const header = "Date,Heure,Client,Couverts,Avis\n";
  const rows = reservations.map((r) => {
    const name = r.profile
      ? `${r.profile.first_name || ""} ${r.profile.last_name || ""}`.trim()
      : "—";
    const review = r.review ? `${r.review.rating}/5` : "—";
    return `${r.date},${r.time},${name},${r.guests},${review}`;
  });
  const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reservations-ondinou.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const chartConfig = {
  reservations: {
    label: "Réservations",
    color: "hsl(var(--accent))",
  },
};

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [restaurantName, setRestaurantName] = useState("Mon restaurant");

  const handleClientNoteChange = async (reservationId: string, value: string) => {
    await supabase.from("reservations").update({ client_note: value } as any).eq("id", reservationId);
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, client_note: value } : r))
    );
  };

  useEffect(() => {
    async function load() {
      const demoMode = sessionStorage.getItem("demo_restaurant") === "table-de-vincent";
      const { data: { user } } = await supabase.auth.getUser();

      if (!user && !demoMode) { navigate("/auth"); return; }

      // Demo bypass: load "Table de Vincent" by name
      if (demoMode) {
        const { data: demoResto } = await supabase
          .from("restaurants")
          .select("id, name")
          .ilike("name", "%vincent%")
          .limit(1)
          .maybeSingle();

        if (demoResto) {
          setRestaurantName(demoResto.name);
          const { data: resData } = await supabase
            .from("reservations")
            .select("*")
            .eq("restaurant_id", demoResto.id)
            .order("date", { ascending: false })
            .limit(100);
          if (resData) {
            const userIds = [...new Set(resData.map(r => r.user_id))];
            const resIds = resData.map(r => r.id);
            const [profilesRes, reviewsRes] = await Promise.all([
              supabase.from("profiles").select("user_id, first_name, last_name").in("user_id", userIds.length ? userIds : ["none"]),
              supabase.from("reviews").select("reservation_id, rating, text").in("reservation_id", resIds.length ? resIds : ["none"]),
            ]);
            const profileMap = new Map((profilesRes.data || []).map(p => [p.user_id, p]));
            const reviewMap = new Map((reviewsRes.data || []).map(r => [r.reservation_id, r]));
            setReservations(resData.map(r => ({
              ...r,
              profile: profileMap.get(r.user_id) || null,
              review: reviewMap.get(r.id) || null,
            })));
          }
        } else {
          setRestaurantName("Table de Vincent (démo)");
        }
        setLoading(false);
        return;
      }

      // Get owner's restaurant
      const { data: restaurants } = await supabase
        .from("restaurants")
        .select("id, name")
        .eq("owner_id", user!.id)
        .limit(1);

      if (!restaurants?.length) {
        // Demo mode: show all reservations
        const { data: allRes } = await supabase
          .from("reservations")
          .select("*")
          .order("date", { ascending: false })
          .limit(50);

        if (allRes) {
          // Fetch profiles & reviews separately
          const userIds = [...new Set(allRes.map(r => r.user_id))];
          const resIds = allRes.map(r => r.id);
          
          const [profilesRes, reviewsRes] = await Promise.all([
            supabase.from("profiles").select("user_id, first_name, last_name").in("user_id", userIds),
            supabase.from("reviews").select("reservation_id, rating, text").in("reservation_id", resIds),
          ]);

          const profileMap = new Map((profilesRes.data || []).map(p => [p.user_id, p]));
          const reviewMap = new Map((reviewsRes.data || []).map(r => [r.reservation_id, r]));

          setReservations(allRes.map(r => ({
            ...r,
            profile: profileMap.get(r.user_id) || null,
            review: reviewMap.get(r.id) || null,
          })));
        }
        setRestaurantName("ONDINOU Demo");
        setLoading(false);
        return;
      }

      const resto = restaurants[0];
      setRestaurantName(resto.name);

      const { data: resData } = await supabase
        .from("reservations")
        .select("*")
        .eq("restaurant_id", resto.id)
        .order("date", { ascending: false })
        .limit(100);

      if (resData) {
        const userIds = [...new Set(resData.map(r => r.user_id))];
        const resIds = resData.map(r => r.id);

        const [profilesRes, reviewsRes] = await Promise.all([
          supabase.from("profiles").select("user_id, first_name, last_name").in("user_id", userIds.length ? userIds : ["none"]),
          supabase.from("reviews").select("reservation_id, rating, text").in("reservation_id", resIds.length ? resIds : ["none"]),
        ]);

        const profileMap = new Map((profilesRes.data || []).map(p => [p.user_id, p]));
        const reviewMap = new Map((reviewsRes.data || []).map(r => [r.reservation_id, r]));

        // Demo fake names to differentiate reservations from the same user
        const DEMO_NAMES = [
          { first_name: "Marie", last_name: "Dupont" },
          { first_name: "Thomas", last_name: "Lefebvre" },
          { first_name: "Camille", last_name: "Bernard" },
          { first_name: "Julien", last_name: "Moreau" },
          { first_name: "Sophie", last_name: "Durand" },
          { first_name: "Lucas", last_name: "Petit" },
          { first_name: "Léa", last_name: "Robert" },
          { first_name: "Hugo", last_name: "Richard" },
          { first_name: "Chloé", last_name: "Simon" },
          { first_name: "Antoine", last_name: "Laurent" },
        ];

        setReservations(resData.map((r, i) => ({
          ...r,
          profile: DEMO_NAMES[i % DEMO_NAMES.length],
          review: reviewMap.get(r.id) || null,
        })));
      }
      setLoading(false);
    }
    load();
  }, [navigate]);

  const avgRating = reservations.filter(r => r.review).length
    ? (reservations.filter(r => r.review).reduce((s, r) => s + (r.review?.rating || 0), 0) / reservations.filter(r => r.review).length).toFixed(1)
    : "—";

  const superfans = reservations.filter(r => r.review && r.review.rating >= 4).length;

  // Chart drill-down state: null = monthly, number = month selected, [month, week] = week selected
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);

  const monthlyData = useMemo(() => buildMonthlyData(reservations), [reservations]);

  const chartData = useMemo(() => {
    if (selectedMonth !== null && selectedWeek !== null) {
      return getDaysOfWeek(reservations, selectedMonth, selectedWeek);
    }
    if (selectedMonth !== null) {
      return getWeeksOfMonth(reservations, selectedMonth);
    }
    return monthlyData;
  }, [reservations, selectedMonth, selectedWeek, monthlyData]);

  const chartTitle = selectedMonth !== null && selectedWeek !== null
    ? `${MONTH_NAMES[selectedMonth]} — ${selectedWeek}`
    : selectedMonth !== null
      ? `Semaines de ${MONTH_NAMES[selectedMonth]}`
      : "Réservations par mois";

  const handleBarClick = (data: any) => {
    if (selectedMonth === null) {
      setSelectedMonth(data.monthIndex);
    } else if (selectedWeek === null && data.label) {
      setSelectedWeek(data.label);
    }
  };

  const handleChartBack = () => {
    if (selectedWeek !== null) {
      setSelectedWeek(null);
    } else {
      setSelectedMonth(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-primary-foreground hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-heading text-lg font-semibold truncate">{restaurantName}</h1>
      </header>

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {[
            { label: "Clients envoyés ce mois", value: reservations.length, icon: Users, color: "text-secondary" },
            { label: "Réservations ONDINOU", value: reservations.length, icon: CalendarCheck, color: "text-accent" },
            { label: "Note moyenne Dinou", value: avgRating, icon: Star, color: "text-accent" },
            { label: "Superfans", value: superfans, icon: Heart, color: "text-destructive", onClick: () => navigate("/restaurant-superfans") },
          ].map((kpi) => (
            <Card
              key={kpi.label}
              className={`glass-card ${kpi.onClick ? "cursor-pointer transition-transform hover:-translate-y-0.5" : ""}`}
              onClick={kpi.onClick}
              role={kpi.onClick ? "button" : undefined}
              tabIndex={kpi.onClick ? 0 : undefined}
              onKeyDown={kpi.onClick ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  kpi.onClick?.();
                }
              } : undefined}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                <span className="text-2xl font-heading font-bold">{kpi.value}</span>
                <span className="text-xs text-muted-foreground leading-tight">{kpi.label}</span>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Chart with drill-down */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2 flex flex-row items-center gap-2">
              {selectedMonth !== null && (
                <Button variant="ghost" size="icon" onClick={handleChartBack} className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <CardTitle className="text-base font-heading">{chartTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={chartData} onClick={(e) => e?.activePayload && handleBarClick(e.activePayload[0].payload)}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" className="text-xs" />
                  <YAxis allowDecimals={false} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="reservations" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} className="cursor-pointer" />
                </BarChart>
              </ChartContainer>
              {selectedMonth === null && (
                <p className="text-xs text-muted-foreground text-center mt-1">Cliquez sur un mois pour voir les semaines</p>
              )}
              {selectedMonth !== null && selectedWeek === null && (
                <p className="text-xs text-muted-foreground text-center mt-1">Cliquez sur une semaine pour voir les jours</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* CRM Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-card overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-heading">Réservations</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => exportCSV(reservations)}>
                  <Download className="h-4 w-4 mr-1" /> CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <p className="p-6 text-center text-muted-foreground">Chargement…</p>
              ) : reservations.length === 0 ? (
                <p className="p-6 text-center text-muted-foreground">Aucune réservation pour le moment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Heure</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-center">Couverts</TableHead>
                        <TableHead className="text-center">Note laissée</TableHead>
                        <TableHead className="text-center">Note du client</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reservations.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(r.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                            {" — "}{r.time}
                          </TableCell>
                          <TableCell>
                            {r.profile
                              ? `${r.profile.first_name || ""} ${r.profile.last_name || ""}`.trim() || "—"
                              : "—"}
                          </TableCell>
                          <TableCell className="text-center">{r.guests}</TableCell>
                          <TableCell className="text-center">
                            {r.review ? (
                              <span title={r.review.text || ""}>
                                {EMOJI_MAP[r.review.rating] || `${r.review.rating}/5`}
                              </span>
                            ) : "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            <Select
                              value={r.client_note || "vert"}
                              onValueChange={(v) => handleClientNoteChange(r.id, v)}
                            >
                              <SelectTrigger className="w-[72px] mx-auto h-8 justify-center px-2">
                                <SelectValue>
                                  {(() => {
                                    const opt = CLIENT_NOTE_OPTIONS.find(o => o.value === (r.client_note || "vert"));
                                    if (!opt) {
                                      return <span className="inline-block h-4 w-8 rounded-full bg-secondary" />;
                                    }
                                    if (opt.value === "soleil") return <Sun className="h-4 w-4 text-accent mx-auto" />;
                                    return (
                                      <span className="flex items-center justify-center">
                                        <span className="inline-block h-4 w-8 rounded-full shrink-0 border border-border/60" style={{ backgroundColor: opt.color! }} />
                                        <span className="sr-only">{opt.label}</span>
                                      </span>
                                    );
                                  })()}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {CLIENT_NOTE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value} aria-label={opt.label}>
                                    <span className="flex min-w-[44px] items-center justify-center">
                                      {opt.value === "soleil" ? (
                                        <>
                                          <Sun className="h-4 w-4 text-accent" />
                                          <span className="sr-only">{opt.label}</span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="inline-block h-4 w-8 rounded-full shrink-0 border border-border/60" style={{ backgroundColor: opt.color! }} />
                                          <span className="sr-only">{opt.label}</span>
                                        </>
                                      )}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
