import { useEffect, useState } from "react";
import dinouLogo from "@/assets/dinou-logo.png";

interface Props {
  trigger: boolean;
}

const DinouEating = ({ trigger }: Props) => {
  const [eating, setEating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setEating(true);
      const t = setTimeout(() => setEating(false), 1500);
      return () => clearTimeout(t);
    }
  }, [trigger]);

  return (
    <div className="flex flex-col items-center">
      <img
        src={dinouLogo}
        alt="Dinou"
        className={`w-20 h-20 object-contain transition-transform duration-500 ${eating ? "scale-110 rotate-6" : ""}`}
      />
      {eating && <div className="mt-2 animate-bounce text-2xl">🍔</div>}
    </div>
  );
};

export default DinouEating;
