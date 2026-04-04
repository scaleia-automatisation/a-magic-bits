import { useState, useEffect } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Button } from '@/components/ui/button';
import { Download, Save, Share2, RefreshCw } from 'lucide-react';
import StepContainer from './StepContainer';
import { generateImage } from '@/lib/kreator-ai';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const GenerationStep = () => {
  const { user, refreshProfile } = useAuth();
  const {
    type, prompt_en, status, setStatus, result_url, setResultUrl,
    ai_model, format, credits_used, setCreditsUsed, prompt_fr
  } = useKreatorStore();
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [copyText, setCopyText] = useState({ hook: '', description: '', cta: '', hashtags: '' });

  const hasPrompt = prompt_en.length > 0;
  const buttonLabel = type === 'image' ? 'Générer le visuel' : type === 'carousel' ? 'Générer le carrousel' : 'Générer la vidéo';

  const creditsNeeded = type === 'image' ? 1 : type === 'carousel' ? (useKreatorStore.getState().slides_count) : 3;

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Connectez-vous pour générer du contenu');
      return;
    }

    setGenerating(true);
    setStatus('generating');
    setProgress(0);

    // Progress animation
    const interval = setInterval(() => {
      setProgress((p) => (p >= 95 ? p : p + Math.random() * 8));
    }, 500);

    try {
      // Generate image via AI
      const imageUrl = await generateImage(prompt_en, mapModel(ai_model));
      
      clearInterval(interval);
      setProgress(100);

      // Deduct credits atomically
      const { data: deducted } = await supabase.rpc('deduct_credits', {
        p_user_id: user.id,
        p_amount: creditsNeeded,
        p_action: `generate_${type}`,
      });

      if (!deducted) {
        toast.error('Crédits insuffisants');
        setStatus('idle');
        setGenerating(false);
        return;
      }

      // Save generation
      await supabase.from('generations').insert({
        user_id: user.id,
        type,
        ai_model,
        format,
        prompt_en_final: prompt_en,
        prompt_fr_final: prompt_fr,
        result_url: imageUrl,
        credits_used: creditsNeeded,
        status: 'done',
      });

      setResultUrl(imageUrl);
      setCreditsUsed(creditsNeeded);
      setStatus('done');
      await refreshProfile();
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      toast.error('Erreur lors de la génération. Aucun crédit déduit.');
      setStatus('error');
    } finally {
      setGenerating(false);
    }
  };

  // Simulated copywriting (would be Prompt 5 in full version)
  useEffect(() => {
    if (status === 'done') {
      setCopyText({
        hook: 'Découvrez ce qui change tout 🔥',
        description: 'Votre contenu marketing généré par IA, prêt à publier sur vos réseaux sociaux.',
        cta: 'Essayez maintenant →',
        hashtags: '#marketing #contenu #ia #créativité #digital #growth',
      });
    }
  }, [status]);

  if (!hasPrompt) return null;

  return (
    <StepContainer stepNumber={6} title="Génération">
      {status === 'idle' && (
        <Button
          onClick={handleGenerate}
          className="w-full py-6 text-base font-bold gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn"
        >
          {buttonLabel}
        </Button>
      )}

      {status === 'generating' && (
        <div className="flex flex-col items-center py-8">
          <div className="relative w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-muted" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
          </div>
          <div className="text-sm font-medium text-foreground mb-2">
            {progress < 95 ? 'Génération en cours…' : 'Finalisation en cours…'}
          </div>
          <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-bg transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground mt-2">{Math.round(Math.min(progress, 100))}%</span>
        </div>
      )}

      {status === 'done' && result_url && (
        <div className="space-y-6">
          <div className="rounded-card overflow-hidden bg-card border border-foreground/10">
            <img src={result_url} alt="Résultat" className="w-full object-cover" />
          </div>

          <div className="bg-card rounded-card p-5 border border-foreground/10 space-y-3">
            <div>
              <span className="text-xs text-muted-foreground font-medium">HOOK</span>
              <p className="text-sm text-foreground font-semibold">{copyText.hook}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">DESCRIPTION</span>
              <p className="text-sm text-foreground">{copyText.description}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">CTA</span>
              <p className="text-sm text-foreground font-semibold">{copyText.cta}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">HASHTAGS</span>
              <p className="text-sm text-primary">{copyText.hashtags}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-foreground/10 text-foreground hover:border-secondary"
              onClick={() => {
                if (result_url) {
                  const a = document.createElement('a');
                  a.href = result_url;
                  a.download = `kreator-${type}.png`;
                  a.click();
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" /> Télécharger
            </Button>
            <Button variant="outline" className="border-foreground/10 text-foreground hover:border-secondary">
              <Save className="w-4 h-4 mr-2" /> Sauvegarder
            </Button>
            <Button variant="outline" className="border-foreground/10 text-foreground hover:border-secondary">
              <Share2 className="w-4 h-4 mr-2" /> Partager
            </Button>
            <Button
              variant="outline"
              className="border-foreground/10 text-foreground hover:border-secondary"
              onClick={() => {
                setStatus('idle');
                setResultUrl('');
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Régénérer
            </Button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-6">
          <p className="text-destructive font-medium mb-3">Erreur lors de la génération</p>
          <p className="text-sm text-muted-foreground mb-4">Aucun crédit n'a été déduit.</p>
          <Button onClick={handleGenerate} className="gradient-bg border-0 text-primary-foreground">
            <RefreshCw className="w-4 h-4 mr-2" /> Réessayer
          </Button>
        </div>
      )}
    </StepContainer>
  );
};

function mapModel(model: string): string {
  switch (model) {
    case 'dall-e-3': return 'google/gemini-3.1-flash-image-preview';
    case 'nano-banana-2': return 'google/gemini-3.1-flash-image-preview';
    case 'nano-banana-pro': return 'google/gemini-3-pro-image-preview';
    case 'imagen': return 'google/gemini-3.1-flash-image-preview';
    default: return 'google/gemini-3.1-flash-image-preview';
  }
}

export default GenerationStep;
