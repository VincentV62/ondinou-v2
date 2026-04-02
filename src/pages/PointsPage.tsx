import { useState } from "react";
import dinouLogo from "@/assets/dinou-logo.png";
import { steps } from "@/data/gamification";
import DuolingoPath from "@/components/DuolingoPath";
import DinouEating from "@/components/DinouEating";
import { Button } from "@/components/ui/button";

const PointsPage = () => {
  const [triggerEat, setTriggerEat] = useState(false);

  const user = {
    name: "Vincent",
    completedSteps: [1, 2, 3],
    dinous: 320,
  };

  return (
    <main className="flex flex-col items-center h-full bg-background text-foreground px-4 py-6 overflow-y-auto">
      {/* Score */}
      <DinouEating trigger={triggerEat} />

      <div className="flex items-center mt-2 gap-2">
        <img src={dinouLogo} alt="dinou" className="w-6 h-6" />
        <span className="text-xl font-bold">{user.dinous} Dinous</span>
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

export default PointsPage;
