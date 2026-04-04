import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LayoutDashboard, Crown, LogOut, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="p-2 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 bg-background border-b border-foreground/10 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-4xl mx-auto px-4 py-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 mb-2">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm text-foreground">{profile?.credits ?? 0} crédits</span>
                </div>
                <button
                  onClick={() => go('/dashboard')}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-btn text-sm font-medium text-foreground hover:bg-card transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => go('/pricing')}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-btn text-sm font-medium text-foreground hover:bg-card transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Tarifs
                </button>
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-btn text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={() => go('/auth')}
                className="gradient-bg text-primary-foreground w-full py-2.5 rounded-btn text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Commencer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
