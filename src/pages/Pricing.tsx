import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_PLANS, PlanKey } from '@/lib/stripe-plans';
import { Check, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

const Pricing = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planKey: PlanKey) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const plan = STRIPE_PLANS[planKey];
    if (!plan.price_id) return;

    setLoadingPlan(planKey);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId: plan.price_id },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la création du paiement');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'ouverture du portail');
    }
  };

  const currentPlan = profile?.plan || 'free';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span
            className="text-xl font-black gradient-text cursor-pointer"
            onClick={() => navigate('/')}
          >
            Kréator
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            Choisissez votre plan
          </h1>
          <p className="text-muted-foreground text-lg">
            Débloquez tout le potentiel de Kréator
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.entries(STRIPE_PLANS) as [PlanKey, typeof STRIPE_PLANS[PlanKey]][]).map(
            ([key, plan]) => {
              const isCurrentPlan = currentPlan === key;
              const isPopular = key === 'pro';

              return (
                <div
                  key={key}
                  className={`relative card-surface p-8 border rounded-card flex flex-col ${
                    isPopular
                      ? 'border-primary shadow-lg shadow-primary/10'
                      : 'border-foreground/10'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-bg rounded-pill text-xs font-bold text-primary-foreground flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Populaire
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-foreground mb-1">{plan.name}</h2>
                  <div className="mb-6">
                    <span className="text-4xl font-black text-foreground">
                      {plan.price === 0 ? '0€' : `${plan.price.toFixed(2).replace('.', ',')}€`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground text-sm"> / mois</span>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-btn border-foreground/20"
                      disabled
                    >
                      Plan actuel
                    </Button>
                  ) : key === 'free' ? (
                    <Button
                      variant="outline"
                      className="w-full rounded-btn border-foreground/20"
                      disabled
                    >
                      Plan de base
                    </Button>
                  ) : (
                    <Button
                      className={`w-full rounded-btn font-bold ${
                        isPopular
                          ? 'gradient-bg border-0 text-primary-foreground hover:opacity-90'
                          : 'bg-foreground/10 text-foreground hover:bg-foreground/20 border-0'
                      }`}
                      onClick={() => handleSubscribe(key)}
                      disabled={loadingPlan === key}
                    >
                      {loadingPlan === key ? 'Chargement...' : 'S\'abonner'}
                    </Button>
                  )}
                </div>
              );
            }
          )}
        </div>

        {currentPlan !== 'free' && (
          <div className="text-center mt-8">
            <Button
              variant="link"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleManageSubscription}
            >
              Gérer mon abonnement
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Pricing;
