import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const PRODUCTION_AUTH_ORIGIN = 'https://www.creafacile.com';

const getGoogleRedirectUri = () => {
  const { hostname, origin } = window.location;

  if (hostname.endsWith('lovable.app') || hostname === 'localhost' || hostname === '127.0.0.1') {
    return PRODUCTION_AUTH_ORIGIN;
  }

  return origin;
};

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    await lovable.auth.signInWithOAuth('google', {
      redirect_uri: getGoogleRedirectUri(),
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black gradient-text mb-2">Créafacile</h1>
          <p className="text-muted-foreground">
            Générez du contenu marketing qui convertit
          </p>
        </div>

        <div className="card-surface p-8 border border-foreground/10 rounded-card">
          <h2 className="text-lg font-bold text-foreground text-center mb-6">
            Commencer gratuitement
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            5 crédits offerts à l'inscription
          </p>

          <Button
            onClick={handleGoogleSignIn}
            className="w-full py-6 bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-btn flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            En continuant, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
