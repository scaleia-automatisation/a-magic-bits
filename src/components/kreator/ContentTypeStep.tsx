import { useKreatorStore, type ContentType, type AIModel } from '@/store/useKreatorStore';
import { Image, Layers, Video } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import StepContainer from './StepContainer';

const contentTypes: { type: ContentType; label: string; icon: typeof Image }[] = [
  { type: 'image', label: 'Image', icon: Image },
  { type: 'carousel', label: 'Carrousel', icon: Layers },
  { type: 'video', label: 'Vidéo', icon: Video },
];

const imageModels: { value: AIModel; label: string }[] = [
  { value: 'dall-e-3', label: 'DALL-E 3' },
  { value: 'nano-banana-2', label: 'Nano Banana 2' },
  { value: 'nano-banana-pro', label: 'Nano Banana Pro' },
  { value: 'imagen', label: 'Imagen' },
];

const videoModels: { value: AIModel; label: string }[] = [
  { value: 'sora-2', label: 'Sora 2' },
  { value: 'veo-3', label: 'Veo 3' },
  { value: 'veo-3-fast', label: 'Veo 3 Fast Preview' },
];

const objectives = [
  'Présenter le produit ou service',
  'Développer la notoriété de la marque',
  'Attirer des prospects qualifiés',
  'Mettre en avant les bénéfices et l\'utilité',
  'Éduquer et informer le marché',
  'Créer de l\'engagement',
  'Construire la confiance et la crédibilité',
  'Promouvoir une offre',
  'Convertir en clients (inciter à l\'action)',
  'Fidéliser et générer des recommandations',
];

const ContentTypeStep = () => {
  const {
    type, setType, slides_count, setSlidesCount,
    ai_model, setAiModel, objective, setObjective,
    company_activity, setCompanyActivity, company_sector, setCompanySector
  } = useKreatorStore();

  const models = type === 'video' ? videoModels : imageModels;

  return (
    <StepContainer stepNumber={1} title="Type de contenu">
      {/* Content type cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        {contentTypes.map(({ type: t, label, icon: Icon }) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-card border-[3px] transition-all duration-200 ${
              type === t
                ? 'border-primary bg-card shadow-lg shadow-primary/10'
                : 'border-foreground/10 bg-card hover:border-secondary hover:bg-secondary/5'
            }`}
          >
            <Icon className={`w-8 h-8 ${type === t ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`font-semibold text-sm ${type === t ? 'text-foreground' : 'text-muted-foreground'}`}>
              {label}
            </span>
            {type === t && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full gradient-bg" />
            )}
          </button>
        ))}
      </div>

      {/* Slides count for carousel */}
      {type === 'carousel' && (
        <div className="mb-6">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Nombre de slides</label>
          <div className="flex gap-3">
            {[2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setSlidesCount(n)}
                className={`px-6 py-2 rounded-btn font-medium text-sm transition-all ${
                  slides_count === n
                    ? 'gradient-bg text-primary-foreground'
                    : 'bg-card border border-foreground/10 text-muted-foreground hover:border-secondary'
                }`}
              >
                {n} slides
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Model */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">Modèle IA</label>
        <Select value={ai_model} onValueChange={(v) => setAiModel(v as AIModel)}>
          <SelectTrigger className="bg-card border-foreground/10 text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-foreground/10">
            {models.map((m) => (
              <SelectItem key={m.value} value={m.value} className="text-foreground focus:bg-secondary/20">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Objective */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">Objectif du contenu</label>
        <Select value={objective} onValueChange={setObjective}>
          <SelectTrigger className="bg-card border-foreground/10 text-foreground">
            <SelectValue placeholder="Choisir un objectif..." />
          </SelectTrigger>
          <SelectContent className="bg-card border-foreground/10">
            {objectives.map((o) => (
              <SelectItem key={o} value={o} className="text-foreground focus:bg-secondary/20">
                {o}
              </SelectItem>
            ))}
            <SelectItem value="custom" className="text-foreground focus:bg-secondary/20">
              Objectif personnalisé
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity & Sector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Activité principale</label>
          <Input
            value={company_activity}
            onChange={(e) => setCompanyActivity(e.target.value)}
            placeholder="Ex: Coach fitness, Boulangerie..."
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Secteur d'activité</label>
          <Input
            value={company_sector}
            onChange={(e) => setCompanySector(e.target.value)}
            placeholder="Ex: Santé, Alimentation..."
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </StepContainer>
  );
};

export default ContentTypeStep;
