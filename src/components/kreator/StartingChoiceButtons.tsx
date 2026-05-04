import { useKreatorStore } from '@/store/useKreatorStore';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const StartingChoiceButtons = () => {
  const {
    type, starting_choice, setStartingChoice,
    offer_type, product_service, company_activity, company_sector,
  } = useKreatorStore();
  const [scratchError, setScratchError] = useState<string[]>([]);

  if (type !== 'image' && type !== 'carousel') return null;

  const choose = (val: 'scratch' | 'perf') => {
    if (val === 'scratch') {
      const missing: string[] = [];
      if (!offer_type?.trim()) missing.push("Type d'offre");
      if (!product_service?.trim()) missing.push('Produit ou service');
      if (!company_activity?.trim()) missing.push('Activité principale');
      if (!company_sector?.trim()) missing.push("Secteur d'activité");
      if (missing.length > 0 && starting_choice !== 'scratch') {
        setScratchError(missing);
        return;
      }
      setScratchError([]);
    } else {
      setScratchError([]);
    }
    setStartingChoice(starting_choice === val ? '' : val);
  };

  const baseBtn =
    'flex items-center justify-center gap-2 h-auto py-3 px-4 rounded-btn text-xs font-bold border-2 transition-all whitespace-normal leading-tight text-center';

  return (
    <div className="grid grid-cols-2 gap-3 items-start">
      <div className="flex flex-col gap-2">
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
        {scratchError.length > 0 && (
          <div className="flex items-start gap-2 p-3 rounded-btn border border-destructive/40 bg-destructive/10 text-xs text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold mb-1">Champs requis manquants :</div>
              <ul className="list-disc list-inside space-y-0.5">
                {scratchError.map((m) => <li key={m}>{m}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
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