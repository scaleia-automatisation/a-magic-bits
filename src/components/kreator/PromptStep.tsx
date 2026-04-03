import { useState } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Share2, Pencil } from 'lucide-react';
import StepContainer from './StepContainer';
import { toast } from 'sonner';

const PromptStep = () => {
  const { prompt_fr, setPromptFr, prompt_en, setPromptEn, type, slides_count } = useKreatorStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulated prompt generation
    setTimeout(() => {
      setPromptFr('Photographie commerciale premium montrant un produit en situation lifestyle, éclairage studio professionnel, composition centrée avec espace négatif pour typographie. Palette de couleurs harmonieuse, rendu ultra-détaillé 4K.');
      setPromptEn('Premium commercial photography showcasing a product in lifestyle setting, professional studio lighting, centered composition with negative space for typography. Harmonious color palette, ultra-detailed 4K rendering.');
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  const isSlideBased = type === 'carousel';
  const hasPrompt = prompt_fr.length > 0;

  return (
    <>
      {/* Generate button outside step */}
      {!hasPrompt && (
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-6 text-base font-bold gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin-slow">✨</span> Génération en cours…
            </span>
          ) : (
            'Générer le prompt'
          )}
        </Button>
      )}

      {hasPrompt && (
        <StepContainer stepNumber={5} title="Prompt généré">
          {/* French prompt */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">🇫🇷 Prompt Français</label>
              <span className="text-xs text-muted-foreground">{prompt_fr.length}/200</span>
            </div>
            <Textarea
              value={prompt_fr}
              onChange={(e) => setPromptFr(e.target.value)}
              className="bg-card border-foreground/10 text-foreground text-sm min-h-[80px] resize-none"
            />
            <div className="flex gap-2 mt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => handleCopy(prompt_fr)}>
                <Copy className="w-3 h-3 mr-1" /> Copier
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Share2 className="w-3 h-3 mr-1" /> Partager
              </Button>
            </div>
          </div>

          {/* English prompt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">🇬🇧 Prompt English</label>
              <span className="text-xs text-muted-foreground">{prompt_en.length}/200</span>
            </div>
            <Textarea
              value={prompt_en}
              onChange={(e) => setPromptEn(e.target.value)}
              className="bg-card border-foreground/10 text-foreground text-sm min-h-[80px] resize-none"
              readOnly
            />
            <div className="flex gap-2 mt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => handleCopy(prompt_en)}>
                <Copy className="w-3 h-3 mr-1" /> Copier
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Pencil className="w-3 h-3 mr-1" /> Modifier
              </Button>
            </div>
          </div>
        </StepContainer>
      )}
    </>
  );
};

export default PromptStep;
