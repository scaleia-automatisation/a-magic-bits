import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_PLANS, PlanKey } from '@/lib/stripe-plans';
import { Check, Sparkles, Zap, Shield, Clock, Globe, Heart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import MarketingLayout from '@/components/marketing/MarketingLayout';

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
    <MarketingLayout
      title="Tarifs — Créafacile"
      description="Choisissez le plan Créafacile adapté à votre activité. Sans engagement, annulation à tout moment."
    >
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3">
            Choisissez votre plan
          </h1>
          <p className="text-muted-foreground text-lg">
            Débloquez tout le potentiel de Créafacile
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
                  className={`relative card-surface p-6 md:p-8 border rounded-card flex flex-col ${
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
      </div>

      {/* POURQUOI NOUS CHOISIR */}
      <section className="py-12 md:py-16 border-t border-foreground/5 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-foreground/10 bg-card/50 backdrop-blur mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Pourquoi Créafacile</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
              Pourquoi <span className="gradient-text">nous choisir ?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              La solution pensée pour les TPE, PME, freelances, coachs et formateurs qui veulent du résultat sans agence.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Zap, title: '3 clics, 3 minutes', desc: 'Une publication complète prête à publier en moins de temps qu\'un café.' },
              { icon: TrendingUp, title: '10x moins cher qu\'une agence', desc: 'À partir de 0€/mois. Le prix d\'un café pour des contenus dignes d\'un studio.' },
              { icon: Heart, title: 'Pensé pour les non-experts', desc: 'Aucune compétence marketing requise. L\'IA fait le travail à votre place.' },
              { icon: Globe, title: 'Adapté à votre métier', desc: 'L\'IA connaît votre secteur et adapte le ton, le style et les exemples.' },
              { icon: Shield, title: 'Vos données protégées', desc: 'Hébergement européen, conforme RGPD. Vous gardez la propriété de vos contenus.' },
              { icon: Clock, title: 'Sans engagement', desc: 'Annulation en un clic. Crédits reportés. Essai gratuit, sans carte bancaire.' },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-card border border-foreground/5 bg-card hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Pricing;
