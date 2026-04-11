import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import dinouLogo from "@/assets/dinou-logo.png";
import defaultMenuPhoto from "@/assets/menu-placeholder.jpg";

const MenuPage = () => {
  const navigate = useNavigate();
  const restaurantName = sessionStorage.getItem("menuRestaurantName") || "Restaurant";
  const menuPhoto = defaultMenuPhoto;

  return (
    <div className="flex flex-col min-h-screen bg-background px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-heading font-semibold text-foreground">Menu</h1>
      </div>

      <div className="flex flex-col items-center">
        <img
          src={dinouLogo}
          alt="Dinou"
          className="w-20 h-20 object-contain animate-float cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="glass-card rounded-2xl px-5 py-3 mt-2">
          <p className="text-foreground text-center font-body text-sm">
            Voici le menu de <span className="font-semibold">{restaurantName}</span> 🍽️
          </p>
        </div>
      </div>

      <div className="mt-6 max-w-sm mx-auto w-full">
        <div className="glass-card rounded-2xl overflow-hidden">
          <img
            src={menuPhoto}
            alt={`Menu de ${restaurantName}`}
            className="w-full object-contain"
          />
        </div>
        <p className="text-center text-xs text-muted-foreground font-body mt-3">
          Mis à jour le 12 avril 2025
        </p>
      </div>
    </div>
  );
};

export default MenuPage;
