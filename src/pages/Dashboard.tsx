import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Coins, Image, Layers, Video, LogOut, Copy, Users, Crown, ArrowUpCircle, ArrowDownCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Generation {
  id: string;
  type: string;
  ai_model: string;
  credits_used: number;
  status: string;
  created_at: string;
  result_url: string | null;
}

interface CreditTransaction {
  id: string;
  type: string;
  amount: number;
  action: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setGenerations(data as Generation[]);
      });
    supabase
      .from('credit_transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (data) setTransactions(data as CreditTransaction[]);
      });
  }, [user]);

  const handleCopyReferral = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(`${window.location.origin}?ref=${profile.referral_code}`);
      toast.success('Lien d\'invitation copié !');
    }
  };

  const typeIcon = (type: string) => {
    if (type === 'carousel') return <Layers className="w-4 h-4" />;
    if (type === 'video') return <Video className="w-4 h-4" />;
    return <Image className="w-4 h-4" />;
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow text-2xl">✨</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/5">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <span
            className="text-lg md:text-xl font-black gradient-text cursor-pointer"
            onClick={() => navigate('/')}
          >
            Kréator
          </span>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1.5 md:gap-2 bg-card px-3 py-1.5 md:px-4 md:py-2 rounded-pill border border-foreground/10">
              <Coins className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              <span className="font-bold text-sm md:text-base text-foreground">{profile.credits}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">crédits</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground p-2"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
          Bonjour{profile.display_name ? `, ${profile.display_name}` : ''} 👋
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="card-surface p-4 md:p-6 border border-foreground/10 rounded-card">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Crédits</span>
            </div>
            <span className="text-3xl font-black text-foreground">{profile.credits}</span>
            <span className="text-xs text-muted-foreground ml-2">
              Plan {profile.plan === 'free' ? 'Gratuit' : profile.plan === 'pro' ? 'Pro' : 'Premium'}
            </span>
          </div>

          <div className="card-surface p-4 md:p-6 border border-foreground/10 rounded-card">
            <div className="flex items-center gap-3 mb-2">
              <Image className="w-5 h-5 text-secondary" />
              <span className="text-sm text-muted-foreground">Générations</span>
            </div>
            <span className="text-3xl font-black text-foreground">{generations.length}</span>
          </div>

          <div className="card-surface p-4 md:p-6 border border-foreground/10 rounded-card cursor-pointer hover:border-primary/30 transition-colors" onClick={handleCopyReferral}>
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Parrainage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground font-mono">{profile.referral_code}</span>
              <Copy className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">+3 crédits par invité</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6 md:mb-8">
          <Button
            onClick={() => navigate('/')}
            className="gradient-bg border-0 text-primary-foreground font-bold px-8 py-6 rounded-btn text-base hover:opacity-90"
          >
            Créer du contenu ✨
          </Button>
          <Button
            onClick={() => navigate('/pricing')}
            variant="outline"
            className="border-primary/30 text-primary font-bold px-8 py-6 rounded-btn text-base hover:bg-primary/10"
          >
            <Crown className="w-4 h-4 mr-2" />
            {profile.plan === 'free' ? 'Passer Pro' : 'Gérer l\'abonnement'}
          </Button>
        </div>

        {/* Credit Transactions */}
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Historique des crédits
        </h2>
        {transactions.length === 0 ? (
          <div className="card-surface p-8 border border-foreground/10 rounded-card text-center mb-8">
            <p className="text-muted-foreground">Aucune transaction pour le moment</p>
          </div>
        ) : (
          <div className="space-y-2 mb-8">
            {transactions.map((tx) => {
              const isCredit = tx.type === 'credit';
              const actionLabel = tx.action
                .replace('renewal_pro', 'Renouvellement Pro')
                .replace('renewal_premium', 'Renouvellement Premium')
                .replace('referral_bonus', 'Bonus parrainage')
                .replace('signup_bonus', 'Bonus inscription')
                .replace('generation_', 'Génération ')
                .replace('image', 'image')
                .replace('carousel', 'carrousel')
                .replace('video', 'vidéo');

              return (
                <div key={tx.id} className="card-surface p-4 border border-foreground/10 rounded-card flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-btn flex items-center justify-center ${
                    isCredit ? 'bg-green-500/10' : 'bg-destructive/10'
                  }`}>
                    {isCredit
                      ? <ArrowUpCircle className="w-5 h-5 text-green-400" />
                      : <ArrowDownCircle className="w-5 h-5 text-destructive" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground capitalize">{actionLabel}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${isCredit ? 'text-green-400' : 'text-destructive'}`}>
                    {isCredit ? '+' : '-'}{tx.amount} crédits
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* History */}
        <h2 className="text-lg font-bold text-foreground mb-4">Historique des générations</h2>
        {generations.length === 0 ? (
          <div className="card-surface p-8 border border-foreground/10 rounded-card text-center">
            <p className="text-muted-foreground">Aucune génération pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {generations.map((gen) => (
              <div key={gen.id} className="card-surface p-4 border border-foreground/10 rounded-card flex items-center gap-4">
                <div className="w-10 h-10 rounded-btn bg-card flex items-center justify-center text-muted-foreground">
                  {typeIcon(gen.type)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground capitalize">{gen.type}</div>
                  <div className="text-xs text-muted-foreground">{gen.ai_model} — {new Date(gen.created_at).toLocaleDateString('fr-FR')}</div>
                </div>
                <div className="text-sm text-muted-foreground">-{gen.credits_used} crédits</div>
                <span className={`text-xs px-2 py-1 rounded-pill ${
                  gen.status === 'done' ? 'bg-green-500/10 text-green-400' :
                  gen.status === 'error' ? 'bg-destructive/10 text-destructive' :
                  'bg-primary/10 text-primary'
                }`}>
                  {gen.status === 'done' ? 'Terminé' : gen.status === 'error' ? 'Erreur' : 'En cours'}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
