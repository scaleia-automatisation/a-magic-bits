import { useKreatorStore } from '@/store/useKreatorStore';
import { Lightbulb, TrendingUp } from 'lucide-react';

const StartingChoiceButtons = () => {
  const { type, starting_choice, setStartingChoice } = useKreatorStore();

  if (type !== 'image' && type !== 'carousel') return null;

  const choose = (val: 'scratch' | 'perf') => {
    setStartingChoice(starting_choice === val ? '' : val);
  };

  const baseBtn =
    'flex items-center justify-center gap-2 h-auto py-3 px-4 rounded-btn text-xs font-bold border-2 transition-all whitespace-normal leading-tight text-center';

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={() => choose('scratch')}
        className={`${baseBtn} ${
          starting_choice === 'scratch'
            ? 'gradient-bg border-transparent text-primary-foreground shadow-lg shadow-primary/20'
            : 'border-foreground/10 bg-card text-foreground hover:border-primary/40'
        }`}
      >
        <Lightbulb className="w-4 h-4 shrink-0" />
        <span>Je n'ai pas d'idée,<br />partir de zéro</span>
      </button>
      <button
        onClick={() => choose('perf')}
        className={`${baseBtn} ${
          starting_choice === 'perf'
            ? 'gradient-bg border-transparent text-primary-foreground shadow-lg shadow-primary/20'
            : 'border-foreground/10 bg-card text-foreground hover:border-primary/40'
        }`}
      >
        <TrendingUp className="w-4 h-4 shrink-0" />
        <span>S'inspirer d'un post<br />qui a performé</span>
      </button>
    </div>
  );
};

export default StartingChoiceButtons;