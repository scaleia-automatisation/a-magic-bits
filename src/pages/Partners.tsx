import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, DollarSign, Users, Sparkles, Zap, Trophy, Heart, CheckCircle2, Gift, Mail } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import PartnershipForm from '@/components/marketing/PartnershipForm';
import ReferralSection from '@/components/marketing/ReferralSection';

const Partners = () => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <MarketingLayout
      title="Partenaires & Parrainage — Créafacile"
      description="Programme partenaire Créafacile et parrainage : invitez jusqu'à 10 amis, gagnez 5 crédits chacun. Commissions attractives pour influenceurs, créateurs et entreprises."
    >
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-foreground/10 bg-card/50 backdrop-blur mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium">Programme partenaires & parrainage</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-foreground">Recommandez Créafacile,</span><br />
            <span className="gradient-text italic">soyez récompensé.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Deux façons de gagner : <strong className="text-foreground">parrainez vos amis</strong> et recevez 5 crédits par inscription,
            ou rejoignez le <strong className="text-foreground">programme partenaire</strong> pour toucher 30% de commission récurrente.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => scrollTo('parrainage')}
              className="gradient-bg text-primary-foreground px-7 py-3.5 rounded-pill text-base font-semibold hover:opacity-90 inline-flex items-center justify-center gap-2"
            >
              <Gift className="w-4 h-4" />
              Parrainer un ami
            </button>
            <button
              onClick={() => scrollTo('programme-partenaire')}
              className="border border-foreground/15 text-foreground px-7 py-3.5 rounded-pill text-base font-semibold hover:bg-card transition-colors inline-flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Devenir partenaire
            </button>
          </div>
        </div>
      </section>

      {/* SECTION PARRAINAGE */}
      <section id="parrainage" className="py-12 md:py-16 border-y border-foreground/5 bg-card/30 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-foreground/10 bg-card mb-5">
              <Gift className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Parrainage</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
              Invitez jusqu'à 10 amis,<br />
              <span className="gradient-text italic">gagnez 5 crédits chacun.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              À chaque ami qui s'inscrit avec votre code, vous recevez <strong className="text-foreground">5 crédits</strong> et il en reçoit aussi <strong className="text-foreground">5 crédits</strong>. Sans limite cumulée.
            </p>
          </div>

          {/* Comment ça marche */}
          <div className="grid md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
            {[
              { n: '1', icon: Mail, t: 'Invitez vos amis', d: 'Saisissez jusqu\'à 10 emails ou partagez votre code unique.' },
              { n: '2', icon: Users, t: 'Ils s\'inscrivent', d: 'Avec votre code, ils créent leur compte gratuit en 30 secondes.' },
              { n: '3', icon: Sparkles, t: 'Tout le monde gagne', d: '+5 crédits pour vous, +5 crédits pour eux, automatiquement.' },
            ].map((s) => (
              <div key={s.n} className="p-5 rounded-card border border-foreground/5 bg-background text-center">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center mx-auto mb-3 text-primary-foreground font-bold">
                  {s.n}
                </div>
                <h3 className="font-semibold mb-1">{s.t}</h3>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>

          <ReferralSection />
        </div>
      </section>

      {/* SECTION PROGRAMME PARTENAIRE */}
      <section id="programme-partenaire" className="py-12 md:py-16 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-foreground/10 bg-card mb-5">
              <Trophy className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Programme partenaire · Édition 2026</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
              Transformez votre audience<br />
              <span className="gradient-text italic">en revenus récurrents.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Touchez des commissions attractives en recommandant l'IA marketing préférée des entrepreneurs français.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-12 p-6 rounded-card border border-foreground/5 bg-card/30">
            {[
              { v: '30%', l: 'Commission récurrente' },
              { v: '12 mois', l: "Durée d'attribution" },
              { v: '< 48h', l: 'Validation candidature' },
              { v: '0€', l: "Frais d'entrée" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl md:text-4xl font-black gradient-text">{s.v}</div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Pour qui */}
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
            Un programme conçu pour <span className="gradient-text">vous</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-5 mb-14">
            {[
              { icon: Users, title: 'Influenceurs & créateurs', desc: 'Instagram, TikTok, YouTube : recommandez un outil que votre audience peut réellement utiliser au quotidien.' },
              { icon: Trophy, title: 'YouTubeurs & podcasteurs', desc: 'Codes promo dédiés, contenu sponsorisé, démos exclusives. Idéal pour les chaînes business, marketing, entrepreneuriat.' },
              { icon: Zap, title: 'Entreprises & agences', desc: 'White-label, intégration API, conditions sur mesure pour proposer Créafacile à vos clients.' },
            ].map((c) => (
              <div key={c.title} className="p-6 rounded-card border border-foreground/5 bg-card hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center mb-4">
                  <c.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h4 className="text-base font-semibold mb-2">{c.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Avantages */}
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
            Vos avantages <span className="gradient-text">partenaire</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-5 mb-14">
            {[
              { icon: DollarSign, title: '30% de commission récurrente', desc: 'Sur chaque abonnement Pro ou Premium activé via votre lien, pendant 12 mois.' },
              { icon: TrendingUp, title: 'Tracking précis et transparent', desc: 'Dashboard temps réel : clics, inscriptions, conversions, revenus.' },
              { icon: Heart, title: 'Compte Premium offert', desc: 'Accès illimité à Créafacile pour produire votre propre contenu de qualité agence.' },
              { icon: Sparkles, title: 'Kit créatif sur-mesure', desc: 'Visuels, vidéos de démo, scripts, templates pour convertir votre audience.' },
              { icon: Zap, title: 'Accès anticipé aux nouveautés', desc: 'Soyez les premiers informés des nouvelles fonctionnalités. Roadmap partagée.' },
              { icon: Trophy, title: 'Support partenaire dédié', desc: 'Un interlocuteur unique, joignable, qui répond en moins de 24h.' },
            ].map((a) => (
              <div key={a.title} className="flex gap-4 p-5 rounded-card border border-foreground/5 bg-background">
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                  <a.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="text-base font-semibold mb-1">{a.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire */}
          <div id="partnership-form" className="max-w-2xl mx-auto pt-4">
            <div className="text-center mb-8">
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
                Postulez au programme
              </h3>
              <p className="text-muted-foreground text-sm">
                Plus votre dossier est précis, plus on vous répond vite. Soyez vous-même.
              </p>
            </div>
            <PartnershipForm />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-center mt-10 max-w-3xl mx-auto">
            {['Paiement Stripe sécurisé', 'Sans exclusivité', 'Désinscription en 1 clic'].map((g) => (
              <div key={g} className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                {g}
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Partners;