import { useKreatorStore, type ContentType, type AIModel, type VideoResolution, type Format } from '@/store/useKreatorStore';
import { Image, Layers, Video } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  { value: 'sora-2-t2v', label: 'Sora 2 — Text to Video' },
  { value: 'sora-2-i2v', label: 'Sora 2 — Image to Video' },
  { value: 'sora-2-pro-t2v', label: 'Sora 2 Pro — Text to Video' },
  { value: 'sora-2-pro-i2v', label: 'Sora 2 Pro — Image to Video' },
  { value: 'sora-2-pro-character', label: 'Sora 2 Pro — avec Personnage' },
  { value: 'veo-3', label: 'Veo 3' },
  { value: 'veo-3.1', label: 'Veo 3.1' },
  { value: 'grok-imagine-i2v', label: 'Grok Imagine — Image to Video' },
  { value: 'grok-imagine-t2v', label: 'Grok Imagine — Text to Video' },
  { value: 'bytedance/seedance-1.5-pro', label: 'Seedance 1.5 Pro' },
  { value: 'bytedance/seedance-2', label: 'Seedance 2.0' },
  { value: 'kling-2.1', label: 'Kling 2.1' },
  { value: 'kling-2.5', label: 'Kling 2.5' },
  { value: 'kling-2.6', label: 'Kling 2.6' },
  { value: 'kling-3.0', label: 'Kling 3.0' },
];


const formats: { value: Format; label: string; sublabel: string }[] = [
  { value: '9:16', label: '9:16', sublabel: 'Portrait' },
  { value: '16:9', label: '16:9', sublabel: 'Paysage' },
  { value: '1:1', label: '1:1', sublabel: 'Carré' },
];

const ContentTypeStep = () => {
  const {
    type, setType, slides_count, setSlidesCount,
    ai_model, setAiModel,
    format, setFormat,
    video_resolution, setVideoResolution,
  } = useKreatorStore();

  const models = type === 'video' ? videoModels : imageModels;
  const videoGuide = type === 'video' ? videoModelGuidance[ai_model] : null;
  const availableFormats = type === 'video'
    ? formats.filter((f) => f.value !== '1:1')
    : formats;

  return (
    <StepContainer stepNumber={1} title="Type de contenu">
      {/* Content type selector */}
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

      {/* Carousel: slides count */}
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

      {/* Video model guidance + resolution */}
      {type === 'video' && videoGuide && (
        <div className="mb-6 space-y-4">
          <div className="flex gap-3 p-3 rounded-card bg-primary/5 border border-primary/20">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <div className="flex flex-wrap gap-1.5">
                {videoGuide.inputs.map((i) => (
                  <span key={i} className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-pill bg-primary/15 text-primary">
                    {i === 'image' ? '🖼️ Image requise' : '✍️ Texte'}
                  </span>
                ))}
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">{videoGuide.hint}</p>
            </div>
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
      )}

      {/* Format selector — bottom of the same block */}
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">Format</label>
        <div className={`grid gap-2 sm:gap-3 ${availableFormats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {availableFormats.map((f) => (
            <button
              key={f.value}
              onClick={() => setFormat(f.value)}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-card border-[3px] transition-all duration-200 ${
                format === f.value
                  ? 'border-primary bg-card'
                  : 'border-foreground/10 bg-card hover:border-secondary hover:bg-secondary/5'
              }`}
            >
              <div className={`w-10 ${f.value === '9:16' ? 'h-16' : f.value === '16:9' ? 'h-6' : 'h-10'} rounded border-2 ${
                format === f.value ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 bg-muted/30'
              }`} />
              <div className="text-center">
                <div className={`font-bold text-sm ${format === f.value ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {f.label}
                </div>
                <div className="text-xs text-muted-foreground">{f.sublabel}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </StepContainer>
  );
};

export default ContentTypeStep;
