import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dinouLogo from "@/assets/dinou-logo.png";
import { steps, badges } from "@/data/gamification";
import DuolingoPath from "@/components/DuolingoPath";
import DinouEating from "@/components/DinouEating";
import { Button } from "@/components/ui/button";

const GamificationPage = () => {
  const navigate = useNavigate();
  const [triggerEat, setTriggerEat] = useState(false);

  const user = {
    name: "Vincent",
    completedSteps: [1, 2, 3],
    dinous: 320,
    friends: 8,
    rank: 2,
  };

  return (
    <main className="flex flex-col items-center h-full bg-background text-foreground px-4 py-6 overflow-y-auto">
      {/* Score */}
      <DinouEating trigger={triggerEat} />

      <div className="flex items-center mt-2 gap-2">
        <img src={dinouLogo} alt="dinou" className="w-6 h-6" />
        <span className="text-xl font-bold">{user.dinous} Dinous</span>
      </div>

      {/* Profil */}
      <div className="flex flex-col items-center mt-4">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-primary">
          {user.name.charAt(0)}
        </div>
        <h2 className="mt-2 font-semibold text-lg">{user.name}</h2>
        <div className="flex space-x-4 text-sm text-muted-foreground mt-1">
          <span>{user.friends} potes</span>
        </div>
        <Button variant="default" className="mt-3 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl">
          Ajouter des amis
        </Button>
      </div>

      {/* Badges */}
      <div className="flex justify-center flex-wrap gap-2 mt-5">
        {badges.map((b) => (
          <span
            key={b.id}
            className="px-3 py-1.5 rounded-xl text-sm font-medium bg-accent text-accent-foreground"
          >
            {b.name}
          </span>
        ))}
      </div>

      {/* Parcours */}
      <div className="w-full mt-6">
        <h3 className="text-center font-semibold mb-2">Ton parcours 🚀</h3>
        <DuolingoPath steps={steps} completed={user.completedSteps} />
      </div>

      {/* Test button */}
      <Button
        onClick={() => setTriggerEat(true)}
        className="mt-6 mb-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl"
      >
        Gagner des Dinous 🍔
      </Button>
    </main>
  );
};

export default GamificationPage;
