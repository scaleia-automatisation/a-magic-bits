import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Image, Layers, Video, Trash2, ArrowLeft, X, Download, Copy, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type PlatformKey = 'facebook' | 'instagram' | 'tiktok' | 'linkedin';

interface CaptionBlock {
  hook?: string;
  description?: string;
  cta?: string;
  hashtags?: string;
}

interface Generation {
  id: string;
  type: string;
  ai_model: string;
  credits_used: number;
  status: string;
  created_at: string;
  result_url: string | null;
  prompt_fr_final: string | null;
  captions?: Partial<Record<PlatformKey, CaptionBlock>> | null;
}

const MyGenerations = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [detailGen, setDetailGen] = useState<Generation | null>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformKey>('facebook');

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    loadGenerations();
  }, [user]);

  const loadGenerations = async () => {
    setLoadingData(true);
    const { data } = await supabase
      .from('generations')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setGenerations(data as Generation[]);
    setLoadingData(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('generations').delete().eq('id', id);
    if (error) {
      toast.error('Erreur lors de la suppression');
      return;
    }
    setGenerations((prev) => prev.filter((g) => g.id !== id));
    if (detailGen?.id === id) setDetailGen(null);
    toast.success('Génération supprimée');
  };

  const typeIcon = (type: string) => {
    if (type === 'carousel') return <Layers className="w-5 h-5" />;
    if (type === 'video') return <Video className="w-5 h-5" />;
    return <Image className="w-5 h-5" />;
  };

  const handleDownload = async (url: string, type: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const ext = type === 'video' ? 'mp4' : 'jpg';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `creafacile-${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('Téléchargement lancé');
    } catch {
      toast.error('Téléchargement impossible');
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Lien copié — collez-le dans votre publication');
    } catch {
      toast.error('Copie impossible');
    }
  };

  const openShare = (platform: 'facebook' | 'instagram' | 'tiktok' | 'linkedin', url: string) => {
    const enc = encodeURIComponent(url);
    let target = '';
    switch (platform) {
      case 'facebook':
        target = `https://www.facebook.com/sharer/sharer.php?u=${enc}`;
        break;
      case 'linkedin':
        target = `https://www.linkedin.com/sharing/share-offsite/?url=${enc}`;
        break;
      case 'instagram':
      case 'tiktok':
        // Pas d'API web de publication: on copie le lien et on ouvre l'app/site
        navigator.clipboard.writeText(url).catch(() => {});
        toast.success('Lien copié. Téléchargez le média puis publiez-le sur ' + (platform === 'instagram' ? 'Instagram' : 'TikTok'));
        target = platform === 'instagram' ? 'https://www.instagram.com/' : 'https://www.tiktok.com/upload';
        break;
    }
    window.open(target, '_blank', 'noopener,noreferrer');
  };

  const buildFullCaption = (c?: CaptionBlock | null) => {
    if (!c) return '';
    return [c.hook, c.description, c.cta, c.hashtags].filter(Boolean).join('\n\n');
  };

  const handleCopyCaption = async (c?: CaptionBlock | null) => {
    const text = buildFullCaption(c);
    if (!text) {
      toast.error('Aucune caption disponible');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Caption copiée — collez-la dans votre publication');
    } catch {
      toast.error('Copie impossible');
    }
  };

  const openDetail = (gen: Generation) => {
    setDetailGen(gen);
    const firstAvailable = (['facebook', 'instagram', 'tiktok', 'linkedin'] as PlatformKey[])
      .find(p => gen.captions?.[p]) || 'facebook';
    setActivePlatform(firstAvailable);
  };

  const platforms: { key: PlatformKey; label: string; icon: JSX.Element }[] = [
    { key: 'facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
    { key: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
    { key: 'tiktok', label: 'TikTok', icon: <Video className="w-4 h-4" /> },
    { key: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" /> },
  ];

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow text-2xl">✨</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/5">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-lg md:text-xl font-black gradient-text">Mes générations</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {generations.length === 0 ? (
          <div className="card-surface p-8 md:p-12 border border-foreground/10 rounded-card text-center">
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Aucune génération pour le moment</p>
            <Button onClick={() => navigate('/app')} className="gradient-bg border-0 text-primary-foreground">
              Créer du contenu ✨
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generations.map((gen) => (
              <div
                key={gen.id}
                className="card-surface border border-foreground/10 rounded-card overflow-hidden group cursor-pointer hover:border-primary/40 transition"
                onClick={() => openDetail(gen)}
              >
                {gen.result_url ? (
                  <div className="relative aspect-square bg-muted">
                    {gen.type === 'video' ? (
                      <video src={gen.result_url} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={gen.result_url} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-destructive/20 text-destructive hover:bg-destructive/30 h-8 w-8 p-0"
                        onClick={(e) => { e.stopPropagation(); handleDelete(gen.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground">
                    {typeIcon(gen.type)}
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    {typeIcon(gen.type)}
                    <span className="text-sm font-medium text-foreground capitalize">{gen.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-pill ml-auto ${
                      gen.status === 'done' ? 'bg-green-500/10 text-green-400' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {gen.status === 'done' ? 'Terminé' : 'Erreur'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(gen.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}{gen.credits_used} crédit{gen.credits_used > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail modal: media + captions par réseau + publier/télécharger */}
      {detailGen && (
        <div className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-2 md:p-4 overflow-y-auto" onClick={() => setDetailGen(null)}>
          <div
            className="relative w-full max-w-5xl my-auto card-surface border border-foreground/10 rounded-card overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-foreground/10">
              <h3 className="text-lg font-bold gradient-text capitalize">
                {detailGen.type} · {new Date(detailGen.created_at).toLocaleDateString('fr-FR')}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setDetailGen(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 max-h-[80vh] overflow-y-auto">
              {/* Média */}
              <div className="p-4 bg-muted/30 flex items-center justify-center">
                {detailGen.result_url ? (
                  detailGen.type === 'video' ? (
                    <video src={detailGen.result_url} controls autoPlay loop playsInline className="w-full rounded-card" style={{ maxHeight: '70vh' }} />
                  ) : (
                    <img src={detailGen.result_url} alt="Aperçu" className="w-full h-auto rounded-card" style={{ maxHeight: '70vh', objectFit: 'contain' }} />
                  )
                ) : (
                  <div className="text-muted-foreground">Aucun média</div>
                )}
              </div>

              {/* Captions + actions */}
              <div className="p-4 space-y-4">
                {/* Onglets réseaux */}
                <div className="flex gap-1 flex-wrap">
                  {platforms.map(p => {
                    const has = !!detailGen.captions?.[p.key];
                    const active = activePlatform === p.key;
                    return (
                      <button
                        key={p.key}
                        onClick={() => setActivePlatform(p.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-medium transition ${
                          active
                            ? 'gradient-bg text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                        } ${!has ? 'opacity-50' : ''}`}
                      >
                        {p.icon}
                        {p.label}
                      </button>
                    );
                  })}
                </div>

                {/* Caption du réseau actif */}
                {detailGen.captions?.[activePlatform] ? (
                  <div className="space-y-3">
                    {detailGen.captions[activePlatform]?.hook && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Hook</div>
                        <p className="text-sm text-foreground font-semibold">{detailGen.captions[activePlatform]?.hook}</p>
                      </div>
                    )}
                    {detailGen.captions[activePlatform]?.description && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Description</div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{detailGen.captions[activePlatform]?.description}</p>
                      </div>
                    )}
                    {detailGen.captions[activePlatform]?.cta && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Call to action</div>
                        <p className="text-sm text-primary font-semibold">{detailGen.captions[activePlatform]?.cta}</p>
                      </div>
                    )}
                    {detailGen.captions[activePlatform]?.hashtags && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Hashtags</div>
                        <p className="text-sm text-muted-foreground">{detailGen.captions[activePlatform]?.hashtags}</p>
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleCopyCaption(detailGen.captions?.[activePlatform])}
                    >
                      <Copy className="w-4 h-4 mr-2" /> Copier la caption {platforms.find(p => p.key === activePlatform)?.label}
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic py-6 text-center border border-dashed border-foreground/10 rounded-card">
                    Aucune caption enregistrée pour ce réseau.
                  </div>
                )}

                {/* Actions média + publication */}
                <div className="pt-3 border-t border-foreground/10 space-y-2">
                  {detailGen.result_url && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 gradient-bg border-0 text-primary-foreground"
                        onClick={() => handleDownload(detailGen.result_url!, detailGen.type)}
                      >
                        <Download className="w-4 h-4 mr-2" /> Télécharger
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleCopyLink(detailGen.result_url!)}
                      >
                        <Copy className="w-4 h-4 mr-2" /> Copier le lien
                      </Button>
                    </div>
                  )}

                  {detailGen.result_url && (
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Publier sur</div>
                      <div className="grid grid-cols-2 gap-2">
                        {platforms.map(p => (
                          <Button
                            key={p.key}
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-center gap-2"
                            onClick={() => openShare(p.key, detailGen.result_url!)}
                          >
                            {p.icon}
                            <span className="text-xs">{p.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGenerations;
