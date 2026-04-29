import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Sparkles, Image as ImageIcon, Video, Layers } from 'lucide-react';
import imageBefore from '@/assets/before-after/image-before.jpg';
import imageAfter from '@/assets/before-after/image-after.jpg';
import carouselBefore from '@/assets/before-after/carousel-before.jpg';
import carouselAfter1 from '@/assets/before-after/carousel-after-1.jpg';
import carouselAfter2 from '@/assets/before-after/carousel-after-2.jpg';
import carouselAfter3 from '@/assets/before-after/carousel-after-3.jpg';
import videoBefore from '@/assets/before-after/video-before.jpg';
import videoAfter from '@/assets/before-after/video-after.jpg';

const Label = ({ kind }: { kind: 'before' | 'after' }) => (
  <div
    className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-pill text-[10px] font-bold uppercase tracking-wider backdrop-blur ${
      kind === 'before'
        ? 'bg-foreground/10 text-muted-foreground border border-foreground/10'
        : 'gradient-bg text-primary-foreground'
    }`}
  >
    {kind === 'before' ? 'Avant' : 'Après · Créafacile'}
  </div>
);

const CarouselAfter = () => {
  const slides = [carouselAfter1, carouselAfter2, carouselAfter3];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-card bg-card">
      <Label kind="after" />
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Slide ${i + 1}`}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === idx ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const VideoAfter = () => (
  <div className="relative aspect-video w-full overflow-hidden rounded-card bg-black group">
    <Label kind="after" />
    <img
      src={videoAfter}
      alt="Vidéo publicitaire produit générée"
      loading="lazy"
      className="h-full w-full object-cover"
    />
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
        <Play className="w-6 h-6 text-white fill-white ml-1" />
      </div>
    </div>
    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
      <p className="text-white text-xs font-semibold">🎬 Vidéo publicitaire 16:9 · 8s · Sora 2</p>
    </div>
  </div>
);

const BeforeAfterShowcase = () => {
  const cases = [
    {
      icon: ImageIcon,
      tag: 'Image · 1:1',
      title: 'Photo produit qui donne envie',
      desc: 'Transformez un cliché smartphone en visuel de magazine, prêt pour Instagram.',
      beforeAspect: 'aspect-square',
      before: imageBefore,
      afterNode: (
        <div className="relative aspect-square w-full overflow-hidden rounded-card bg-card">
          <Label kind="after" />
          <img src={imageAfter} alt="Image générée" loading="lazy" className="h-full w-full object-cover" />
        </div>
      ),
    },
    {
      icon: Layers,
      tag: 'Carrousel · 3 slides',
      title: 'Carrousel storytelling automatique',
      desc: 'Une simple idée devient un carrousel cohérent avec accroche, preuve et CTA.',
      beforeAspect: 'aspect-square',
      before: carouselBefore,
      afterNode: <CarouselAfter />,
    },
    {
      icon: Video,
      tag: 'Vidéo · 16:9',
      title: 'Pub vidéo cinématique',
      desc: 'Une photo statique devient un spot publicitaire animé, format paysage HD.',
      beforeAspect: 'aspect-video',
      before: videoBefore,
      afterNode: <VideoAfter />,
    },
  ];

  return (
    <section className="pt-6 md:pt-8 pb-20 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill border border-foreground/10 bg-card/50 backdrop-blur mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium">Avant / Après</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black tracking-tight mb-4">
            Vos contenus, <span className="gradient-text">métamorphosés.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trois exemples concrets de ce que Créafacile produit en 3 clics, à partir d'idées banales.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div
              key={c.title}
              className="p-5 rounded-card border border-foreground/5 bg-card hover:border-primary/30 transition-colors flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <c.icon className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{c.tag}</span>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-5">
                <div className={`relative ${c.beforeAspect} w-full overflow-hidden rounded-card bg-card border border-foreground/10`}>
                  <Label kind="before" />
                  <img
                    src={c.before}
                    alt="Avant"
                    loading="lazy"
                    className="h-full w-full object-cover grayscale opacity-80"
                  />
                </div>
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>{c.afterNode}</div>
              </div>

              <h3 className="text-base font-bold text-foreground mb-1.5">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterShowcase;
