import { useState, useEffect } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Button } from '@/components/ui/button';
import { Download, Save, Share2, RefreshCw } from 'lucide-react';
import StepContainer from './StepContainer';

const GenerationStep = () => {
  const { type, prompt_en, status, setStatus, result_url, setResultUrl } = useKreatorStore();
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);

  const hasPrompt = prompt_en.length > 0;

  const buttonLabel = type === 'image' ? 'Générer le visuel' : type === 'carousel' ? 'Générer le carrousel' : 'Générer la vidéo';

  const handleGenerate = () => {
    setGenerating(true);
    setStatus('generating');
    setProgress(0);
  };

  useEffect(() => {
    if (!generating) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          return p;
        }
        return p + Math.random() * 15;
      });
    }, 300);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setGenerating(false);
      setStatus('done');
      setResultUrl('/placeholder.svg');
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [generating, setStatus, setResultUrl]);

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
            <div
              className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
            />
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

          {/* Marketing text */}
          <div className="bg-card rounded-card p-5 border border-foreground/10 space-y-3">
            <div>
              <span className="text-xs text-muted-foreground font-medium">HOOK</span>
              <p className="text-sm text-foreground font-semibold">Découvrez ce qui change tout 🔥</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">DESCRIPTION</span>
              <p className="text-sm text-foreground">Votre contenu marketing généré par IA, prêt à publier sur vos réseaux sociaux.</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">CTA</span>
              <p className="text-sm text-foreground font-semibold">Essayez maintenant →</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground font-medium">HASHTAGS</span>
              <p className="text-sm text-primary">#marketing #contenu #ia #créativité #digital #growth</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="border-foreground/10 text-foreground hover:border-secondary">
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

export default GenerationStep;
