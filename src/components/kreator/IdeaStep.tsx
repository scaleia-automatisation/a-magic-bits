import { useState, useRef } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Upload, Lightbulb, X, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import StepContainer from './StepContainer';
import { generateIdeas } from '@/lib/kreator-ai';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const IdeaStep = () => {
  const { user } = useAuth();
  const {
    type, input_text, setInputText, input_image_url, setInputImageUrl,
    input_image_description, setInputImageDescription, idea_chosen, setIdeaChosen,
    company_activity, company_sector, objective
  } = useKreatorStore();
  const [ideas, setIdeas] = useState<{ id: number; title: string; angle: string; description?: string }[]>([]);
  const [showIdeas, setShowIdeas] = useState(false);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = type === 'video';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Fichier trop volumineux (max 10 Mo)');
        return;
      }
      const url = URL.createObjectURL(file);
      setInputImageUrl(url);
    }
  };

  const handleNoIdea = async () => {
    if (!user) {
      toast.error('Connectez-vous pour générer des idées');
      return;
    }

    if (!company_activity) {
      toast.error('Renseignez votre activité principale en étape 1');
      return;
    }

    setLoadingIdeas(true);
    try {
      const result = await generateIdeas(company_activity, company_sector, type, objective);
      setIdeas(result.ideas);
      setShowIdeas(true);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la génération des idées');
      // Fallback to demo ideas
      setIdeas([
        { id: 1, title: 'Avant / Après', angle: 'Preuve sociale' },
        { id: 2, title: 'Astuce du jour', angle: 'Éducatif' },
        { id: 3, title: 'Offre flash', angle: 'Urgence' },
      ]);
      setShowIdeas(true);
    } finally {
      setLoadingIdeas(false);
    }
  };

  return (
    <StepContainer stepNumber={3} title="Votre idée">
      {/* Loading overlay */}
      {loadingIdeas && (
        <div className="flex flex-col items-center py-6 mb-4">
          <div className="text-3xl mb-3 animate-bounce">✨</div>
          <p className="text-sm text-muted-foreground">Génération en cours…</p>
          <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />
        </div>
      )}

      {/* Ideas cards */}
      {showIdeas && !loadingIdeas && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className={`p-4 rounded-card border-[2px] cursor-pointer transition-all ${
                  idea_chosen === idea.title
                    ? 'border-primary bg-primary/5'
                    : 'border-foreground/10 bg-card hover:border-secondary'
                }`}
                onClick={() => setIdeaChosen(idea.title)}
              >
                <div className="font-semibold text-sm text-foreground mb-1">{idea.title}</div>
                <div className="text-xs text-muted-foreground">{idea.angle}</div>
                {idea.description && (
                  <div className="text-xs text-muted-foreground mt-1">{idea.description}</div>
                )}
                <Button
                  size="sm"
                  variant={idea_chosen === idea.title ? 'default' : 'outline'}
                  className={`mt-3 w-full text-xs ${
                    idea_chosen === idea.title
                      ? 'gradient-bg border-0 text-primary-foreground'
                      : 'border-foreground/10 text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdeaChosen(idea.title);
                  }}
                >
                  {idea_chosen === idea.title ? '✓ Choisie' : 'Choisir cette idée'}
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleNoIdea}
            disabled={loadingIdeas}
          >
            <RefreshCw className="w-3 h-3 mr-1" /> Générer 3 nouvelles idées — 1 crédit
          </Button>
        </div>
      )}

      {/* Upload zone */}
      <div className="mb-6">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          {isVideo ? 'Insérer l\'image de votre produit (optionnel)' : 'Image de référence (optionnel)'}
        </label>
        {input_image_url ? (
          <div className="relative inline-block">
            <img src={input_image_url} alt="Upload" className="max-h-40 rounded-card object-cover" />
            <button
              onClick={() => setInputImageUrl('')}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive flex items-center justify-center"
            >
              <X className="w-3 h-3 text-destructive-foreground" />
            </button>
            <div className="mt-2">
              <Input
                value={input_image_description}
                onChange={(e) => setInputImageDescription(e.target.value)}
                placeholder="Décris ton image..."
                className="bg-card border-foreground/10 text-foreground text-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-foreground/10 rounded-card p-8 flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-colors"
          >
            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Glisser ou cliquer pour importer</span>
            <span className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — max 10 Mo</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      {/* Text idea */}
      <div className="mb-4">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          {isVideo ? 'Description de votre idée de vidéo' : 'Décrivez votre idée…'}
        </label>
        <Textarea
          value={input_text}
          onChange={(e) => {
            if (e.target.value.length <= 500) setInputText(e.target.value);
          }}
          placeholder={isVideo ? 'Décrivez votre idée de vidéo...' : 'Décrivez votre idée de contenu...'}
          className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground min-h-[100px] resize-none"
        />
        <div className="text-xs text-muted-foreground text-right mt-1">
          {input_text.length}/500
        </div>
      </div>

      {/* No idea button */}
      {!showIdeas && !loadingIdeas && (
        <Button
          variant="outline"
          onClick={handleNoIdea}
          className="border-foreground/10 text-muted-foreground hover:text-foreground hover:border-secondary"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Je n'ai pas d'idée
        </Button>
      )}
    </StepContainer>
  );
};

export default IdeaStep;
