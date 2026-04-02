interface Step {
  id: number;
  title: string;
  reward: number;
}

interface Props {
  steps: Step[];
  completed: number[];
}

const DuolingoPath = ({ steps, completed }: Props) => {
  return (
    <div className="relative flex flex-col items-center mt-4">
      {steps.map((step, index) => {
        const isDone = completed.includes(step.id);
        const isEven = index % 2 === 0;

        return (
          <div
            key={step.id}
            className={`flex items-center w-full ${isEven ? "justify-start" : "justify-end"} my-3`}
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg text-sm font-bold transition-colors
              ${isDone ? "bg-accent text-accent-foreground" : "bg-card text-foreground border border-border"}`}
            >
              {isDone ? "✓" : index + 1}
            </div>

            <div className="mx-3 text-sm max-w-[120px] text-foreground">
              {step.title}
              <span className="block text-xs text-muted-foreground">+{step.reward} Dinous</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DuolingoPath;
