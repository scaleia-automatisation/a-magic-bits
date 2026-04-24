import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';

const sections = [
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

const FAQ = () => {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>('Démarrage-0');

  return (
    <MarketingLayout
      title="FAQ — Créafacile"
      description="Toutes les réponses aux questions fréquentes sur Créafacile : crédits, tarifs, fonctionnalités, sécurité et support."
    >
      <section className="pt-16 md:pt-24 pb-12 text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight mb-5">
            Questions <span className="gradient-text">fréquentes</span>
          </h1>
          <p className="text-lg text-muted-foreground">Tout ce que vous devez savoir avant de vous lancer.</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-12">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-xl font-bold text-foreground mb-4">{s.title}</h2>
              <div className="space-y-2">
                {s.qa.map((item, i) => {
                  const id = `${s.title}-${i}`;
                  const isOpen = openId === id;
                  return (
                    <div key={id} className="rounded-card border border-foreground/5 bg-card overflow-hidden">
                      <button
                        onClick={() => setOpenId(isOpen ? null : id)}
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
      </section>

      <section className="py-20 border-t border-foreground/5 bg-card/30 text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-4xl font-black mb-4">Une autre question ?</h2>
          <p className="text-muted-foreground mb-8">Notre équipe vous répond sous 24h ouvrées.</p>
          <button
            onClick={() => navigate('/contact')}
            className="gradient-bg text-primary-foreground px-7 py-3.5 rounded-pill text-base font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Nous contacter <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default FAQ;