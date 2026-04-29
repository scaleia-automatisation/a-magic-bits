import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Zap, Image as ImageIcon, Video, MessageSquare, Check, Play, Clock, TrendingUp, Shield, Globe, ChevronDown } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import PartnershipForm from '@/components/marketing/PartnershipForm';
import facebookLogo from '@/assets/facebook-logo.png';
import instagramLogo from '@/assets/instagram-logo.png';
import tiktokLogo from '@/assets/tiktok-logo.png';
import linkedinLogo from '@/assets/linkedin-logo.png';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

const Landing = () => {
  const navigate = useNavigate();
  const [openFaqId, setOpenFaqId] = useState<string | null>('Démarrage-0');

  useEffect(() => {
    if (window.location.hash === '#faq') {
      setTimeout(() => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const faqSections = [
    {
      title: 'Démarrage',
      qa: [
        { q: 'Comment commencer ?', a: 'Inscrivez-vous gratuitement avec votre compte Google. Vous recevez 5 crédits offerts pour tester immédiatement la plateforme, sans carte bancaire.' },
        { q: 'Faut-il être un expert en marketing ?', a: 'Non. Créafacile est pensé pour les entrepreneurs et indépendants sans compétence technique. En 3 clics, vous obtenez un contenu prêt à publier.' },
        { q: 'Combien de temps pour générer un post ?', a: 'Environ 30 secondes pour une image, 1 à 3 minutes pour une vidéo selon le modèle choisi.' },
      ],
    },
    {
      title: 'Crédits & tarifs',
      qa: [
        { q: 'Comment fonctionnent les crédits ?', a: 'Chaque génération consomme un nombre de crédits (image = 1 crédit, vidéo = 3 à 5 selon le modèle). Vos crédits se renouvellent chaque mois selon votre plan.' },
        { q: 'Les crédits non utilisés sont-ils reportés ?', a: 'Oui, vos crédits non consommés sont reportés sur le mois suivant tant que votre abonnement est actif.' },
        { q: 'Puis-je annuler à tout moment ?', a: 'Oui, sans engagement. Vous pouvez résilier en un clic depuis votre espace, et conservez l\'accès jusqu\'à la fin de la période payée.' },
        { q: 'Y a-t-il un essai gratuit ?', a: 'Oui, 5 crédits sont offerts à l\'inscription, sans carte bancaire requise.' },
      ],
    },
    {
      title: 'Fonctionnalités',
      qa: [
        { q: 'Quels formats puis-je générer ?', a: 'Images carrées (1:1), paysage (16:9), portrait (9:16), carrousels multi-slides et vidéos courtes adaptées à chaque réseau social.' },
        { q: 'L\'IA crée-t-elle aussi les textes ?', a: 'Oui, pour chaque génération vous obtenez 4 versions de caption optimisées (Facebook, Instagram, TikTok, LinkedIn) avec hashtags et CTA séparé.' },
        { q: 'Puis-je publier directement sur mes réseaux ?', a: 'Oui, vous pouvez connecter Facebook et Instagram pour publier en un clic depuis Créafacile.' },
        { q: 'Puis-je importer mes propres photos ?', a: 'Oui, jusqu\'à 3 photos de référence par génération pour guider l\'IA (style, produit, lieu).' },
      ],
    },
    {
      title: 'Sécurité & données',
      qa: [
        { q: 'Mes données sont-elles protégées ?', a: 'Oui. Vos données sont hébergées en Europe, conformes RGPD. Vous pouvez les supprimer à tout moment depuis votre espace.' },
        { q: 'Qui possède les contenus générés ?', a: 'Vous. Tous les contenus que vous générez vous appartiennent et peuvent être utilisés librement, y compris à des fins commerciales.' },
        { q: 'Comment supprimer mon compte ?', a: 'Depuis votre tableau de bord, ou via la page dédiée Suppression des données accessible en bas de chaque page.' },
      ],
    },
    {
      title: 'Support',
      qa: [
        { q: 'Comment contacter le support ?', a: 'Par email à bonjour@creafacile.com ou via le formulaire de la page Contact. Nous répondons sous 24h ouvrées.' },
        { q: 'Proposez-vous une formation ?', a: 'L\'application est conçue pour être prise en main sans formation. Une documentation et des exemples sont disponibles dans votre espace.' },
      ],
    },
  ];

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

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6 max-w-4xl mx-auto">
            <span className="text-foreground">Créez et publiez</span>
            <br />
            <span className="text-foreground">du contenu viral</span>
            <br />
            <span className="gradient-text italic">en 3 clics,</span>
            <span className="gradient-text italic"> même sans idée.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            En <strong className="text-foreground">quelques clics</strong> seulement, transformez votre activité en machine à contenu : l'IA imagine vos idées, crée textes, images et vidéos sur-mesure, puis les publie automatiquement pour générer plus de clients et de revenus.
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

      <TestimonialsCarousel />

      {/* FEATURES */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
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
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
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
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
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
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
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

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-28 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
              Questions <span className="gradient-text">fréquentes</span>
            </h2>
            <p className="text-lg text-muted-foreground">Tout ce que vous devez savoir avant de vous lancer.</p>
          </div>
          <div className="space-y-10">
            {faqSections.map((s) => (
              <div key={s.title}>
                <h3 className="text-xl font-bold text-foreground mb-4">{s.title}</h3>
                <div className="space-y-2">
                  {s.qa.map((item, i) => {
                    const id = `${s.title}-${i}`;
                    const isOpen = openFaqId === id;
                    return (
                      <div key={id} className="rounded-card border border-foreground/5 bg-card overflow-hidden">
                        <button
                          onClick={() => setOpenFaqId(isOpen ? null : id)}
                          className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-card/70 transition-colors"
                        >
                          <span className="text-sm md:text-base font-semibold text-foreground">{item.q}</span>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-6">
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

      {/* PARTENARIAT */}
      <section id="partenariat" className="py-20 md:py-28 border-t border-foreground/5 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-foreground/10 bg-card/50 backdrop-blur mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Programme partenaires</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
              Influenceur, YouTubeur, entreprise ?<br />
              <span className="gradient-text italic">Devenez partenaire Créafacile.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              30% de commission récurrente pendant 12 mois, compte Premium offert, kit créatif sur-mesure.
              <button onClick={() => navigate('/partenariat')} className="text-primary hover:underline ml-1">
                Voir le programme complet →
              </button>
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <PartnershipForm />
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Landing;