import { useState, useRef } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Upload, X, Replace } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MAX_PHOTOS = 4;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

const PhotoUpload = () => {
  const { input_photos, setInputPhotos } = useKreatorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newPhotos = [...input_photos];
    
    for (let i = 0; i < files.length; i++) {
      if (newPhotos.length >= MAX_PHOTOS) {
        toast.error(`Maximum ${MAX_PHOTOS} photos`);
        break;
      }

      const file = files[i];
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`Format non supporté: ${file.name}. Utilisez JPG, PNG ou WEBP.`);
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} dépasse ${MAX_SIZE_MB}MB`);
        continue;
      }

      const url = URL.createObjectURL(file);
      newPhotos.push(url);
    }

    setInputPhotos(newPhotos);
  };

  const handleRemove = (index: number) => {
    const newPhotos = input_photos.filter((_, i) => i !== index);
    setInputPhotos(newPhotos);
  };

  const handleReplace = (index: number) => {
    setReplaceIndex(index);
    replaceInputRef.current?.click();
  };

  const handleReplaceFile = (files: FileList | null) => {
    if (!files || files.length === 0 || replaceIndex === null) return;

    const file = files[0];
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Le fichier dépasse ${MAX_SIZE_MB}MB`);
      return;
    }

    const url = URL.createObjectURL(file);
    const newPhotos = [...input_photos];
    newPhotos[replaceIndex] = url;
    setInputPhotos(newPhotos);
    setReplaceIndex(null);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground block">
        Photos de référence ({input_photos.length}/{MAX_PHOTOS})
      </label>

      {/* Photo grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {input_photos.map((photo, index) => (
          <div key={index} className="relative group aspect-square rounded-card overflow-hidden border border-foreground/10 bg-card">
            <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground bg-card/80 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => handleRemove(index)}
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground bg-card/80 hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleReplace(index)}
              >
                <Replace className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {/* Add photo button */}
        {input_photos.length < MAX_PHOTOS && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-card border-2 border-dashed border-foreground/10 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
          >
            <Upload className="w-6 h-6" />
            <span className="text-xs font-medium">Ajouter</span>
          </button>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => {
          handleReplaceFile(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
};

export default PhotoUpload;
