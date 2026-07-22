import { useNavigate, useLocation } from "react-router-dom";
import dinouLogo from "@/assets/dinou-logo.png";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on restaurant pages
  if (location.pathname.startsWith("/restaurant")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-primary h-16 px-4 safe-bottom">
      {/* Profil */}
      <button onClick={() => navigate("/profile")} className="flex flex-col items-center gap-0.5 p-2" aria-label="Profil">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21v-1a6 6 0 0 1 12 0v1" />
        </svg>
      </button>

      {/* Logo central */}
      <button onClick={() => navigate("/")} className="flex items-center justify-center -mt-5" aria-label="Accueil">
        <div className="w-14 h-14 rounded-full border-2 border-accent bg-primary flex items-center justify-center shadow-lg">
          <img src={dinouLogo} alt="Ondinou" className="w-10 h-10 object-contain" />
        </div>
      </button>

      {/* Points */}
      <button onClick={() => navigate("/points")} className="flex flex-col items-center gap-0.5 p-2" aria-label="Points">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="14" width="5" height="8" rx="1" />
          <rect x="9.5" y="6" width="5" height="16" rx="1" />
          <rect x="16" y="10" width="5" height="12" rx="1" />
          <circle cx="12" cy="3" r="1.5" />
        </svg>
      </button>
    </nav>
  );
};

export default BottomNav;
