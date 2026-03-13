export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  distanceMinutes: number;
  address: string;
  photo: string;
  priceRange: string;
  budget: number;
  ambiance: string[];
  terrasse: boolean;
  tags: string[];
  foodType: string[];
  isNew: boolean;
  openingHours: string;
  availableTables: number;
  reviews: { stars: number; text: string; author: string }[];
  reservationsThisWeek: number;
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Rouge Barre",
    cuisine: "Gastronomique française",
    rating: 4.7,
    distance: "800m",
    distanceMinutes: 10,
    address: "50 Rue de la Halle, Lille",
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    priceRange: "30€–50€",
    budget: 2,
    ambiance: ["Romantique", "Cosy"],
    terrasse: false,
    tags: ["Gastronomique", "Romantique"],
    foodType: ["Viande", "Poisson"],
    isNew: false,
    openingHours: "12h–14h / 19h–22h30",
    availableTables: 3,
    reviews: [
      { stars: 5, text: "Une expérience incroyable. Les plats sont raffinés et le service impeccable.", author: "Marie L." },
      { stars: 4, text: "Très belle adresse à Lille, un peu bruyant en salle.", author: "Thomas D." },
    ],
    reservationsThisWeek: 12,
  },
  {
    id: "2",
    name: "Bloempot",
    cuisine: "Flamande contemporaine",
    rating: 4.8,
    distance: "1.2km",
    distanceMinutes: 15,
    address: "22 Rue des Bouchers, Lille",
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    priceRange: "50€+",
    budget: 3,
    ambiance: ["Branché", "Entre potes"],
    terrasse: true,
    tags: ["Branché", "Terrasse", "Gastronomique"],
    foodType: ["Viande", "Vegan"],
    isNew: false,
    openingHours: "19h–23h",
    availableTables: 1,
    reviews: [
      { stars: 5, text: "Cuisine créative et locale, un must à Lille !", author: "Sophie M." },
      { stars: 5, text: "Service impeccable, ambiance chaleureuse.", author: "Pierre R." },
      { stars: 4, text: "Menu unique mais quelle qualité !", author: "Camille B." },
    ],
    reservationsThisWeek: 18,
  },
  {
    id: "3",
    name: "Le Barbier qui Fume",
    cuisine: "Barbecue & Fumoir",
    rating: 4.5,
    distance: "600m",
    distanceMinutes: 8,
    address: "69 Rue de la Monnaie, Lille",
    photo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Branché", "Entre potes"],
    terrasse: true,
    tags: ["Branché", "Terrasse", "Rapide"],
    foodType: ["Viande"],
    isNew: false,
    openingHours: "12h–14h30 / 19h–22h",
    availableTables: 5,
    reviews: [
      { stars: 5, text: "Les meilleures viandes fumées de Lille, sans hésiter.", author: "Lucas G." },
      { stars: 4, text: "Ambiance cool, portions généreuses.", author: "Emma V." },
    ],
    reservationsThisWeek: 8,
  },
  {
    id: "4",
    name: "Bierbuik",
    cuisine: "Brasserie flamande",
    rating: 4.3,
    distance: "900m",
    distanceMinutes: 12,
    address: "4 Place Louise de Bettignies, Lille",
    photo: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Entre potes", "Cosy"],
    terrasse: true,
    tags: ["Familial", "Terrasse", "Entre amis"],
    foodType: ["Viande"],
    isNew: true,
    openingHours: "11h30–23h",
    availableTables: 7,
    reviews: [
      { stars: 4, text: "Super sélection de bières et plats copieux.", author: "Antoine F." },
      { stars: 4, text: "Terrasse agréable en été, service sympa.", author: "Julie M." },
    ],
    reservationsThisWeek: 5,
  },
  {
    id: "5",
    name: "Méert",
    cuisine: "Pâtisserie & Salon de thé",
    rating: 4.6,
    distance: "400m",
    distanceMinutes: 5,
    address: "27 Rue Esquermoise, Lille",
    photo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Romantique", "Cosy"],
    terrasse: false,
    tags: ["Gastronomique", "Romantique", "Cosy"],
    foodType: ["Vegan", "Viande"],
    isNew: false,
    openingHours: "9h30–19h",
    availableTables: 4,
    reviews: [
      { stars: 5, text: "Un lieu historique magnifique, les gaufres sont divines.", author: "Claire P." },
      { stars: 5, text: "Cadre somptueux, pâtisseries exceptionnelles.", author: "Marc H." },
    ],
    reservationsThisWeek: 15,
  },
  {
    id: "6",
    name: "Le Cerisier",
    cuisine: "Bistronomique",
    rating: 4.4,
    distance: "1.5km",
    distanceMinutes: 20,
    address: "3 Rue de Gand, Lille",
    photo: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&h=400&fit=crop",
    priceRange: "30€–50€",
    budget: 2,
    ambiance: ["Cosy", "Romantique"],
    terrasse: true,
    tags: ["Romantique", "Terrasse", "Vue sympa"],
    foodType: ["Poisson", "Viande"],
    isNew: true,
    openingHours: "12h–14h / 19h–22h",
    availableTables: 2,
    reviews: [
      { stars: 4, text: "Très bon rapport qualité-prix, cadre charmant.", author: "Nathalie S." },
      { stars: 5, text: "Un petit bijou caché, cuisine de saison parfaite.", author: "David L." },
    ],
    reservationsThisWeek: 3,
  },
];

export interface QuizAnswers {
  guests: number;
  transport: string;
  travelTime: string;
  budget: number;
  food: string;
  ambiance: string;
  terrasse: string;
  novelty: string;
  detail: string;
}

export function matchRestaurants(answers: QuizAnswers): Restaurant[] {
  return restaurants
    .map((r) => {
      let score = 0;
      // Food match +30
      if (answers.food === "Surprise-moi" || r.foodType.includes(answers.food)) score += 30;
      // Ambiance match +25
      if (r.ambiance.includes(answers.ambiance)) score += 25;
      // Budget match +20
      if (answers.budget === r.budget || answers.budget === 3) score += 20;
      // Terrasse +10
      if (answers.terrasse === "Peu importe" || (answers.terrasse === "Oui" && r.terrasse) || (answers.terrasse === "Non" && !r.terrasse)) score += 10;
      // Tag match +5 each
      r.tags.forEach((t) => { if (r.ambiance.includes(t)) score += 5; });
      // Novelty
      if (answers.novelty === "Nouveau" && r.isNew) score += 15;
      if (answers.novelty === "Classique" && !r.isNew) score += 15;
      // Travel time filter
      const maxMin = answers.travelTime === "5 minutes" ? 5 : answers.travelTime === "15 minutes" ? 15 : answers.travelTime === "30 minutes" ? 30 : 999;
      if (r.distanceMinutes > maxMin) score -= 50;
      // Rating bonus
      score += r.rating * 2;
      return { ...r, score };
    })
    .sort((a, b) => (b as any).score - (a as any).score);
}
