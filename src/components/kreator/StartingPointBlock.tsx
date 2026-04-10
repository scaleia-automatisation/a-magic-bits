import { useState, useRef } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Upload, X, Replace, ImagePlus, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

const StartingPointBlock = () => {
  const { input_photos, setInputPhotos, input_text, setInputText, input_image_url, setInputImageUrl } = useKreatorStore();

  // Refs for file inputs
  const photoRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const perfRef = useRef<HTMLInputElement>(null);

  // Local state for perf image
  const [perfImage, setPerfImage] = useState('');

  const handlePhotoFile = (file: File, index: number) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Le fichier dépasse ${MAX_SIZE_MB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const newPhotos = [...input_photos];
      while (newPhotos.length < 3) newPhotos.push({ url: '', description: '' });
      newPhotos[index] = { url: base64, description: newPhotos[index]?.description || '' };
      setInputPhotos(newPhotos);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...input_photos];
    newPhotos[index] = { url: '', description: '' };
    setInputPhotos(newPhotos);
  };

  const handlePerfFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Le fichier dépasse ${MAX_SIZE_MB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPerfImage(base64);
      setInputImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const slots = Array.from({ length: 3 }, (_, i) => input_photos[i] || { url: '', description: '' });

  return (
    <div className="step-border bg-background p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-2 h-2 rounded-full gradient-bg" />
        <h2 className="text-lg font-bold text-foreground">Point de départ</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Upload up to 3 reference images */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <ImagePlus className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Images de référence</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Importez jusqu'à 3 images pour inspirer la génération</p>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot, index) => (
              <div key={index}>
                {slot.url ? (
                  <div className="relative group aspect-square rounded-lg overflow-hidden border border-foreground/10 bg-card">
                    <img src={slot.url} alt={`Ref ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-foreground bg-card/80 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleRemovePhoto(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-foreground bg-card/80 hover:bg-primary hover:text-primary-foreground"
                        onClick={() => photoRefs[index]?.current?.click()}
                      >
                        <Replace className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => photoRefs[index]?.current?.click()}
                    className="aspect-square w-full rounded-lg border-2 border-dashed border-foreground/10 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-[9px] font-medium">{index + 1}</span>
                  </button>
                )}
                <input
                  ref={photoRefs[index]}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoFile(file, index);
                    e.target.value = '';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Activity description */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Description libre</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Décrivez votre activité ou ce que vous souhaitez communiquer</p>
          <Textarea
            value={input_text}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ex: Je suis coach fitness et je veux promouvoir mon nouveau programme de 30 jours..."
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground text-sm min-h-[120px] resize-none"
          />
        </div>

        {/* Column 3: High-performing content image */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Contenu qui a performé</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">Uploadez un visuel de contenu qui a bien marché</p>
          {perfImage ? (
            <div className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-foreground/10 bg-card">
              <img src={perfImage} alt="Contenu performant" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-foreground bg-card/80 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => { setPerfImage(''); setInputImageUrl(''); }}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-foreground bg-card/80 hover:bg-primary hover:text-primary-foreground"
                  onClick={() => perfRef.current?.click()}
                >
                  <Replace className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => perfRef.current?.click()}
              className="aspect-[4/3] w-full rounded-lg border-2 border-dashed border-foreground/10 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
            >
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">Importer un visuel</span>
            </button>
          )}
          <input
            ref={perfRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePerfFile(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StartingPointBlock;
