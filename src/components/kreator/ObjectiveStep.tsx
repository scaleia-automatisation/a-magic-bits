import { useKreatorStore } from '@/store/useKreatorStore';
import { Input } from '@/components/ui/input';
import StepContainer from './StepContainer';

const ObjectiveStep = () => {
  const {
    objective, setObjective,
    marketing_angle, setMarketingAngle,
    visual_style_brief, setVisualStyleBrief,
  } = useKreatorStore();

  return (
    <StepContainer stepNumber={4} title="Votre objectif">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Objectif du contenu</label>
          <Input
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Ex: Vendre, générer des leads, fidéliser, faire connaître…"
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Angle marketing</label>
          <Input
            value={marketing_angle}
            onChange={(e) => setMarketingAngle(e.target.value)}
            placeholder="Ex: Gain de temps, transformation, statut, économies…"
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Style visuel</label>
          <Input
            value={visual_style_brief}
            onChange={(e) => setVisualStyleBrief(e.target.value)}
            placeholder="Ex: minimaliste premium, lifestyle authentique, cinématographique…"
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </StepContainer>
  );
};

export default ObjectiveStep;