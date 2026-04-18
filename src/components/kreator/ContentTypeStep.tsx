import { useKreatorStore, type ContentType, type AIModel, type VideoResolution } from '@/store/useKreatorStore';
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
  { value: 'nano-banana-2', label: 'Nano Banana 2 ⚡' },
  { value: 'nano-banana-pro', label: 'Nano Banana Pro 🎨' },
  { value: 'dall-e-3', label: 'DALL-E 3' },
  { value: 'imagen-4', label: 'Imagen 4' },
  { value: 'imagen-4-ultra', label: 'Imagen 4 Ultra' },
  { value: 'imagen-4-fast', label: 'Imagen 4 Fast' },
  { value: 'qwen/image-edit', label: 'Qwen Image Edit ✏️' },
  { value: 'ideogram/character', label: 'Ideogram Character 👤' },
  { value: 'ideogram/image', label: 'Ideogram Image 🖼️' },
];

const videoModels: { value: AIModel; label: string }[] = [
  { value: 'veo-3', label: 'Veo 3' },
  { value: 'veo-3.1', label: 'Veo 3.1' },
  { value: 'kling-2.1', label: 'Kling 2.1' },
  { value: 'kling-2.5', label: 'Kling 2.5' },
  { value: 'kling-2.6', label: 'Kling 2.6' },
  { value: 'kling-3.0', label: 'Kling 3.0 Video' },
  { value: 'grok-imagine', label: 'Grok Imagine' },
  { value: 'bytedance/seedance-2-fast', label: 'Seedance 2 Fast' },
  { value: 'bytedance/seedance-2', label: 'Seedance 2' },
  { value: 'hailuo/2-3-image-to-video-standard', label: 'Hailuo 2.3 I2V Standard' },
  { value: 'hailuo/2-3-image-to-video-standard-pro', label: 'Hailuo 2.3 I2V Standard Pro' },
];

const renderStyles = [
  'Mise en situation réelle (utilisation dans la vie quotidienne)',
  'Fond blanc / neutre (propre, e-commerce)',
  'Style haut de gamme / luxe (éclairage travaillé, rendu premium)',
  'Ambiance naturelle (lumière douce, aspect authentique)',
  'Style storytelling (qui raconte une histoire)',
  'Moment de vie (spontané, humain, naturel)',
  'Avant / après (montre une transformation)',
  'Style épuré / minimaliste (peu d\'éléments)',
  'Style créatif (original, différent)',
  'Réaliste avec effet "waouh" (surprenant mais crédible)',
  'Rendu produit amélioré (plus net, plus propre)',
  'Gros plan détail (zoom sur texture / qualité)',
  'Visuel avec texte (explicatif, marketing)',
  'Style utilisateur (pris sur le vif, authentique)',
  'Style réseaux sociaux (moderne, tendance)',
];

const videoRenderStyles = [
  'Lifestyle (usage réel)',
  'Premium / luxe (cinématographique)',
  'Storytelling émotionnel',
  'UGC (authentique, mobile)',
  'Publicité directe (conversion)',
  'Minimaliste (clean, impact rapide)',
  'Avant / après (transformation)',
  'Démo produit (mise en valeur)',
];

const objectives = [
  '🎯 Capter — Attirer l\'attention',
  '🧲 Retenir — Maintenir l\'intérêt',
  '💡 Convaincre — Créer le désir',
  '🔥 Inciter — Pousser à l\'action',
  '💎 Fidéliser — Faire revenir',
  '✏️ Personnaliser',
];

const ContentTypeStep = () => {
  const {
    type, setType, slides_count, setSlidesCount,
    ai_model, setAiModel, objective, setObjective,
    render_style, setRenderStyle,
    video_render_style, setVideoRenderStyle,
    format, setFormat,
    video_resolution, setVideoResolution
  } = useKreatorStore();

  const models = type === 'video' ? videoModels : imageModels;

  return (
    <StepContainer stepNumber={1} title="Type de contenu">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        {contentTypes.map(({ type: t, label, icon: Icon }) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`relative flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-6 rounded-card border-[3px] transition-all duration-200 ${
              type === t
                ? 'border-primary bg-card shadow-lg shadow-primary/10'
                : 'border-foreground/10 bg-card hover:border-secondary hover:bg-secondary/5'
            }`}
          >
            <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${type === t ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className={`font-semibold text-sm ${type === t ? 'text-foreground' : 'text-muted-foreground'}`}>
              {label}
            </span>
            {type === t && (
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full gradient-bg" />
            )}
          </button>
        ))}
      </div>

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

      {type !== 'video' && (
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Type de rendu</label>
          <Select value={render_style} onValueChange={setRenderStyle}>
            <SelectTrigger className="bg-card border-foreground/10 text-foreground">
              <SelectValue placeholder="Choisir un type de rendu..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-foreground/10">
              {renderStyles.map((r) => (
                <SelectItem key={r} value={r} className="text-foreground focus:bg-secondary/20">
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {type === 'video' && (
        <>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Type de rendu vidéo</label>
            <Select value={video_render_style} onValueChange={setVideoRenderStyle}>
              <SelectTrigger className="bg-card border-foreground/10 text-foreground">
                <SelectValue placeholder="Choisir un type de rendu vidéo..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-foreground/10">
                {videoRenderStyles.map((r) => (
                  <SelectItem key={r} value={r} className="text-foreground focus:bg-secondary/20">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Format vidéo</label>
              <Select value={format} onValueChange={(v) => setFormat(v as '9:16' | '16:9' | '1:1')}>
                <SelectTrigger className="bg-card border-foreground/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-foreground/10">
                  <SelectItem value="9:16" className="text-foreground focus:bg-secondary/20">9:16 (Vertical)</SelectItem>
                  <SelectItem value="16:9" className="text-foreground focus:bg-secondary/20">16:9 (Horizontal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">Résolution</label>
              <Select value={video_resolution} onValueChange={(v) => setVideoResolution(v as VideoResolution)}>
                <SelectTrigger className="bg-card border-foreground/10 text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-foreground/10">
                  <SelectItem value="720p" className="text-foreground focus:bg-secondary/20">720p</SelectItem>
                  <SelectItem value="1080p" className="text-foreground focus:bg-secondary/20">1080p</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </StepContainer>
  );
};

export default ContentTypeStep;