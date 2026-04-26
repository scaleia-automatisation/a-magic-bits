import boosterLogo from '@/assets/creafacile-logo.png';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface LegalPageLayoutProps {
  children: React.ReactNode;
}

const LegalPageLayout = ({ children }: LegalPageLayoutProps) => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/5">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <img src={boosterLogo} alt="Créafacile" className="h-12 md:h-[62px] cursor-pointer" onClick={() => navigate('/')} />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-9 w-9" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-14">
        <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground hover:text-foreground gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> Retour
        </Button>
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
          {children}
        </div>
      </main>

      <footer className="border-t border-foreground/5 py-6 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-muted-foreground">
          © 2026 Créafacile — Génération de contenu marketing par IA
        </div>
      </footer>
    </div>
  );
};

export default LegalPageLayout;
