import { useNavigate } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon, Video, MessageSquare, Layers, Wand2, Globe, Users, Shield, Zap, Palette, FileText, Settings, Share2 } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';

const Features = () => {
  const navigate = useNavigate();

  const groups = [
    {
      title: 'Génération de contenu',
      icon: Wand2,
      items: [
        { icon: ImageIcon, title: 'Images photoréalistes', desc: 'Imagen 4, DALL-E 3, Gemini 3 — qualité Ultra HD avec respect strict des ratios 1:1, 16:9, 9:16.' },
        { icon: Layers, title: 'Carrousels multi-slides', desc: 'Génération cohérente de 3 à 10 slides pour stories et posts éducatifs.' },
        { icon: Video, title: 'Vidéos courtes IA', desc: 'Sora 2, Veo 3, Kling, Seedance — Reels, TikToks et Shorts générés à la volée.' },
        { icon: MessageSquare, title: 'Captions cross-platform', desc: '4 versions (Facebook, Instagram, TikTok, LinkedIn) avec hashtags et CTA séparé.' },
      ],
    },
    {
      title: 'Personnalisation intelligente',
      icon: Settings,
      items: [
        { icon: Users, title: 'Profil métier intégré', desc: 'L\'IA connaît votre activité dès l\'onboarding et adapte le ton à votre secteur.' },
        { icon: Palette, title: '15 styles de rendu', desc: 'Photo, illustration, 3D, anime, papercraft… changez d\'univers en un clic.' },
        { icon: FileText, title: 'Mode Simple & Expert', desc: 'Démarrez en 3 clics ou ajustez chaque paramètre du modèle (température, seed, etc.).' },
        { icon: ImageIcon, title: 'Photos de référence', desc: 'Importez jusqu\'à 3 visuels pour guider l\'IA (style, produit, lieu).' },
      ],
    },
    {
      title: 'Workflow & productivité',
      icon: Zap,
      items: [
        { icon: Wand2, title: 'Génération en 3 clics', desc: 'Type → Personnalisation → Résultat. Pas de prompt à écrire.' },
        { icon: FileText, title: 'Bibliothèque "Mes générations"', desc: 'Retrouvez et téléchargez tous vos contenus passés.' },
        { icon: Share2, title: 'Publication directe', desc: 'Connectez Facebook & Instagram et publiez en un clic depuis l\'app.' },
        { icon: Globe, title: 'Multi-formats automatiques', desc: 'Le bon ratio est appliqué automatiquement selon le réseau cible.' },
      ],
    },
    {
      title: 'Sécurité & conformité',
      icon: Shield,
      items: [
        { icon: Shield, title: 'RGPD & hébergement EU', desc: 'Vos données restent en Europe, suppression possible à tout moment.' },
        { icon: Users, title: 'Authentification Google', desc: 'Connexion sécurisée OAuth, sans mot de passe à gérer.' },
        { icon: FileText, title: 'Historique transparent', desc: 'Chaque crédit utilisé est tracé, vous gardez le contrôle.' },
        { icon: Globe, title: 'Made in France', desc: 'Support en français, équipe française, paiement SEPA & CB.' },
      ],
    },
  ];

  return (
    <MarketingLayout
      title="Fonctionnalités — Créafacile"
      description="Découvrez toutes les fonctionnalités de Créafacile : génération d'images, vidéos, captions multi-plateformes, publication directe et plus."
    >
      <section className="pt-16 md:pt-24 pb-12 text-center">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5">
            Tout pour <span className="gradient-text">créer, sans effort.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète pour produire du contenu marketing professionnel,
            adapté à votre activité et à chaque réseau social.
          </p>
        </div>
      </section>

      {groups.map((g, idx) => (
        <section key={g.title} className={`py-16 ${idx % 2 === 1 ? 'bg-card/30 border-y border-foreground/5' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
                <g.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{g.title}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {g.items.map((item) => (
                <div key={item.title} className="p-6 rounded-card border border-foreground/5 bg-card hover:border-primary/30 transition-colors">
                  <item.icon className="w-5 h-5 text-primary mb-3" />
                  <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Essayez tout ça <span className="gradient-text">gratuitement</span>
          </h2>
          <p className="text-muted-foreground mb-8">5 crédits offerts à l'inscription. Sans carte bancaire.</p>
          <button
            onClick={() => navigate('/auth')}
            className="gradient-bg text-primary-foreground px-7 py-3.5 rounded-pill text-base font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Commencer maintenant <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Features;