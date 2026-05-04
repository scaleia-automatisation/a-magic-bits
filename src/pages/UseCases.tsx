import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';

const cases = [
  { emoji: '🛍️', title: 'E-commerce / Retail', desc: 'DTC, marketplaces — lancements produits, soldes, social proof pour booster vos conversions.', examples: ['Visuel produit', 'Story collection', 'Pub Reels'] },
  { emoji: '🧃', title: 'FMCG / Grande conso', desc: 'Cosmétiques, food, boissons — créez des assets shoppable à grande échelle.', examples: ['Packshot lifestyle', 'Reel recette', 'Campagne saison'] },
  { emoji: '👗', title: 'Mode / Fashion / Luxe', desc: 'Collections, lookbooks, drops — un univers visuel premium et cohérent.', examples: ['Lookbook', 'Drop teaser', 'Édito carrousel'] },
  { emoji: '🧴', title: 'Beauté / Cosmétique / Skincare', desc: 'Routines, avant/après, ingrédients — engagez une communauté beauté experte.', examples: ['Routine vidéo', 'Avant/après', 'Texture macro'] },
  { emoji: '💻', title: 'Tech / SaaS / IA / Startups', desc: 'Features, use cases, growth — du contenu B2B qui génère des leads qualifiés.', examples: ['Demo feature', 'Cas client', 'Post LinkedIn'] },
  { emoji: '🏦', title: 'Banque / Finance / Assurance', desc: 'Fintech incluse — pédagogie, confiance et conformité au cœur du contenu.', examples: ['Carrousel pédago', 'Témoignage', 'Reel conseil'] },
  { emoji: '🏠', title: 'Immobilier', desc: 'Promotion, agences, location courte durée — annonces et conseils marché percutants.', examples: ['Visite virtuelle', 'Bien à vendre', 'Conseil acheteur'] },
  { emoji: '🚗', title: 'Automobile', desc: 'Constructeurs et concessionnaires — modèles, essais, offres et événements showroom.', examples: ['Reveal modèle', 'Essai client', 'Offre flash'] },
  { emoji: '✈️', title: 'Tourisme / Voyage / Hôtellerie', desc: 'Destinations, expériences, séjours — donnez envie de réserver dès le 1er scroll.', examples: ['Reel destination', 'Story chambre', 'Carrousel itinéraire'] },
  { emoji: '🍽️', title: 'Restauration / Food brands', desc: 'Dark kitchens, restaurants, marques food — plats, ambiance, promos saisonnières.', examples: ['Photo plat', 'Story menu', 'Reel cuisine'] },
  { emoji: '🩺', title: 'Santé / Pharma / Cliniques', desc: 'Bien-être inclus — vulgarisation, prévention et confiance patient.', examples: ['Conseil santé', 'Témoignage', 'Carrousel pédago'] },
  { emoji: '🎓', title: 'Éducation / Formation / Infoproduits', desc: 'Annonces de programmes, résultats élèves, contenus pédagogiques à fort engagement.', examples: ['Carrousel cours', 'Témoignage', 'Annonce session'] },
  { emoji: '💼', title: 'Coaching / Consulting / B2B', desc: 'Posts experts, citations, lead magnets — positionnez votre autorité.', examples: ['Post expertise', 'Citation visuelle', 'Carrousel conseils'] },
  { emoji: '🎮', title: 'Médias / Divertissement / Gaming / Créateurs', desc: 'Trailers, drops, communautés — du contenu viral, stop-scroll garanti.', examples: ['Teaser drop', 'Reel highlight', 'Cover stream'] },
  { emoji: '📡', title: 'Télécom / Internet / Services digitaux', desc: 'Offres, forfaits, support, innovation — clarifiez et convertissez.', examples: ['Offre forfait', 'Carrousel feature', 'Story promo'] },
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
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight mb-5">
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
          <h2 className="font-display text-3xl md:text-4xl font-black mb-4">
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