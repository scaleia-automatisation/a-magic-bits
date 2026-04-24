import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Image as ImageIcon, Video, MessageSquare, Check, Play, Clock, TrendingUp, Shield, Globe } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import facebookLogo from '@/assets/facebook-logo.png';
import instagramLogo from '@/assets/instagram-logo.png';
import tiktokLogo from '@/assets/tiktok-logo.png';
import linkedinLogo from '@/assets/linkedin-logo.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <MarketingLayout
      title="Créafacile — L'IA marketing qui crée vos publications en 3 clics"
      description="Augmentez vos revenus avec du contenu viral prêt à publier en 3 clics, même sans idée. L'IA marketing pensée pour les TPE/PME françaises. Essai gratuit, sans carte bancaire."
    >
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-secondary/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-16 md:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-foreground/10 bg-card/50 backdrop-blur mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">Nouveau · Génération vidéo IA Sora 2 & Veo 3</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            <span className="text-foreground">Créez et publiez du contenu viral</span>{' '}
            <span className="gradient-text">en 3 clics, même sans idée.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            En <strong className="text-foreground">3 clics</strong>, <strong className="text-foreground">même sans idée</strong>, notre IA imagine, rédige et produit images, vidéos et textes adaptés à votre activité — puis les publie sur vos réseaux pour attirer plus de clients et faire décoller votre chiffre d'affaires.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={() => navigate('/auth')}
              className="gradient-bg text-primary-foreground px-7 py-3.5 rounded-pill text-base font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              Démarrer gratuitement
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/fonctionnalites')}
              className="px-7 py-3.5 rounded-pill text-base font-semibold border border-foreground/10 hover:bg-card transition-colors inline-flex items-center gap-2 text-foreground"
            >
              <Play className="w-4 h-4" />
              Voir comment ça marche
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            ✓ 5 crédits offerts · ✓ Sans carte bancaire · ✓ Annulation à tout moment
          </p>

          {/* Plateformes supportées */}
          <div className="mt-16">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-5">Compatible avec</p>
            <div className="flex items-center justify-center gap-8 md:gap-12 opacity-70">
              <img src={facebookLogo} alt="Facebook" className="h-7 md:h-8" />
              <img src={instagramLogo} alt="Instagram" className="h-7 md:h-8" />
              <img src={tiktokLogo} alt="TikTok" className="h-7 md:h-8" />
              <img src={linkedinLogo} alt="LinkedIn" className="h-7 md:h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLÈME / PROMESSE */}
      <section className="border-y border-foreground/5 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black gradient-text mb-2">3 clics</div>
              <p className="text-sm text-muted-foreground">Pour générer une publication complète prête à publier</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black gradient-text mb-2">4 réseaux</div>
              <p className="text-sm text-muted-foreground">Textes optimisés pour Facebook, Instagram, TikTok, LinkedIn</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black gradient-text mb-2">10x</div>
              <p className="text-sm text-muted-foreground">Plus rapide qu'une agence ou un freelance</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Tout ce qu'il vous faut. <span className="gradient-text">Rien de plus.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une suite complète pour produire du contenu marketing professionnel sans agence ni compétence technique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: ImageIcon, title: 'Images photoréalistes', desc: 'Imagen 4, DALL-E 3 et Gemini 3 — vos visuels en qualité Ultra HD adaptés à chaque réseau.' },
              { icon: Video, title: 'Vidéos courtes', desc: 'Sora 2, Veo 3, Kling — Reels, TikTok, Shorts générés à partir d\'une simple idée.' },
              { icon: MessageSquare, title: 'Textes qui convertissent', desc: 'Captions, hashtags et CTA optimisés pour chaque plateforme et votre secteur.' },
              { icon: Zap, title: 'Workflow en 3 étapes', desc: 'Type de contenu → Personnalisation → Génération. Pas de prompt à écrire.' },
              { icon: Globe, title: 'Adapté à votre activité', desc: 'L\'IA connaît votre secteur dès l\'inscription et adapte ton, style et exemples.' },
              { icon: Shield, title: 'Vos données protégées', desc: 'Hébergement européen, RGPD conforme, suppression possible à tout moment.' },
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

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-28 border-y border-foreground/5 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Comment ça marche
            </h2>
            <p className="text-lg text-muted-foreground">Trois étapes. Trois minutes. Zéro effort.</p>
          </div>

          <div className="space-y-12">
            {[
              { n: '01', title: 'Choisissez votre type de contenu', desc: 'Image, carrousel ou vidéo. Format automatique selon le réseau cible (1:1, 16:9, 9:16).' },
              { n: '02', title: 'Personnalisez votre message', desc: 'Décrivez votre idée, ajoutez vos photos de référence, ou laissez l\'IA proposer pour vous.' },
              { n: '03', title: 'Publiez et engagez', desc: 'Téléchargez vos visuels, copiez vos textes optimisés, ou publiez directement vers vos réseaux.' },
            ].map((s, i) => (
              <div key={s.n} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
                <div className="text-5xl md:text-7xl font-black gradient-text shrink-0 leading-none">{s.n}</div>
                <div className="pt-2">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-base text-muted-foreground max-w-xl">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Conçu pour <span className="gradient-text">votre métier</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Que vous soyez restaurateur, coiffeur, e-commerçant ou consultant, Créafacile s'adapte à votre activité.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: '🍽️', title: 'Restauration', desc: 'Plats du jour, événements, promotions saisonnières.' },
              { emoji: '💇', title: 'Beauté & soins', desc: 'Avant/après, nouveautés, conseils experts.' },
              { emoji: '🛍️', title: 'E-commerce', desc: 'Lancements produit, soldes, témoignages clients.' },
              { emoji: '🏠', title: 'Immobilier', desc: 'Annonces, visites virtuelles, conseils marché.' },
              { emoji: '💼', title: 'Consultants & coachs', desc: 'Posts LinkedIn experts, citations inspirantes.' },
              { emoji: '🏋️', title: 'Sport & fitness', desc: 'Programmes, motivation, transformations.' },
              { emoji: '🎓', title: 'Formation', desc: 'Annonces de cours, témoignages élèves.' },
              { emoji: '🚗', title: 'Artisans & services', desc: 'Réalisations, équipe, devis express.' },
            ].map((u) => (
              <div key={u.title} className="p-5 rounded-card border border-foreground/5 bg-card hover:border-primary/30 transition-colors">
                <div className="text-3xl mb-3">{u.emoji}</div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{u.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/cas-dusage')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Voir tous les cas d'usage
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-20 md:py-28 border-y border-foreground/5 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Le coût d'une agence. <span className="gradient-text">Sans agence.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="p-6 rounded-card border border-foreground/5 bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Agence marketing</h3>
              <div className="text-3xl font-black text-foreground mb-1">1 500€<span className="text-base font-normal text-muted-foreground">/mois</span></div>
              <p className="text-xs text-muted-foreground mb-4">Délai : 1 à 2 semaines</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✗ Coûteux</li>
                <li>✗ Lent</li>
                <li>✗ Engagement long</li>
              </ul>
            </div>
            <div className="p-6 rounded-card border border-foreground/5 bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Freelance</h3>
              <div className="text-3xl font-black text-foreground mb-1">600€<span className="text-base font-normal text-muted-foreground">/mois</span></div>
              <p className="text-xs text-muted-foreground mb-4">Délai : 2 à 5 jours</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✗ Disponibilité variable</li>
                <li>✗ Style limité</li>
                <li>✗ Aller-retours</li>
              </ul>
            </div>
            <div className="p-6 rounded-card gradient-border bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-bg text-primary-foreground text-xs font-bold px-3 py-1 rounded-pill">RECOMMANDÉ</div>
              <h3 className="text-sm font-semibold gradient-text mb-3">Créafacile</h3>
              <div className="text-3xl font-black text-foreground mb-1">29,90€<span className="text-base font-normal text-muted-foreground">/mois</span></div>
              <p className="text-xs text-muted-foreground mb-4">Délai : 3 minutes</p>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Génération illimitée d'idées</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Sans engagement</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Disponible 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            Prêt à créer du contenu <span className="gradient-text">qui convertit ?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Rejoignez les entrepreneurs français qui boostent leur présence en ligne avec Créafacile.
            Démarrez gratuitement, sans carte bancaire.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="gradient-bg text-primary-foreground px-8 py-4 rounded-pill text-base font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Commencer gratuitement
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 3 minutes</span>
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> 5 crédits offerts</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> RGPD</span>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Landing;