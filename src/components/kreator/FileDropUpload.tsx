import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useStorageUpload, type UploadKind } from '@/hooks/useStorageUpload';

interface Props {
  label: string;
  hint?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  kind?: UploadKind;
  accept?: string;
}

const FileDropUpload = ({ label, hint, value, onChange, kind = 'image', accept }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, accept: defaultAccept } = useStorageUpload();
  const [drag, setDrag] = useState(false);

  const handleFile = async (file: File) => {
    const url = await upload(file, kind);
    if (url) onChange(url);
  };

  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-2 block">{label}</label>

      {value ? (
        <div className="relative inline-block">
          {kind === 'image' ? (
            <img src={value} alt={label} className="w-32 h-32 object-cover rounded-card border border-foreground/10" />
          ) : (
            <div className="w-48 px-3 py-2 rounded-card border border-foreground/10 bg-card text-xs text-muted-foreground truncate">
              {value.split('/').pop()}
            </div>
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
            aria-label="Retirer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className={`flex flex-col items-center justify-center gap-2 p-6 rounded-card border-2 border-dashed cursor-pointer transition-all ${
            drag ? 'border-primary bg-primary/5' : 'border-foreground/20 hover:border-secondary hover:bg-secondary/5'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground text-center">
            Glissez-déposez ou cliquez pour télécharger votre {kind === 'image' ? 'image' : kind === 'video' ? 'vidéo' : 'fichier audio'}
          </p>
          {hint && <p className="text-xs text-muted-foreground/70 text-center">{hint}</p>}
          <input
            ref={inputRef}
            type="file"
            accept={accept || defaultAccept[kind]}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              if (inputRef.current) inputRef.current.value = '';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FileDropUpload;
