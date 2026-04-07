import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Image, Layers, Video, Trash2, Eye, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Generation {
  id: string;
  type: string;
  ai_model: string;
  credits_used: number;
  status: string;
  created_at: string;
  result_url: string | null;
  prompt_fr_final: string | null;
}

const MyGenerations = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string>('image');
  const [loadingData, setLoadingData] = useState(true);

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
    toast.success('Génération supprimée');
  };

  const typeIcon = (type: string) => {
    if (type === 'carousel') return <Layers className="w-5 h-5" />;
    if (type === 'video') return <Video className="w-5 h-5" />;
    return <Image className="w-5 h-5" />;
  };

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
            <Button onClick={() => navigate('/')} className="gradient-bg border-0 text-primary-foreground">
              Créer du contenu ✨
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {generations.map((gen) => (
              <div key={gen.id} className="card-surface border border-foreground/10 rounded-card overflow-hidden group">
                {gen.result_url ? (
                  <div className="relative aspect-square bg-muted">
                    {gen.type === 'video' ? (
                      <video src={gen.result_url} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={gen.result_url} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-card/80 text-foreground hover:bg-card"
                        onClick={() => { setPreviewUrl(gen.result_url); setPreviewType(gen.type); }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-destructive/20 text-destructive hover:bg-destructive/30"
                        onClick={() => handleDelete(gen.id)}
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

      {/* Preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-3xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-10 right-0 text-foreground"
              onClick={() => setPreviewUrl(null)}
            >
              <X className="w-5 h-5" />
            </Button>
            <img src={previewUrl} alt="Aperçu" className="w-full h-auto rounded-card" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGenerations;
