import ModeToggle from '@/components/kreator/ModeToggle';
import ContentTypeStep from '@/components/kreator/ContentTypeStep';
import FormatStep from '@/components/kreator/FormatStep';
import IdeaStep from '@/components/kreator/IdeaStep';
import CustomizationStep from '@/components/kreator/CustomizationStep';
import PromptStep from '@/components/kreator/PromptStep';
import GenerationStep from '@/components/kreator/GenerationStep';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Coins, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-foreground/5">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-black gradient-text cursor-pointer" onClick={() => navigate('/')}>
            Kréator
          </span>
          <div className="flex items-center gap-4">
            <ModeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-pill border border-foreground/10">
                  <Coins className="w-3.5 h-3.5 text-primary" />
                  <span className="font-bold text-sm text-foreground">{profile?.credits ?? 0}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <button
                className="gradient-bg text-primary-foreground px-4 py-2 rounded-btn text-sm font-semibold hover:opacity-90 transition-opacity"
                onClick={() => navigate('/auth')}
              >
                Commencer gratuitement
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-black text-center mb-10 leading-tight">
          <span className="gradient-text">L'outil qui crée du contenu</span>
          <br />
          <span className="gradient-text">qui convertit en 3 clics.</span>
        </h1>

        <div className="space-y-6">
          <ContentTypeStep />
          <FormatStep />
          <IdeaStep />
          <CustomizationStep />
          <PromptStep />
          <GenerationStep />
        </div>
      </main>

      <footer className="border-t border-foreground/5 py-6 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-muted-foreground">
          © 2026 Kréator — Génération de contenu marketing par IA
        </div>
      </footer>
    </div>
  );
};

export default Index;
