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
    photo: "https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=600&h=400&fit=crop",
    priceRange: "30€–50€",
    budget: 2,
    ambiance: ["Romantique", "Cosy"],
    terrasse: false,
    tags: ["Gastronomique", "Romantique"],
    foodType: ["Bistronomie", "Poisson"],
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
    foodType: ["Bistronomie", "Végétarien / Vegan"],
    isNew: false,
    openingHours: "19h–23h",
    availableTables: 1,
    reviews: [
      { stars: 5, text: "Cuisine créative et locale, un must à Lille !", author: "Sophie M." },
      { stars: 5, text: "Service impeccable, ambiance chaleureuse.", author: "Pierre R." },
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
    photo: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Branché", "Entre potes"],
    terrasse: true,
    tags: ["Branché", "Terrasse", "Rapide"],
    foodType: ["Une bonne viande"],
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
    foodType: ["Estaminet"],
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
    foodType: ["Végétarien / Vegan"],
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
    distance: "900m",
    distanceMinutes: 12,
    address: "14 Avenue du Peuple Belge, Lille",
    photo: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&h=400&fit=crop",
    priceRange: "30€–50€",
    budget: 2,
    ambiance: ["Cosy", "Romantique"],
    terrasse: true,
    tags: ["Romantique", "Terrasse", "Vue sympa"],
    foodType: ["Bistronomie", "Poisson"],
    isNew: true,
    openingHours: "12h–14h / 19h–22h",
    availableTables: 2,
    reviews: [
      { stars: 4, text: "Très bon rapport qualité-prix, cadre charmant.", author: "Nathalie S." },
      { stars: 5, text: "Un petit bijou caché, cuisine de saison parfaite.", author: "David L." },
    ],
    reservationsThisWeek: 3,
  },
  {
    id: "7",
    name: "La Table du Clarance",
    cuisine: "Gastronomique étoilée",
    rating: 4.9,
    distance: "1km",
    distanceMinutes: 13,
    address: "32 Rue de la Barre, Lille",
    photo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop&q=80",
    priceRange: "50€+",
    budget: 3,
    ambiance: ["Romantique", "Cosy"],
    terrasse: false,
    tags: ["Gastronomique", "Romantique", "Étoilé"],
    foodType: ["Bistronomie", "Poisson"],
    isNew: false,
    openingHours: "12h–13h30 / 19h30–21h30",
    availableTables: 2,
    reviews: [
      { stars: 5, text: "Un 2 étoiles Michelin exceptionnel, chaque plat est un chef-d'œuvre.", author: "François B." },
      { stars: 5, text: "Cadre sublime dans un hôtel particulier du XVIIe.", author: "Isabelle R." },
    ],
    reservationsThisWeek: 22,
  },
  {
    id: "8",
    name: "Rozo",
    cuisine: "Cuisine créative",
    rating: 4.7,
    distance: "3.5km",
    distanceMinutes: 25,
    address: "800 Avenue de la République, Marcq-en-Barœul",
    photo: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&h=400&fit=crop",
    priceRange: "50€+",
    budget: 3,
    ambiance: ["Branché", "Cosy"],
    terrasse: true,
    tags: ["Gastronomique", "Branché", "Terrasse"],
    foodType: ["Bistronomie", "Végétarien / Vegan"],
    isNew: false,
    openingHours: "12h–14h / 19h30–22h",
    availableTables: 3,
    reviews: [
      { stars: 5, text: "Classé dans le top mondial, une expérience sensorielle unique.", author: "Laurent M." },
      { stars: 5, text: "Menu dégustation époustouflant, chaque bouchée surprend.", author: "Camille T." },
    ],
    reservationsThisWeek: 20,
  },
  {
    id: "9",
    name: "Empreinte",
    cuisine: "Bistronomique",
    rating: 4.6,
    distance: "700m",
    distanceMinutes: 9,
    address: "6 Rue Denis Godefroy, Lille",
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    priceRange: "30€–50€",
    budget: 2,
    ambiance: ["Cosy", "Branché"],
    terrasse: false,
    tags: ["Bistronomique", "Cosy"],
    foodType: ["Bistronomie", "Une bonne viande"],
    isNew: true,
    openingHours: "12h–14h / 19h–22h",
    availableTables: 4,
    reviews: [
      { stars: 5, text: "Une belle découverte, cuisine inventive et produits frais.", author: "Pauline A." },
      { stars: 4, text: "Cadre intimiste et carte qui change avec les saisons.", author: "Julien D." },
    ],
    reservationsThisWeek: 9,
  },
  {
    id: "11",
    name: "L'Gaïette",
    cuisine: "Estaminet flamand",
    rating: 4.3,
    distance: "1.3km",
    distanceMinutes: 16,
    address: "95 Rue Masséna, Lille",
    photo: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Entre potes", "Cosy"],
    terrasse: true,
    tags: ["Estaminet", "Terrasse", "Familial"],
    foodType: ["Estaminet", "Une bonne viande"],
    isNew: false,
    openingHours: "12h–14h30 / 18h30–22h30",
    availableTables: 6,
    reviews: [
      { stars: 4, text: "Une bonne brasserie ch'ti, plats copieux et welsh au top.", author: "Jean-Marc B." },
      { stars: 4, text: "Ambiance conviviale, terrasse sympa en été.", author: "Élodie C." },
    ],
    reservationsThisWeek: 7,
  },
  {
    id: "12",
    name: "Jour de Pêche",
    cuisine: "Poisson & Fruits de mer",
    rating: 4.6,
    distance: "600m",
    distanceMinutes: 8,
    address: "2 Rue de Pas, Lille",
    photo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop&sat=-20",
    priceRange: "30€–50€",
    budget: 2,
    ambiance: ["Cosy", "Romantique"],
    terrasse: false,
    tags: ["Poisson", "Cosy", "Gastronomique"],
    foodType: ["Poisson"],
    isNew: false,
    openingHours: "12h–14h / 19h–22h",
    availableTables: 3,
    reviews: [
      { stars: 5, text: "Le meilleur restaurant de poisson de Lille, produits ultra-frais.", author: "Anne-Sophie K." },
      { stars: 5, text: "Les Saint-Jacques étaient divines, un vrai régal.", author: "Philippe G." },
    ],
    reservationsThisWeek: 14,
  },
  {
    id: "13",
    name: "Chez Raoul",
    cuisine: "Bistrot de quartier",
    rating: 4.2,
    distance: "1.1km",
    distanceMinutes: 14,
    address: "73 Rue de Gand, Lille",
    photo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Entre potes", "Branché"],
    terrasse: true,
    tags: ["Bistrot", "Entre amis", "Terrasse"],
    foodType: ["Estaminet", "Une bonne viande"],
    isNew: false,
    openingHours: "12h–15h / 19h–23h",
    availableTables: 8,
    reviews: [
      { stars: 4, text: "Super ambiance, idéal pour un repas entre potes.", author: "Maxime R." },
      { stars: 4, text: "Les burgers maison sont incroyables.", author: "Léa F." },
    ],
    reservationsThisWeek: 6,
  },
  {
    id: "14",
    name: "Tsuki",
    cuisine: "Japonais",
    rating: 4.6,
    distance: "550m",
    distanceMinutes: 7,
    address: "8 Rue de la Halle, Lille",
    photo: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop",
    priceRange: "30€–50€",
    budget: 2,
    ambiance: ["Cosy", "Branché"],
    terrasse: false,
    tags: ["Japonais", "Cosy", "Branché"],
    foodType: ["Japonais"],
    isNew: false,
    openingHours: "12h–14h / 19h–22h30",
    availableTables: 3,
    reviews: [
      { stars: 5, text: "Sushis frais et omakase exceptionnel, un vrai japonais à Lille.", author: "Yuki T." },
      { stars: 4, text: "Cadre épuré et zen, service attentionné.", author: "Sarah M." },
    ],
    reservationsThisWeek: 11,
  },
  {
    id: "15",
    name: "Côté Sushi",
    cuisine: "Japonais & Nikkei",
    rating: 4.3,
    distance: "750m",
    distanceMinutes: 10,
    address: "10 Rue Faidherbe, Lille",
    photo: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Branché", "Entre potes"],
    terrasse: false,
    tags: ["Japonais", "Rapide", "Branché"],
    foodType: ["Japonais"],
    isNew: false,
    openingHours: "11h30–14h30 / 18h30–22h30",
    availableTables: 5,
    reviews: [
      { stars: 4, text: "Carte japonaise et péruvienne très créative.", author: "Tom L." },
      { stars: 4, text: "Les ceviches et chirashis sont excellents.", author: "Clara B." },
    ],
    reservationsThisWeek: 8,
  },
  {
    id: "16",
    name: "Il Vesuvio",
    cuisine: "Italien",
    rating: 4.5,
    distance: "650m",
    distanceMinutes: 8,
    address: "34 Rue de Béthune, Lille",
    photo: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Cosy", "Romantique"],
    terrasse: true,
    tags: ["Italien", "Cosy", "Terrasse"],
    foodType: ["Italien"],
    isNew: false,
    openingHours: "12h–14h30 / 19h–23h",
    availableTables: 4,
    reviews: [
      { stars: 5, text: "Pizzas napolitaines au feu de bois exceptionnelles.", author: "Marco V." },
      { stars: 5, text: "Ambiance familiale et accueil chaleureux.", author: "Aurélie D." },
    ],
    reservationsThisWeek: 13,
  },
  {
    id: "17",
    name: "La Bottega",
    cuisine: "Trattoria italienne",
    rating: 4.4,
    distance: "550m",
    distanceMinutes: 7,
    address: "7 bis Rue au Péterynck, Lille",
    photo: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Entre potes", "Cosy"],
    terrasse: false,
    tags: ["Italien", "Familial", "Cosy"],
    foodType: ["Italien"],
    isNew: false,
    openingHours: "12h–14h / 19h–22h30",
    availableTables: 5,
    reviews: [
      { stars: 4, text: "Produits italiens d'exception, pâtes fraîches divines.", author: "Giovanni P." },
      { stars: 5, text: "Un petit coin d'Italie au cœur du Vieux-Lille.", author: "Marine H." },
    ],
    reservationsThisWeek: 10,
  },
  {
    id: "18",
    name: "Tiger Wok",
    cuisine: "Asiatique fusion",
    rating: 4.0,
    distance: "450m",
    distanceMinutes: 6,
    address: "43-45 Rue des Tanneurs, Lille",
    photo: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Branché", "Entre potes"],
    terrasse: false,
    tags: ["Asiatique", "Buffet", "Familial"],
    foodType: ["Asiatique"],
    isNew: false,
    openingHours: "11h30–14h30 / 18h30–22h30",
    availableTables: 6,
    reviews: [
      { stars: 4, text: "Buffet à volonté wok, idéal entre amis.", author: "Chloé B." },
      { stars: 4, text: "Bon choix de plats asiatiques, service rapide.", author: "Kevin N." },
    ],
    reservationsThisWeek: 7,
  },
  {
    id: "19",
    name: "La Table de Siam",
    cuisine: "Thaïlandais",
    rating: 4.6,
    distance: "500m",
    distanceMinutes: 7,
    address: "79 Rue de la Monnaie, Lille",
    photo: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Branché", "Cosy"],
    terrasse: false,
    tags: ["Asiatique", "Branché", "Cosy"],
    foodType: ["Asiatique"],
    isNew: false,
    openingHours: "12h–14h / 19h–22h30",
    availableTables: 4,
    reviews: [
      { stars: 5, text: "Pad thaï authentique et curry vert au top.", author: "Lisa K." },
      { stars: 5, text: "Décor soigné, on se croirait à Bangkok.", author: "Adrien M." },
    ],
    reservationsThisWeek: 9,
  },
  {
    id: "20",
    name: "Au Vieux de la Vieille",
    cuisine: "Estaminet flamand",
    rating: 4.4,
    distance: "300m",
    distanceMinutes: 4,
    address: "2-4 Rue des Vieux Murs, Lille",
    photo: "https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Cosy", "Convivial"],
    terrasse: true,
    tags: ["Estaminet", "Flamand", "Terrasse"],
    foodType: ["Estaminet", "Une bonne viande"],
    isNew: false,
    openingHours: "12h–14h30 / 19h–22h30",
    availableTables: 4,
    reviews: [
      { stars: 5, text: "Carbonade flamande délicieuse, ambiance ch'ti garantie.", author: "Sandrine P." },
      { stars: 4, text: "Belle terrasse sur la place aux Oignons, service chaleureux.", author: "Romain G." },
    ],
    reservationsThisWeek: 14,
  },
  {
    id: "21",
    name: "Solange",
    cuisine: "Végétarien & Vegan",
    rating: 4.5,
    distance: "650m",
    distanceMinutes: 8,
    address: "107 Rue de Solférino, Lille",
    photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Cosy", "Branché"],
    terrasse: true,
    tags: ["Végétarien", "Cosy", "Terrasse"],
    foodType: ["Végétarien / Vegan"],
    isNew: true,
    openingHours: "12h–14h30 / 19h–22h",
    availableTables: 5,
    reviews: [
      { stars: 5, text: "Enfin un vrai restaurant vegan gourmand à Lille !", author: "Émilie T." },
      { stars: 5, text: "Même les carnivores adorent, c'est dire !", author: "Benoît L." },
    ],
    reservationsThisWeek: 10,
  },
  {
    id: "22",
    name: "Estaminet Chez la Vieille",
    cuisine: "Estaminet ch'ti",
    rating: 4.5,
    distance: "250m",
    distanceMinutes: 3,
    address: "60 Rue de Gand, Lille",
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Cosy", "Convivial"],
    terrasse: false,
    tags: ["Estaminet", "Ch'ti", "Authentique"],
    foodType: ["Estaminet", "Une bonne viande"],
    isNew: false,
    openingHours: "12h–14h30 / 19h–23h",
    availableTables: 3,
    reviews: [
      { stars: 5, text: "Welsh complet incroyable, on s'y croirait chez mémé.", author: "Henri D." },
      { stars: 5, text: "Ambiance unique rue de Gand, à faire absolument.", author: "Valérie S." },
    ],
    reservationsThisWeek: 16,
  },
  {
    id: "23",
    name: "Alcide",
    cuisine: "Bistronomique",
    rating: 4.5,
    distance: "1km",
    distanceMinutes: 13,
    address: "5 Rue des Débris Saint-Étienne, Lille",
    photo: "https://images.unsplash.com/photo-1428515613728-6b4607e44363?w=600&h=400&fit=crop",
    priceRange: "30€–50€",
    budget: 2,
    ambiance: ["Cosy", "Branché"],
    terrasse: false,
    tags: ["Bistronomique", "Cosy", "Branché"],
    foodType: ["Bistronomie", "Une bonne viande"],
    isNew: true,
    openingHours: "12h–13h30 / 19h30–21h30",
    availableTables: 2,
    reviews: [
      { stars: 5, text: "Cuisine du marché sublime, menu surprise qui vaut le détour.", author: "Olivier F." },
      { stars: 5, text: "Étoilé Michelin récent et mérité !", author: "Stéphanie W." },
    ],
    reservationsThisWeek: 15,
  },
  {
    id: "24",
    name: "La Laiterie",
    cuisine: "Gastronomique",
    rating: 4.7,
    distance: "2.5km",
    distanceMinutes: 18,
    address: "138 Avenue de l'Hippodrome, Lambersart",
    photo: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop",
    priceRange: "50€+",
    budget: 3,
    ambiance: ["Romantique", "Cosy"],
    terrasse: true,
    tags: ["Gastronomique", "Étoilé", "Romantique"],
    foodType: ["Bistronomie", "Poisson"],
    isNew: false,
    openingHours: "12h–13h30 / 19h30–21h30",
    availableTables: 2,
    reviews: [
      { stars: 5, text: "Institution lilloise, une valeur sûre étoilée depuis des années.", author: "Gérard M." },
      { stars: 5, text: "Cadre verdoyant, cuisine d'exception.", author: "Monique R." },
    ],
    reservationsThisWeek: 19,
  },
  {
    id: "25",
    name: "L'Écume des Mers",
    cuisine: "Fruits de mer & Poisson",
    rating: 4.5,
    distance: "400m",
    distanceMinutes: 5,
    address: "10 Rue de Pas, Lille",
    photo: "https://images.unsplash.com/photo-1615141982690-7a04f6943ed6?w=600&h=400&fit=crop",
    priceRange: "30€–50€",
    budget: 2,
    ambiance: ["Cosy", "Romantique"],
    terrasse: false,
    tags: ["Poisson", "Cosy", "Romantique"],
    foodType: ["Poisson"],
    isNew: false,
    openingHours: "12h–14h / 19h–22h",
    availableTables: 3,
    reviews: [
      { stars: 5, text: "Plateau de fruits de mer exceptionnel, ultra frais.", author: "Jacques P." },
      { stars: 4, text: "Une institution pour les amateurs de poisson.", author: "Christine L." },
    ],
    reservationsThisWeek: 12,
  },
  {
    id: "26",
    name: "Sébastopol",
    cuisine: "Brasserie & Cocktails",
    rating: 4.3,
    distance: "550m",
    distanceMinutes: 7,
    address: "1 Place Sébastopol, Lille",
    photo: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop",
    priceRange: "20€–30€",
    budget: 1,
    ambiance: ["Branché", "Entre potes"],
    terrasse: true,
    tags: ["Estaminet", "Branché", "Terrasse"],
    foodType: ["Estaminet"],
    isNew: false,
    openingHours: "10h–01h",
    availableTables: 8,
    reviews: [
      { stars: 4, text: "Super spot pour un brunch ou un apéro en terrasse.", author: "Alex D." },
      { stars: 4, text: "Cocktails inventifs et planches à partager au top.", author: "Manon S." },
    ],
    reservationsThisWeek: 6,
  },
];

