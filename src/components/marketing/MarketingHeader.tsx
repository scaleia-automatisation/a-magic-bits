import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import boosterLogo from '@/assets/boosterapp-logo.png';

const links = [
  { label: 'Fonctionnalités', to: '/fonctionnalites' },
  { label: 'Cas d\'usage', to: '/cas-dusage' },
  { label: 'Tarifs', to: '/pricing' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

const MarketingHeader = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-foreground/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={boosterLogo} alt="Créafacile" className="h-10 md:h-12" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Changer de thème"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden md:inline-flex gradient-bg text-primary-foreground px-4 py-2 rounded-pill text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Mon espace
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth')}
                className="hidden md:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="hidden md:inline-flex gradient-bg text-primary-foreground px-4 py-2 rounded-pill text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Essai gratuit
              </button>
            </>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-foreground/5 bg-background">
          <div className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-card"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-foreground/5 mt-2">
              {user ? (
                <button
                  onClick={() => { navigate('/dashboard'); setOpen(false); }}
                  className="w-full gradient-bg text-primary-foreground py-2.5 rounded-pill text-sm font-semibold"
                >
                  Mon espace
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => { navigate('/auth'); setOpen(false); }}
                    className="w-full border border-foreground/10 py-2.5 rounded-pill text-sm font-medium text-foreground"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => { navigate('/auth'); setOpen(false); }}
                    className="w-full gradient-bg text-primary-foreground py-2.5 rounded-pill text-sm font-semibold"
                  >
                    Essai gratuit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MarketingHeader;