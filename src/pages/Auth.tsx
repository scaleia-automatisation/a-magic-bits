import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const PRODUCTION_AUTH_ORIGIN = 'https://www.creafacile.com';

const getRedirectOrigin = () => {
  const { hostname, origin } = window.location;
  // En production custom domain on force www.creafacile.com pour cohérence OAuth
  if (hostname === 'creafacile.com') {
    return PRODUCTION_AUTH_ORIGIN;
  }
  // Sinon (preview lovable.app, localhost, www.creafacile.com) on reste sur l'origine courante
  return origin;
};

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) localStorage.setItem('pending_referral_code', ref.toUpperCase());
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'signin' || mode === 'forgot') setTab(mode);
  }, [searchParams]);

  useEffect(() => {
    if (user && !loading) navigate('/app');
  }, [user, loading, navigate]);

  const handleGoogle = async () => {
    setSubmitting(true);
    const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: getRedirectOrigin() });
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error.message || 'Impossible de se connecter avec Google.');
      return;
    }

    if (!result.redirected) {
      toast.success('Connexion réussie');
      navigate('/app', { replace: true });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : error.message);
      return;
    }
    toast.success('Connexion réussie');
    navigate('/app', { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setSubmitting(true);
    const referralCode = localStorage.getItem('pending_referral_code') || undefined;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getRedirectOrigin()}/app`,
        data: {
          full_name: fullName,
          name: fullName,
          ...(referralCode ? { referral_code: referralCode } : {}),
        },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse.');
    setTab('signin');
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getRedirectOrigin()}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Email envoyé ! Consultez votre boîte mail pour réinitialiser votre mot de passe.');
    setTab('signin');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black gradient-text mb-2">Créafacile</h1>
          <p className="text-muted-foreground">Générez du contenu marketing qui convertit</p>
        </div>

        <div className="card-surface p-8 border border-foreground/10 rounded-card">
          <Button
            onClick={handleGoogle}
            disabled={submitting}
            className="w-full py-6 bg-foreground text-background hover:bg-foreground/90 font-semibold rounded-btn flex items-center justify-center gap-3 mb-6"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-foreground/10" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou avec votre email</span>
            </div>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Connexion</TabsTrigger>
              <TabsTrigger value="signup">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Mot de passe</Label>
                  <div className="relative">
                    <Input id="signin-password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={submitting} className="w-full gradient-bg text-primary-foreground font-semibold rounded-btn">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Se connecter
                </Button>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Mot de passe oublié ?
                </button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nom complet</Label>
                  <Input id="signup-name" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jean Dupont" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <div className="relative">
                    <Input id="signup-password" type={showPassword ? 'text' : 'password'} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8 caractères minimum" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={submitting} className="w-full gradient-bg text-primary-foreground font-semibold rounded-btn">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Créer mon compte
                </Button>
                <p className="text-xs text-muted-foreground text-center">5 crédits offerts à l'inscription</p>
              </form>
            </TabsContent>

            <TabsContent value="forgot">
              <form onSubmit={handleForgot} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Entrez votre email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input id="forgot-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
                </div>
                <Button type="submit" disabled={submitting} className="w-full gradient-bg text-primary-foreground font-semibold rounded-btn">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Envoyer le lien
                </Button>
                <button
                  type="button"
                  onClick={() => setTab('signin')}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Retour à la connexion
                </button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground text-center mt-6">
            En continuant, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
