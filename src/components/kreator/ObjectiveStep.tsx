import { useKreatorStore } from '@/store/useKreatorStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StepContainer from './StepContainer';

const OBJECTIVES = [
  '🛒 Vendre un produit / service',
  '🎯 Générer des leads / prospects',
  '📣 Faire connaître la marque (notoriété)',
  '❤️ Engager la communauté',
  '🔁 Fidéliser les clients existants',
  '🚀 Lancer un nouveau produit',
  '📚 Éduquer / informer l\'audience',
  '⭐ Renforcer l\'image de marque',
];

const MARKETING_ANGLES = [
  '⏱️ Gain de temps',
  '💰 Économies / bon plan',
  '✨ Transformation / résultat',
  '👑 Statut / prestige',
  '🛡️ Sécurité / confiance',
  '😊 Plaisir / émotion',
  '🧠 Expertise / autorité',
  '🔥 Urgence / rareté',
  '🤝 Preuve sociale',
  '🎁 Exclusivité / nouveauté',
];

const VISUAL_STYLES = [
  '✨ Minimaliste premium',
  '🌿 Lifestyle authentique',
  '🎬 Cinématographique',
  '🏛️ Luxe / haut de gamme',
  '☀️ Lumineux et naturel',
  '🌑 Sombre et dramatique',
  '🎨 Coloré et pop',
  '📱 UGC / spontané',
  '🖼️ Studio / fond neutre',
  '🌆 Urbain / moderne',
  '🌸 Doux et féminin',
  '⚡ Dynamique et énergique',
];

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
          <Select value={objective} onValueChange={setObjective}>
            <SelectTrigger className="bg-card border-foreground/10 text-foreground">
              <SelectValue placeholder="Choisir un objectif..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-foreground/10">
              {OBJECTIVES.map((o) => (
                <SelectItem key={o} value={o} className="text-foreground focus:bg-secondary/20">{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Angle marketing</label>
          <Select value={marketing_angle} onValueChange={setMarketingAngle}>
            <SelectTrigger className="bg-card border-foreground/10 text-foreground">
              <SelectValue placeholder="Choisir un angle..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-foreground/10">
              {MARKETING_ANGLES.map((a) => (
                <SelectItem key={a} value={a} className="text-foreground focus:bg-secondary/20">{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Style visuel</label>
          <Select value={visual_style_brief} onValueChange={setVisualStyleBrief}>
            <SelectTrigger className="bg-card border-foreground/10 text-foreground">
              <SelectValue placeholder="Choisir un style visuel..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-foreground/10">
              {VISUAL_STYLES.map((v) => (
                <SelectItem key={v} value={v} className="text-foreground focus:bg-secondary/20">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </StepContainer>
  );
};

export default ObjectiveStep;