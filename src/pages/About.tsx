import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Target, Sparkles, Users } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';

const About = () => {
  const navigate = useNavigate();

  return (
    <MarketingLayout
      title="À propos — Créafacile"
      description="Créafacile est une startup française qui démocratise le marketing IA pour les TPE/PME. Notre mission : rendre la création de contenu accessible à tous."
    >
      <section className="pt-16 md:pt-24 pb-16 text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight mb-6">
            Le marketing IA, <span className="gradient-text">pour tous.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Créafacile est une startup française née d'un constat : les TPE/PME et indépendants
            n'ont ni le temps, ni le budget pour faire appel à une agence marketing.
            Nous mettons l'IA la plus avancée entre leurs mains, simplement.
          </p>
        </div>
      </section>

      <section className="py-16 border-y border-foreground/5 bg-card/30">
        <div className="max-w-5xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-black mb-4">Notre mission</h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-4">
              Démocratiser l'accès au marketing professionnel pour les <strong className="text-foreground">3 millions de TPE françaises</strong>.
              Nous croyons que chaque entrepreneur mérite des outils de qualité, sans complexité ni coût prohibitif.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              En combinant les meilleurs modèles d'IA générative avec une expérience pensée pour les non-experts,
              nous transformons des heures de travail en quelques clics.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Target, label: 'Mission', value: 'Démocratiser l\'IA marketing' },
              { icon: Heart, label: 'Origine', value: 'Made in France 🇫🇷' },
              { icon: Users, label: 'Pour qui', value: 'TPE, PME, indépendants' },
              { icon: Sparkles, label: 'Promesse', value: '3 clics, contenu pro' },
            ].map((v) => (
              <div key={v.label} className="p-5 rounded-card border border-foreground/5 bg-background">
                <v.icon className="w-5 h-5 text-primary mb-2" />
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{v.label}</div>
                <div className="text-sm font-semibold text-foreground">{v.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-black mb-4">Nos valeurs</h2>
            <p className="text-muted-foreground">Ce qui guide chacune de nos décisions.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { emoji: '✨', title: 'Simplicité', desc: 'Si ce n\'est pas faisable en 3 clics, ce n\'est pas assez bon. Nous concevons pour l\'utilisateur, pas pour l\'ingénieur.' },
              { emoji: '🎨', title: 'Qualité', desc: 'Nous utilisons les meilleurs modèles IA du marché (Sora 2, Imagen 4, Veo 3) pour livrer un rendu professionnel.' },
              { emoji: '🔒', title: 'Confiance', desc: 'Vos données restent en Europe. Pas de revente, pas de tracking abusif. RGPD au cœur de notre architecture.' },
            ].map((v) => (
              <div key={v.title} className="p-6 rounded-card border border-foreground/5 bg-card">
                <div className="text-3xl mb-3">{v.emoji}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-foreground/5 bg-card/30 text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="font-display text-3xl md:text-4xl font-black mb-4">
            Rejoignez l'aventure
          </h2>
          <p className="text-muted-foreground mb-8">Donnez à votre activité la visibilité qu'elle mérite.</p>
          <button
            onClick={() => navigate('/auth')}
            className="gradient-bg text-primary-foreground px-7 py-3.5 rounded-pill text-base font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            Démarrer gratuitement <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default About;