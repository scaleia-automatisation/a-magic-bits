import ModeToggle from '@/components/kreator/ModeToggle';
import ContentTypeStep from '@/components/kreator/ContentTypeStep';
import FormatStep from '@/components/kreator/FormatStep';
import IdeaStep from '@/components/kreator/IdeaStep';
import CustomizationStep from '@/components/kreator/CustomizationStep';
import PromptStep from '@/components/kreator/PromptStep';
import GenerationStep from '@/components/kreator/GenerationStep';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-foreground/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black gradient-text">Kréator</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <button className="gradient-bg text-primary-foreground px-4 py-2 rounded-btn text-sm font-semibold hover:opacity-90 transition-opacity">
              Commencer gratuitement
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-black text-center mb-10 leading-tight">
          <span className="gradient-text">L'outil qui crée du contenu</span>
          <br />
          <span className="gradient-text">qui convertit en 3 clics.</span>
        </h1>

        {/* Steps */}
        <div className="space-y-6">
          <ContentTypeStep />
          <FormatStep />
          <IdeaStep />
          <CustomizationStep />
          <PromptStep />
          <GenerationStep />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/5 py-6 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-muted-foreground">
          © 2026 Kréator — Génération de contenu marketing par IA
        </div>
      </footer>
    </div>
  );
};

export default Index;
