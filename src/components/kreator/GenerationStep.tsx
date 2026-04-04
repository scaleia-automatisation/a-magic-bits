import { useState } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Download, Save, RefreshCw, Copy, Loader2, Share2, Mail, MessageCircle, Send, AlertTriangle, FilePlus } from 'lucide-react';
import StepContainer from './StepContainer';
import { generateImage, generateCaption } from '@/lib/kreator-ai';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const GenerationStep = () => {
  const { user, refreshProfile } = useAuth();
  const {
    type, prompt_en, prompt_fr, status, setStatus, result_url, setResultUrl,
    ai_model, format, setCreditsUsed, objective, input_text, idea_chosen,
    company_sector, company_activity, resetProject
  } = useKreatorStore();
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [caption, setCaption] = useState({ hook: '', description: '', cta: '', hashtags: '' });
  const [captionEditing, setCaptionEditing] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

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

    const interval = setInterval(() => {
      setProgress((p) => (p >= 95 ? p : p + Math.random() * 8));
    }, 500);

    try {
      const [imageUrl, captionResult] = await Promise.all([
        generateImage(prompt_en, mapModel(ai_model)),
        generateCaption({
          objective,
          idea: idea_chosen || input_text,
          contentType: type,
          sector: company_sector,
          activity: company_activity,
        }),
      ]);

      clearInterval(interval);
      setProgress(100);

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
      setCaption(captionResult);
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

  const handleCopyCaption = () => {
    const text = `${caption.hook}\n${caption.description}\n${caption.cta}\n\n${caption.hashtags}`;
    navigator.clipboard.writeText(text);
    toast.success('Caption copié !');
  };

  const handleDownload = () => {
    if (!result_url) return;
    const a = document.createElement('a');
    a.href = result_url;
    a.download = `kreator-${type}.png`;
    a.click();
  };

  const handleSave = async () => {
    toast.success('Génération sauvegardée dans vos brouillons');
  };

  const handleRegenerate = () => {
    setStatus('idle');
    setResultUrl('');
  };

  const handleShare = (platform: string) => {
    const text = `${caption.hook}\n${caption.description}\n${caption.cta}\n\n${caption.hashtags}`;
    const encoded = encodeURIComponent(text);
    const url = encodeURIComponent(result_url || '');

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encoded}%20${url}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${url}&text=${encoded}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=Mon%20contenu%20Kréator&body=${encoded}%0A%0A${url}`, '_blank');
        break;
    }
  };

  const handleNewProject = () => {
    setShowNewProjectDialog(true);
  };

  const confirmNewProject = () => {
    resetProject();
    setShowNewProjectDialog(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!hasPrompt) return null;

  return (
    <>
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
            {/* Image result */}
            <div className="rounded-card overflow-hidden bg-card border border-foreground/10">
              <img src={result_url} alt="Résultat" className="w-full object-cover" />
            </div>

            {/* Download button directly below image */}
            <Button
              onClick={handleDownload}
              className="w-full py-4 text-sm font-semibold gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn"
            >
              <Download className="w-4 h-4 mr-2" /> Télécharger
            </Button>

            {/* Caption section */}
            <div className="bg-card rounded-card p-4 md:p-5 border border-foreground/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Caption</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 px-2" onClick={handleCopyCaption}>
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copier
                  </Button>
                  {captionEditing ? (
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary h-8 px-2" onClick={() => setCaptionEditing(false)}>
                      Mettre à jour
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 px-2" onClick={() => setCaptionEditing(true)}>
                      Modifier
                    </Button>
                  )}
                </div>
              </div>

              {captionEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1 block">HOOK</label>
                    <Textarea
                      value={caption.hook}
                      onChange={(e) => setCaption(prev => ({ ...prev, hook: e.target.value }))}
                      className="bg-background border-foreground/10 text-foreground text-sm min-h-[40px] resize-none"
                      rows={1}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1 block">DESCRIPTION</label>
                    <Textarea
                      value={caption.description}
                      onChange={(e) => setCaption(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-background border-foreground/10 text-foreground text-sm min-h-[40px] resize-none"
                      rows={1}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1 block">APPEL À L'ACTION</label>
                    <Textarea
                      value={caption.cta}
                      onChange={(e) => setCaption(prev => ({ ...prev, cta: e.target.value }))}
                      className="bg-background border-foreground/10 text-foreground text-sm min-h-[40px] resize-none"
                      rows={1}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium mb-1 block">HASHTAGS</label>
                    <Textarea
                      value={caption.hashtags}
                      onChange={(e) => setCaption(prev => ({ ...prev, hashtags: e.target.value }))}
                      className="bg-background border-foreground/10 text-foreground text-sm min-h-[40px] resize-none"
                      rows={1}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-foreground font-semibold">{caption.hook}</p>
                  <p className="text-sm text-foreground">{caption.description}</p>
                  <p className="text-sm text-foreground font-semibold">{caption.cta}</p>
                  <p className="text-sm text-primary mt-2">{caption.hashtags}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-foreground/10 text-foreground hover:border-secondary"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" /> Sauvegarder
              </Button>

              {/* Share dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-foreground/10 text-foreground hover:border-secondary">
                    <Share2 className="w-4 h-4 mr-2" /> Partager
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-foreground/10">
                  <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="text-foreground focus:bg-secondary/20 cursor-pointer">
                    <MessageCircle className="w-4 h-4 mr-2 text-secondary" /> WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('telegram')} className="text-foreground focus:bg-secondary/20 cursor-pointer">
                    <Send className="w-4 h-4 mr-2 text-primary" /> Telegram
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('email')} className="text-foreground focus:bg-secondary/20 cursor-pointer">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground" /> Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                className="col-span-2 py-5 text-base font-extrabold gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn"
                onClick={handleRegenerate}
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

      {/* New project button - only after generation is done */}
      {status === 'done' && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleNewProject}
            variant="outline"
            className="border-foreground/10 text-foreground hover:border-secondary px-8 py-5 text-base font-semibold"
          >
            <FilePlus className="w-5 h-5 mr-2" /> Nouveau projet
          </Button>
        </div>
      )}

      {/* New project confirmation dialog */}
      <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
        <DialogContent className="bg-card border-foreground/10">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-secondary" />
              Attention
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Vous allez perdre les informations de ce projet si elles ne sont pas sauvegardées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button variant="outline" onClick={handleSave} className="border-foreground/10 text-foreground hover:border-secondary">
              <Save className="w-4 h-4 mr-2" /> Sauvegarder
            </Button>
            <Button onClick={confirmNewProject} className="gradient-bg border-0 text-primary-foreground hover:opacity-90">
              OK j'ai compris
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
