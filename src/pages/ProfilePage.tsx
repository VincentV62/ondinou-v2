import { useNavigate } from "react-router-dom";
import dinouLogo from "@/assets/dinou-logo.png";
import { badges } from "@/data/gamification";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const navigate = useNavigate();

  const user = {
    name: "Vincent",
    dinous: 320,
    friends: 8,
    rank: 2,
  };

  return (
    <main className="flex flex-col items-center h-full bg-background text-foreground px-4 py-6 overflow-y-auto">
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

      {/* Lien vers classement */}
      <Button
        onClick={() => navigate("/points")}
        variant="outline"
        className="mt-8 rounded-xl border-primary text-primary"
      >
        Voir mon classement 🚀
      </Button>
    </main>
  );
};

export default ProfilePage;
