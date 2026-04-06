import { useState, useCallback, useRef } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Loader2 } from 'lucide-react';
import StepContainer from './StepContainer';
import { toast } from 'sonner';
import { generatePrompt, callKreatorAI } from '@/lib/kreator-ai';
import { useAuth } from '@/contexts/AuthContext';

const PromptStep = () => {
  const { user } = useAuth();
  const {
    prompt_fr, setPromptFr, prompt_en, setPromptEn,
    type, format, objective, company_activity, company_sector,
    input_text, idea_chosen, input_image_description, input_photos,
    options, slides_count, status, setStatus, setResultUrl, ai_model,
    render_style, video_render_style
  } = useKreatorStore();

  const getImageSynthesis = () => {
    const uploadedPhotos = input_photos.filter(p => p.url);
    if (uploadedPhotos.length === 0) return input_image_description || '';
    const described = uploadedPhotos.map((p, i) => {
      const desc = p.description?.trim() || 'image uploadée sans description textuelle — analyser visuellement';
      return `Image ${i + 1}: ${desc}`;
    });
    if (uploadedPhotos.length === 1) return `Image de référence : ${described[0]}`;
    return `Synthèse de ${uploadedPhotos.length} images de référence : ${described.join(' | ')}. Créer un visuel cohérent qui fusionne harmonieusement ces éléments en lien avec l'objectif et l'idée.`;
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncingEn, setIsSyncingEn] = useState(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        imageDescription: getImageSynthesis(),
        referenceImageCount: input_photos.filter(p => p.url).length,
        aiModel: ai_model,
        renderStyle: render_style,
        videoRenderStyle: video_render_style,
      });

      setPromptFr(result.prompt_fr || '');
      setPromptEn(result.prompt_en || '');
      if (status === 'done' || status === 'error') {
        setStatus('idle');
        setResultUrl('');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la génération du prompt');
      setPromptFr('Photographie commerciale premium montrant un produit en situation lifestyle, éclairage studio professionnel, composition centrée avec espace négatif pour typographie.');
      setPromptEn('Premium commercial photography showcasing a product in lifestyle setting, professional studio lighting, centered composition with negative space for typography.');
    } finally {
      setIsGenerating(false);
    }
  };

  const syncEnglishPrompt = useCallback(async (frenchText: string) => {
    if (!frenchText.trim()) return;
    setIsSyncingEn(true);
    try {
      const data = await callKreatorAI({
        action: 'translate_prompt',
        messages: [{ role: 'user', content: frenchText }],
        system_prompt: `Tu es un traducteur expert. Traduis fidèlement ce prompt français en anglais, optimisé pour un modèle de génération d'image/vidéo IA. Conserve tous les détails techniques, le style, l'ambiance et les instructions. RETOURNE UNIQUEMENT la traduction anglaise, rien d'autre.`,
      });
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        setPromptEn(content.trim());
      }
    } catch (err) {
      console.error('Erreur sync EN:', err);
    } finally {
      setIsSyncingEn(false);
    }
  }, [setPromptEn]);

  const handleFrChange = (newText: string) => {
    setPromptFr(newText);
    if (status === 'done' || status === 'error') {
      setStatus('idle');
      setResultUrl('');
    }
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      syncEnglishPrompt(newText);
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  const hasPrompt = prompt_fr.length > 0;

  return (
    <>
      {!hasPrompt && (
        <div className="flex justify-center">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full max-w-md py-6 text-lg font-extrabold gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Génération en cours…
              </span>
            ) : (
              'Générer le prompt'
            )}
          </Button>
        </div>
      )}

      {hasPrompt && (
        <StepContainer stepNumber={5} title="Prompt généré">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">🇫🇷 Prompt Français</label>
              <span className="text-xs text-muted-foreground">{prompt_fr.length} car.</span>
            </div>
            <Textarea
              value={prompt_fr}
              onChange={(e) => handleFrChange(e.target.value)}
              className="bg-card border-foreground/10 text-foreground text-sm resize-none"
              style={{ minHeight: `${Math.max(120, Math.ceil(prompt_fr.length / 60) * 24)}px` }}
            />
            <div className="flex gap-2 mt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => handleCopy(prompt_fr)}>
                <Copy className="w-3 h-3 mr-1" /> Copier
              </Button>
            </div>
          </div>


          <div className="flex justify-center mt-6">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 py-5 text-base font-extrabold gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Régénérer le prompt
            </Button>
          </div>
        </StepContainer>
      )}
    </>
  );
};

export default PromptStep;