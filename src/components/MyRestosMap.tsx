import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import dinouLogo from "@/assets/dinou-logo.png";
import { restaurants as staticRestaurants } from "@/data/restaurants";

interface MapResto {
  id: string;
  name: string;
  address: string;
  photo?: string;
  rating?: number;
  userReview?: string;
  lat?: number;
  lng?: number;
  source: "fav" | "history" | "catalog";
}

interface HistoryItem {
  restaurantId: string;
  name: string;
  date: string;
  rating?: number;
  review?: string;
}

const LILLE_CENTER: [number, number] = [50.633333, 3.066667];
const GEOCACHE_KEY = "ondinou_geocache_lille_nord_v4";
const LEGACY_GEOCACHE_KEYS = [
  "ondinou_geocache_v1",
  "ondinou_geocache_nord_v2",
  "ondinou_geocache_lille_nord_v3",
];

// Département du Nord, France.
const NORD_BBOX = { minLat: 49.95, maxLat: 51.1, minLng: 2.05, maxLng: 4.35 };
const inNord = (lat: number, lng: number) =>
  lat >= NORD_BBOX.minLat &&
  lat <= NORD_BBOX.maxLat &&
  lng >= NORD_BBOX.minLng &&
  lng <= NORD_BBOX.maxLng;

// Custom dinou marker icon
const dinouIcon = L.icon({
  iconUrl: dinouLogo,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -36],
  className: "drop-shadow-lg",
});

const loadCache = (): Record<string, [number, number]> => {
  try {
    LEGACY_GEOCACHE_KEYS.forEach((key) => localStorage.removeItem(key));
    const raw = JSON.parse(localStorage.getItem(GEOCACHE_KEY) || "{}");
    // Purge any legacy entry outside Northern France (e.g. generic restaurant names
    // previously resolved to places in South America).
    const cleaned: Record<string, [number, number]> = {};
    for (const [k, v] of Object.entries(raw as Record<string, [number, number]>)) {
      if (Array.isArray(v) && inNord(v[0], v[1])) cleaned[k] = v;
    }
    return cleaned;
  } catch {
    return {};
  }
};
const saveCache = (c: Record<string, [number, number]>) =>
  localStorage.setItem(GEOCACHE_KEY, JSON.stringify(c));


// Communes de la Métropole Européenne de Lille (MEL)
const MEL_COMMUNES = new Set(
  [
    "lille","lambersart","la madeleine","marcq-en-baroeul","mons-en-baroeul","villeneuve-d'ascq",
    "roubaix","tourcoing","wasquehal","croix","hem","lys-lez-lannoy","lannoy","leers",
    "wattrelos","neuville-en-ferrain","halluin","bondues","mouvaux","marquette-lez-lille",
    "saint-andré-lez-lille","saint-andre-lez-lille","wambrechies","quesnoy-sur-deûle","quesnoy-sur-deule",
    "haubourdin","loos","sequedin","englos","capinghem","lomme","hellemmes","faches-thumesnil",
    "ronchin","lesquin","wattignies","templemars","vendeville","seclin","houplin-ancoisne",
    "noyelles-lès-seclin","noyelles-les-seclin","emmerin","santes","hallennes-lez-haubourdin",
    "wavrin","don","la bassée","la bassee","fournes-en-weppes","fromelles","aubers","bois-grenier",
    "armentières","armentieres","houplines","frelinghien","deûlémont","deulemont","warneton",
    "comines","wervicq-sud","linselles","roncq","bousbecque","tressin","chéreng","chereng",
    "anstaing","forest-sur-marque","sainghin-en-mélantois","sailly-lez-lannoy","willems",
    "baisieux","gruson","péronne-en-mélantois","peronne-en-melantois","bouvines",
  ].map((s) => s.toLowerCase()),
);

