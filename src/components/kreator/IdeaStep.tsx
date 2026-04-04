import { useState, useRef, useEffect } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Upload, Lightbulb, X, RefreshCw, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import StepContainer from './StepContainer';
import PhotoUpload from './PhotoUpload';
import { generateIdeas } from '@/lib/kreator-ai';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const IdeaStep = () => {
  const { user, profile } = useAuth();
  const {
    type, input_text, setInputText, input_image_url, setInputImageUrl,
    input_image_description, setInputImageDescription, idea_chosen, setIdeaChosen,
    company_activity, setCompanyActivity, company_sector, setCompanySector, objective
  } = useKreatorStore();
  const [ideas, setIdeas] = useState<{ id: number; title: string; angle: string; description?: string }[]>([]);
  const [showIdeas, setShowIdeas] = useState(false);
  const [showIdeaFields, setShowIdeaFields] = useState(false);
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

    // Show fields first if not already shown
    if (!showIdeaFields) {
      setShowIdeaFields(true);
      return;
    }

    if (!company_activity) {
      toast.error('Renseignez au moins votre activité principale');
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
      setIdeas([
        { id: 1, title: '💡 Avant / Après', angle: 'Preuve sociale', description: 'Montrer la transformation' },
        { id: 2, title: '📚 Astuce du jour', angle: 'Éducatif', description: 'Partager une astuce pratique' },
        { id: 3, title: '🔥 Offre flash', angle: 'Urgence', description: 'Créer un sentiment d\'urgence' },
      ]);
      setShowIdeas(true);
    } finally {
      setLoadingIdeas(false);
    }
  };

  const handleGenerateMore = async () => {
    setLoadingIdeas(true);
    try {
      const result = await generateIdeas(company_activity, company_sector, type, objective);
      setIdeas(result.ideas);
    } catch {
      toast.error('Erreur lors de la génération');
    } finally {
      setLoadingIdeas(false);
    }
  };

  return (
    <StepContainer stepNumber={3} title="Votre idée">
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

      {/* Photo upload (up to 4 reference photos) */}
      <div className="mb-6">
        <PhotoUpload />
      </div>

      {/* Text idea */}
      <div className="mb-6">
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

      {/* "Je n'ai pas d'idée" button - gradient style */}
      {!showIdeas && !loadingIdeas && (
        <Button
          onClick={handleNoIdea}
          className="w-full py-6 text-base font-bold gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn"
        >
          <Lightbulb className="w-5 h-5 mr-2" />
          Je n'ai pas d'idée
        </Button>
      )}

      {/* Activity/Sector inline fields when "Je n'ai pas d'idée" is clicked */}
      {showIdeaFields && !showIdeas && !loadingIdeas && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Activité principale *</label>
              <Input
                value={company_activity}
                onChange={(e) => setCompanyActivity(e.target.value)}
                placeholder="Ex: Coach fitness, Boulangerie..."
                className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Secteur d'activité</label>
              <Input
                value={company_sector}
                onChange={(e) => setCompanySector(e.target.value)}
                placeholder="Ex: Santé, Alimentation..."
                className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <Button
            onClick={handleNoIdea}
            disabled={!company_activity}
            className="w-full py-5 text-base font-bold gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            Générer 3 idées
          </Button>
        </div>
      )}

      {/* Loading */}
      {loadingIdeas && (
        <div className="flex flex-col items-center py-8 mt-4">
          <div className="text-3xl mb-3 animate-bounce">✨</div>
          <p className="text-sm text-muted-foreground">Génération des idées en cours…</p>
          <Loader2 className="w-5 h-5 animate-spin text-primary mt-2" />
        </div>
      )}

      {/* Ideas cards - beautiful card design */}
      {showIdeas && !loadingIdeas && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className={`relative p-5 rounded-xl border-[2px] transition-all duration-300 cursor-pointer ${
                  idea_chosen === idea.title
                    ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'border-foreground/10 hover:border-secondary/50 hover:shadow-md'
                }`}
                style={{
                  background: idea_chosen === idea.title
                    ? 'linear-gradient(135deg, rgba(255,45,115,0.08), rgba(255,106,61,0.08))'
                    : 'linear-gradient(180deg, hsl(0 0% 100% / 0.06), hsl(0 0% 100% / 0.02))',
                }}
                onClick={() => setIdeaChosen(idea.title)}
              >
                {idea_chosen === idea.title && (
                  <div className="absolute -top-2 -right-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="text-center mb-3">
                  <span className="text-2xl">{idea.title.match(/^\p{Emoji}/u)?.[0] || '💡'}</span>
                </div>
                <h3 className="font-bold text-sm text-foreground text-center mb-2">
                  {idea.title.replace(/^\p{Emoji}\s*/u, '')}
                </h3>
                <p className="text-xs text-muted-foreground text-center mb-1">{idea.angle}</p>
                {idea.description && (
                  <p className="text-xs text-muted-foreground text-center">{idea.description}</p>
                )}
                <Button
                  size="sm"
                  className={`mt-4 w-full text-xs font-semibold ${
                    idea_chosen === idea.title
                      ? 'gradient-bg border-0 text-primary-foreground'
                      : 'bg-card border border-foreground/10 text-foreground hover:border-secondary'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdeaChosen(idea.title);
                  }}
                >
                  {idea_chosen === idea.title ? '✓ Idée choisie' : 'Je choisis cette idée'}
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleGenerateMore}
            disabled={loadingIdeas}
          >
            <RefreshCw className="w-3 h-3 mr-1" /> Générer 3 nouvelles idées — 1 crédit
          </Button>
        </div>
      )}
    </StepContainer>
  );
};

export default IdeaStep;
