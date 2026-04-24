import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';

const cases = [
  { emoji: '🍽️', title: 'Restauration', desc: 'Plat du jour, événements, promotions, ambiance — créez 30 posts par mois en 1 heure.', examples: ['Photo plat du jour', 'Story menu hebdo', 'Reel cuisine'] },
  { emoji: '💇', title: 'Coiffure & beauté', desc: 'Avant/après, nouveautés, conseils — fidélisez votre clientèle locale.', examples: ['Carrousel transformation', 'Conseils soin', 'Promo flash'] },
  { emoji: '🛍️', title: 'E-commerce', desc: 'Lancements produits, soldes, témoignages — augmentez votre taux de conversion.', examples: ['Visuel produit', 'Story collection', 'Pub Reels'] },
  { emoji: '🏠', title: 'Immobilier', desc: 'Annonces visuelles, conseils marché, témoignages clients.', examples: ['Visite virtuelle', 'Conseil acheteur', 'Bien à vendre'] },
  { emoji: '💼', title: 'Consultants & coachs', desc: 'Posts LinkedIn experts, citations, lead magnets — positionnez-vous.', examples: ['Post expertise', 'Citation visuelle', 'Carrousel conseils'] },
  { emoji: '🏋️', title: 'Sport & fitness', desc: 'Programmes, motivation, transformations — engagez votre communauté.', examples: ['Vidéo exercice', 'Avant/après', 'Conseil nutrition'] },
  { emoji: '🎓', title: 'Formation & éducation', desc: 'Annonces de cours, témoignages élèves, contenus pédagogiques.', examples: ['Carrousel pédagogique', 'Témoignage', 'Annonce session'] },
  { emoji: '🚗', title: 'Artisans & services', desc: 'Réalisations, équipe, devis express — montrez votre savoir-faire.', examples: ['Avant/après chantier', 'Présentation équipe', 'Témoignage client'] },
  { emoji: '☕', title: 'Café & boulangerie', desc: 'Nouveautés, ambiance, promotions matinales — attirez votre quartier.', examples: ['Photo viennoiserie', 'Story ouverture', 'Promo café'] },
  { emoji: '🎨', title: 'Artistes & créateurs', desc: 'Showcases, processus créatif, ventes — développez votre audience.', examples: ['Reveal œuvre', 'Behind the scenes', 'Annonce expo'] },
  { emoji: '🐾', title: 'Animalerie & vétérinaires', desc: 'Conseils soins, promos accessoires, témoignages adoptions.', examples: ['Conseil animal', 'Photo client', 'Promo croquettes'] },
  { emoji: '🌿', title: 'Bien-être & yoga', desc: 'Cours, bienfaits, citations inspirantes — créez une communauté.', examples: ['Vidéo posture', 'Citation matin', 'Annonce stage'] },
];

const UseCases = () => {
  const navigate = useNavigate();

  return (
    <MarketingLayout
      title="Cas d'usage — Créafacile"
      description="Restaurateurs, coiffeurs, e-commerçants, consultants… Découvrez comment Créafacile s'adapte à votre activité."
    >
      <section className="pt-16 md:pt-24 pb-12 text-center">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5">
            Pensé pour <span className="gradient-text">tous les métiers.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quel que soit votre secteur, Créafacile adapte ses suggestions, son ton et ses visuels à votre activité.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cases.map((c) => (
              <div key={c.title} className="p-6 rounded-card border border-foreground/5 bg-card hover:border-primary/30 transition-colors">
                <div className="text-4xl mb-4">{c.emoji}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.examples.map((e) => (
                    <span key={e} className="text-xs px-2.5 py-1 rounded-pill bg-background border border-foreground/10 text-muted-foreground">{e}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-foreground/5 bg-card/30 text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Votre activité n'est pas listée ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Créafacile s'adapte à <strong className="text-foreground">tous les secteurs</strong>. Décrivez votre métier à l'inscription, l'IA fait le reste.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="gradient-bg text-primary-foreground px-7 py-3.5 rounded-pill text-base font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Tester gratuitement <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default UseCases;