async function geocode(q: string): Promise<[number, number] | null> {
  try {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1` +
      `&countrycodes=fr&bounded=1&viewbox=${NORD_BBOX.minLng},${NORD_BBOX.maxLat},${NORD_BBOX.maxLng},${NORD_BBOX.minLat}` +
      `&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    const data = await r.json();
    if (!Array.isArray(data)) return null;
    for (const item of data) {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      if (!inNord(lat, lng)) continue;
      const addr = item.address ?? {};
      // Le département doit être le Nord (59)
      const postcode: string = addr.postcode ?? "";
      if (postcode && !postcode.startsWith("59")) continue;
      const candidates = [
        addr.city, addr.town, addr.village, addr.municipality,
        addr.suburb, addr.city_district, addr.county,
      ]
        .filter(Boolean)
        .map((s: string) => s.toLowerCase());
      const isMEL =
        candidates.some((c) => MEL_COMMUNES.has(c)) ||
        candidates.some(
          (c) => c.includes("lille") || c.includes("métropole") || c.includes("metropole"),
        );
      if (postcode.startsWith("59") || isMEL) return [lat, lng];
    }
  } catch {}
  return null;
}

// Pre-known coordinates for the static restaurant catalog (Lille)
const STATIC_COORDS: Record<string, [number, number]> = {
  "1": [50.6390, 3.0625],
  "2": [50.6418, 3.0641],
  "3": [50.6425, 3.0635],
  "4": [50.6420, 3.0680],
  "5": [50.6400, 3.0610],
};

function BoundsWatcher({ onChange }: { onChange: (ids: string[]) => void }) {
  const map = useMap();
  const restos = (window as any).__ondinou_restos as MapResto[] | undefined;
  const compute = () => {
    if (!restos) return;
    const b = map.getBounds();
    const visible = restos
      .filter((r) => r.lat != null && r.lng != null && b.contains([r.lat!, r.lng!]))
      .map((r) => r.id);
    onChange(visible);
  };
  useMapEvents({ moveend: compute, zoomend: compute, load: compute });
  useEffect(() => {
    compute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restos?.length]);
  return null;
}

interface Props {
  favoriteNames: string[];
  history: HistoryItem[];
}

