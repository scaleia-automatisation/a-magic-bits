import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Camille R.',
    role: 'Restauratrice — TPE',
    initials: 'CR',
    text: "Je publie tous les jours sans y passer mes soirées. Mes plats du jour sont vus 3x plus depuis que j'utilise Créafacile.",
  },
  {
    name: 'Julien M.',
    role: 'Coach sportif — Freelance',
    initials: 'JM',
    text: "En 3 clics j'ai un Reel pro avec caption + hashtags. Mes prises de RDV ont doublé en 2 mois.",
  },
  {
    name: 'Sophie L.',
    role: 'Coiffeuse — TPE',
    initials: 'SL',
    text: "Je n'avais aucune idée quoi poster. Maintenant l'IA propose et je n'ai qu'à valider. Un vrai gain de temps.",
  },
  {
    name: 'Marc D.',
    role: 'Consultant — Freelance',
    initials: 'MD',
    text: "Mes posts LinkedIn ont enfin une vraie ligne éditoriale. +400 abonnés en un mois sans effort.",
  },
  {
    name: 'Laëtitia P.',
    role: 'Formatrice digitale',
    initials: 'LP',
    text: "L'outil le plus simple que j'ai testé. Mes élèves l'adorent et moi je gagne 10h par semaine.",
  },
  {
    name: 'Karim B.',
    role: 'E-commerce — PME',
    initials: 'KB',
    text: "ROI immédiat. Visuels qualité agence, textes qui convertissent. Coût ridicule comparé à mon ancienne agence.",
  },
  {
    name: 'Anaïs G.',
    role: 'Esthéticienne — TPE',
    initials: 'AG',
    text: "Mes avant/après ont enfin du peps. Mes clientes me disent qu'elles me trouvent grâce à Insta.",
  },
  {
    name: 'Thomas V.',
    role: 'Coach business',
    initials: 'TV',
    text: "Je recommande à tous mes clients TPE. C'est l'outil qui manquait pour démocratiser le marketing pro.",
  },
  {
    name: 'Élodie F.',
    role: 'Agence immobilière — PME',
    initials: 'EF',
    text: "Nos annonces sortent du lot. L'IA adapte le ton à chaque bien, c'est bluffant.",
  },
  {
    name: 'Nicolas H.',
    role: 'Artisan menuisier — Freelance',
    initials: 'NH',
    text: "Je ne suis pas du tout marketing, et pourtant mes posts sont meilleurs que ceux de mes concurrents. Magique.",
  },
];

const TestimonialsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // Auto-scroll loop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    const tick = () => {
      if (!paused && el) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const scrollBy = (dir: number) => {
    setPaused(true);
    scrollRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });
    window.setTimeout(() => setPaused(false), 1500);
  };

  // Duplicate for seamless loop
  const items = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-12 md:py-16 border-t border-foreground/5">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-3">
            Ils créent <span className="gradient-text italic">déjà avec Créafacile</span>
          </h2>
          <p className="text-muted-foreground">
            TPE, PME, freelances, coachs, formateurs — tous gagnent du temps et des clients.
          </p>
        </div>

        <div className="relative">
          {/* Left arrow */}
          <button
            aria-label="Précédent"
            onClick={() => scrollBy(-1)}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full gradient-bg text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right arrow */}
          <button
            aria-label="Suivant"
            onClick={() => scrollBy(1)}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full gradient-bg text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Fades */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-background to-transparent z-[5]" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-background to-transparent z-[5]" />

          <div
            ref={scrollRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
            className="flex gap-5 overflow-x-auto scroll-smooth px-8 md:px-12 py-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((t, i) => (
              <article
                key={i}
                className="shrink-0 w-[300px] md:w-[340px] p-6 rounded-card border border-foreground/5 bg-card hover:border-primary/40 transition-colors flex flex-col"
              >
                <div className="flex items-center gap-1 mb-3 text-primary">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-5 flex-1">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-bg text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;