export type QuizAnswers = Record<string, string>;

import { loadCategorizations } from "./quiz";

// Weight per question when comparing user answer to resto categorization
const QUESTION_WEIGHTS: Record<string, number> = {
  q3: 30, q4: 25, q7: 20, q9: 15, q8: 12, q11: 10, q14: 10,
  q10: 8, q12: 6, q13: 6, q15: 6, q16: 4, q17: 4, q1: 2, q2: 2, q5: 2,
};

function budgetFromQ7(v?: string): number | null {
  if (!v) return null;
  if (v.startsWith("Moins de 15")) return 0;
  if (v.startsWith("15")) return 1;
  if (v.startsWith("30")) return 2;
  if (v.startsWith("50")) return 3;
  if (v.startsWith("80")) return 3;
  return null;
}

function maxMinutesFromQ6(v?: string): number {
  if (!v) return 999;
  if (v.startsWith("5")) return 5;
  if (v.startsWith("10")) return 10;
  if (v.startsWith("30")) return 30;
  return 999;
}

export function matchRestaurants(answers: QuizAnswers): Restaurant[] {
  const cats = loadCategorizations();
  const maxMin = maxMinutesFromQ6(answers.q6);
  const userBudget = budgetFromQ7(answers.q7);
  const q3 = answers.q3;
  const q4 = answers.q4;
  const q9 = answers.q9;
  const q11 = answers.q11;

  return restaurants
    .map((r) => {
      let score = r.rating * 2;
      const cat = cats[r.id];

      // Categorization-driven scoring (when creator has tagged the resto)
      if (cat) {
        for (const [qid, weight] of Object.entries(QUESTION_WEIGHTS)) {
          const ua = answers[qid];
          const ra = cat[qid];
          if (!ua || !ra) continue;
          if (ua === ra || ua.startsWith("Peu importe") || ra === "Peu importe") score += weight;
        }
      }

      // Fallback heuristics on legacy fields (always applied)
      if (q3 && q3 !== "Peu importe - Surprends-moi") {
        const cuisineLower = r.cuisine.toLowerCase();
        const map: Record<string, string[]> = {
          "Cuisine française et du terroir": ["français", "brasserie", "estaminet", "ch'ti", "flamand", "bistrot", "bistronomique", "gastronomique"],
          "Cuisine italienne et méditerranéenne": ["italien", "pizza", "pasta", "trattoria", "espagnol", "tapas", "grec", "libanais", "méditerra"],
          "Cuisine asiatique": ["japonais", "sushi", "chinois", "thaï", "coréen", "indien", "asiatique", "ramen"],
          "Viandes, grillades & plats généreux": ["viande", "steak", "burger", "grillade", "bbq", "boucher"],
          "Poissons, fruits de mer & produits de la mer": ["poisson", "fruits de mer", "mer", "sushi", "huître"],
          "Cuisine créative & tendance": ["bistronomique", "fusion", "végét", "vegan", "créati", "street"],
        };
        const kws = map[q3] || [];
        if (kws.some((k) => cuisineLower.includes(k))) score += 20;
      }
      if (q4 && q4 !== "Peu importe") {
        const kw = q4.toLowerCase().split(" ")[0];
        if (r.cuisine.toLowerCase().includes(kw) || r.tags.some(t => t.toLowerCase().includes(kw))) score += 10;
      }
      if (userBudget !== null) {
        if (Math.abs(r.budget - userBudget) === 0) score += 15;
        else if (Math.abs(r.budget - userBudget) === 1) score += 5;
      }
      if (q9) {
        const ambMap: Record<string, string[]> = {
          "Intime et cosy": ["Cosy", "Romantique"],
          "Animé et festif": ["Branché", "Festif", "Entre potes"],
          "Chic et élégant": ["Romantique", "Cosy"],
          "Décontracté et convivial": ["Convivial", "Entre potes"],
          "Original ou atypique": ["Branché"],
        };
        if ((ambMap[q9] || []).some((a) => r.ambiance.includes(a))) score += 10;
      }
      if (q11) {
        if (q11.startsWith("Grande") && r.terrasse) score += 8;
        else if (q11.startsWith("Un coin") && r.terrasse) score += 4;
        else if (q11.startsWith("Intérieur") && !r.terrasse) score += 4;
      }

      // Distance hard filter
      if (r.distanceMinutes > maxMin) score -= 50;

      return { ...r, score } as Restaurant & { score: number };
    })
    .sort((a, b) => (b as any).score - (a as any).score);
}