const MyRestosMap = ({ favoriteNames, history }: Props) => {
  const [coords, setCoords] = useState<Record<string, [number, number]>>(loadCache());
  const [panelOpen, setPanelOpen] = useState(true);
  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  useEffect(() => {
    LEGACY_GEOCACHE_KEYS.forEach((key) => localStorage.removeItem(key));
  }, []);

  // Build the list of restos to show
  const restos = useMemo<MapResto[]>(() => {
    const items: MapResto[] = [];

    // Favorites (named by the user)
    favoriteNames
      .map((n) => n.trim())
      .filter(Boolean)
      .forEach((name, i) => {
        const key = `fav:${name.toLowerCase()}`;
        const c = coords[key];
        const histMatch = history.find(
          (h) => h.name.toLowerCase() === name.toLowerCase(),
        );
        const catMatch = staticRestaurants.find(
          (r) => r.name.toLowerCase() === name.toLowerCase(),
        );
        items.push({
          id: `fav-${i}`,
          name,
          address: catMatch?.address ?? `${name}, Lille`,
          photo: catMatch?.photo,
          rating: histMatch?.rating ?? catMatch?.rating,
          userReview: histMatch?.review,
          lat: c?.[0],
          lng: c?.[1],
          source: "fav",
        });
      });

    // History entries (visited restos)
    history.forEach((h, i) => {
      if (favoriteNames.some((n) => n.toLowerCase() === h.name.toLowerCase())) return;
      const catMatch = staticRestaurants.find((r) => r.id === h.restaurantId);
      const key = catMatch ? `cat:${catMatch.id}` : `fav:${h.name.toLowerCase()}`;
      const c = catMatch ? STATIC_COORDS[catMatch.id] ?? coords[key] : coords[key];
      items.push({
        id: `hist-${i}`,
        name: h.name,
        address: catMatch?.address ?? `${h.name}, Lille`,
        photo: catMatch?.photo,
        rating: h.rating ?? catMatch?.rating,
        userReview: h.review,
        lat: c?.[0],
        lng: c?.[1],
        source: "history",
      });
    });

    return items;
  }, [favoriteNames, history, coords]);

  // Expose to BoundsWatcher
  (window as any).__ondinou_restos = restos;

  // Geocode anything missing coords
  useEffect(() => {
    const missing = restos.filter((r) => r.lat == null);
    if (missing.length === 0) return;
    let cancelled = false;
    (async () => {
      const cache = loadCache();
      for (const r of missing) {
        const key =
          r.source === "fav"
            ? `fav:${r.name.toLowerCase()}`
            : `fav:${r.name.toLowerCase()}`;
        if (cache[key]) continue;
        const c = await geocode(`${r.name}, Lille, France`);
        if (c) cache[key] = c;
        // Polite rate limit for Nominatim
        await new Promise((res) => setTimeout(res, 1100));
        if (cancelled) return;
      }
      saveCache(cache);
      if (!cancelled) setCoords(cache);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restos.map((r) => r.name).join("|")]);

  // Filter out coords outside the Nord department (purges bad legacy cache entries)
  const placedRestos = restos.filter(
    (r) => r.lat != null && r.lng != null && inNord(r.lat!, r.lng!),
  );
  const visibleRestos = placedRestos.filter((r) => visibleIds.includes(r.id));

  return (
    <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden border-2 border-primary/30">
      <MapContainer
        key="lille-nord-map"
        center={LILLE_CENTER}
        zoom={10}
        minZoom={8}
        maxZoom={18}
        scrollWheelZoom
        worldCopyJump={false}
        className="w-full h-full z-0"
      >

        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{y}/{x}.png"
          noWrap
        />
        {placedRestos.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat!, r.lng!]}
            icon={dinouIcon}
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
            }}
          >
            <Popup>
              <div className="w-56">
                {r.photo && (
                  <img
                    src={r.photo}
                    alt={r.name}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                )}
                <div className="font-semibold text-sm">{r.name}</div>
                {r.rating != null && (
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {r.rating}
                  </div>
                )}
                {r.userReview && (
                  <p className="text-xs italic mt-1 text-muted-foreground">
                    « {r.userReview} »
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">{r.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <BoundsWatcher onChange={setVisibleIds} />
      </MapContainer>

      {/* Side panel */}
      <div
        className={`absolute top-2 right-2 bottom-2 z-[400] bg-card/95 backdrop-blur rounded-xl shadow-lg border border-primary/20 transition-all duration-300 ${
          panelOpen ? "w-64" : "w-10"
        }`}
      >
        <button
          onClick={() => setPanelOpen((p) => !p)}
          className="absolute -left-3 top-3 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center shadow"
          aria-label="toggle"
        >
          {panelOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        {panelOpen && (
          <div className="p-3 h-full overflow-y-auto">
            <h4 className="font-semibold text-sm mb-2">
              À l'écran ({visibleRestos.length})
            </h4>
            {visibleRestos.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Aucun restaurant dans cette zone.
              </p>
            )}
            <ul className="space-y-2">
              {visibleRestos.map((r) => (
                <li
                  key={r.id}
                  className="p-2 rounded-lg border border-border bg-background"
                >
                  <div className="font-semibold text-xs">{r.name}</div>
                  {r.rating != null && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {r.rating}
                    </div>
                  )}
                  <div className="text-[10px] text-muted-foreground">{r.address}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {placedRestos.length < restos.length && (
        <div className="absolute bottom-2 left-2 z-[400] bg-card/90 px-2 py-1 rounded-md text-[10px] text-muted-foreground border border-border">
          Localisation des restos en cours…
        </div>
      )}
    </div>
  );
};

export default MyRestosMap;
