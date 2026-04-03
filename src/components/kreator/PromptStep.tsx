import { useState } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Share2, Pencil, Loader2 } from 'lucide-react';
import StepContainer from './StepContainer';
import { toast } from 'sonner';
import { generatePrompt } from '@/lib/kreator-ai';
import { useAuth } from '@/contexts/AuthContext';

const PromptStep = () => {
  const { user } = useAuth();
  const {
    prompt_fr, setPromptFr, prompt_en, setPromptEn,
    type, format, objective, company_activity, company_sector,
    input_text, idea_chosen, input_image_description,
    options, slides_count
  } = useKreatorStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Connectez-vous pour générer un prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generatePrompt({
        contentType: type,
        format,
        objective,
        ton: options.ton,
        visualStyle: options.visual_style,
        inputText: input_text,
        ideaChosen: idea_chosen,
        companyActivity: company_activity,
        companySector: company_sector,
        showText: options.show_text,
        textContent: options.text_content,
        paletteEnabled: options.palette_enabled,
        paletteHex: options.palette_hex,
        imageDescription: input_image_description,
      });

      setPromptFr(result.prompt_fr || '');
      setPromptEn(result.prompt_en || '');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la génération du prompt');
      // Fallback
      setPromptFr('Photographie commerciale premium montrant un produit en situation lifestyle, éclairage studio professionnel, composition centrée avec espace négatif pour typographie.');
      setPromptEn('Premium commercial photography showcasing a product in lifestyle setting, professional studio lighting, centered composition with negative space for typography.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  const hasPrompt = prompt_fr.length > 0;

  return (
    <>
      {!hasPrompt && (
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-6 text-base font-bold gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Génération en cours…
            </span>
          ) : (
            'Générer le prompt'
          )}
        </Button>
      )}

      {hasPrompt && (
        <StepContainer stepNumber={5} title="Prompt généré">
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

          {/* Re-generate button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            variant="outline"
            className="mt-4 border-foreground/10 text-muted-foreground hover:text-foreground"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Régénérer le prompt
          </Button>
        </StepContainer>
      )}
    </>
  );
};

export default PromptStep;
