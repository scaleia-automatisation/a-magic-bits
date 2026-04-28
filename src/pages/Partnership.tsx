import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, DollarSign, Users, Sparkles, Zap, Trophy, Heart, CheckCircle2 } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import PartnershipForm from '@/components/marketing/PartnershipForm';

const Partnership = () => {
  const scrollToForm = () => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <MarketingLayout
      title="Partenariat Créafacile — Influenceurs, YouTubeurs & Entreprises"
      description="Devenez partenaire Créafacile : commissions attractives, contenu offert, accès anticipé. Programme dédié aux créateurs et entreprises qui veulent monétiser leur audience."
    >
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-foreground/10 bg-card/50 backdrop-blur mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium">Programme Partenaires · Édition 2026</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            <span className="text-foreground">Transformez votre audience</span><br />
            <span className="gradient-text italic">en revenus récurrents.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Rejoignez le programme partenaires <strong className="text-foreground">Créafacile</strong> et touchez
            des commissions attractives en recommandant l'IA marketing préférée des entrepreneurs français.
          </p>

          <button
            onClick={scrollToForm}
            className="gradient-bg text-primary-foreground px-7 py-3.5 rounded-pill text-base font-semibold hover:opacity-90 inline-flex items-center gap-2"
          >
            Postuler maintenant
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-muted-foreground mt-4">
            ✓ Réponse sous 48h · ✓ Sans engagement · ✓ Outils de tracking offerts
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-foreground/5 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { v: '30%', l: 'Commission récurrente' },
              { v: '12 mois', l: 'Durée d\'attribution' },
              { v: '< 48h', l: 'Validation candidature' },
              { v: '0€', l: 'Frais d\'entrée' },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-3xl md:text-4xl font-black gradient-text">{s.v}</div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POUR QUI */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
              Un programme conçu pour <span className="gradient-text">vous</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Users, title: 'Influenceurs & créateurs', desc: 'Instagram, TikTok, YouTube : recommandez un outil que votre audience peut réellement utiliser au quotidien.' },
              { icon: Trophy, title: 'YouTubeurs & podcasteurs', desc: 'Codes promo dédiés, contenu sponsorisé, démos exclusives. Idéal pour les chaînes business, marketing, entrepreneuriat.' },
              { icon: Zap, title: 'Entreprises & agences', desc: 'White-label, intégration API, conditions sur mesure pour proposer Créafacile à vos clients.' },
            ].map((c) => (
              <div key={c.title} className="p-6 rounded-card border border-foreground/5 bg-card hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center mb-4">
                  <c.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="py-20 border-y border-foreground/5 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
              Ce que vous obtenez <span className="gradient-text">en devenant partenaire</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: DollarSign, title: '30% de commission récurrente', desc: 'Sur chaque abonnement Pro ou Premium activé via votre lien, pendant 12 mois.' },
              { icon: TrendingUp, title: 'Tracking précis et transparent', desc: 'Dashboard temps réel : clics, inscriptions, conversions, revenus. Pas de boîte noire.' },
              { icon: Heart, title: 'Compte Premium offert', desc: 'Accès illimité à Créafacile pour produire votre propre contenu de qualité agence.' },
              { icon: Sparkles, title: 'Kit créatif sur-mesure', desc: 'Visuels, vidéos de démo, scripts, templates : tout ce qu\'il faut pour convertir votre audience.' },
              { icon: Zap, title: 'Accès anticipé aux nouveautés', desc: 'Soyez les premiers informés des nouvelles fonctionnalités. Roadmap partagée.' },
              { icon: Trophy, title: 'Support partenaire dédié', desc: 'Un interlocuteur unique, joignable, qui répond en moins de 24h.' },
            ].map((a) => (
              <div key={a.title} className="flex gap-4 p-5 rounded-card border border-foreground/5 bg-background">
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
                  <a.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">{a.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
              3 étapes pour démarrer
            </h2>
          </div>
          <div className="space-y-8">
            {[
              { n: '01', t: 'Postulez en 2 minutes', d: 'Remplissez le formulaire ci-dessous. On étudie votre profil avec attention.' },
              { n: '02', t: 'Validation sous 48h', d: 'Une réponse claire dans votre boîte mail, avec votre kit partenaire et votre lien dédié.' },
              { n: '03', t: 'Promouvez et touchez vos commissions', d: 'Partagez votre lien sur vos réseaux. Suivez vos revenus en temps réel. Paiement mensuel.' },
            ].map((s) => (
              <div key={s.n} className="flex gap-6 items-start">
                <div className="text-5xl font-black gradient-text leading-none shrink-0">{s.n}</div>
                <div className="pt-1">
                  <h3 className="text-xl font-bold mb-1">{s.t}</h3>
                  <p className="text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section id="partnership-form" className="py-20 border-y border-foreground/5 bg-card/30">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
              Postulez au programme
            </h2>
            <p className="text-muted-foreground">
              Plus votre dossier est précis, plus on vous répond vite. Soyez vous-même.
            </p>
          </div>
          <PartnershipForm />
        </div>
      </section>

      {/* GARANTIES */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
              'Paiement Stripe sécurisé',
              'Sans exclusivité',
              'Désinscription en 1 clic',
            ].map((g) => (
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

export default Partnership;