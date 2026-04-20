import { useRef } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { useStorageUpload, type UploadKind } from '@/hooks/useStorageUpload';

interface Props {
  label: string;
  hint?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  max: number;
  kind?: UploadKind;
}

const MultiFileUpload = ({ label, hint, values, onChange, max, kind = 'image' }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, accept } = useStorageUpload();

  const remaining = max - values.length;

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, remaining);
    const next = [...values];
    for (const file of arr) {
      const url = await upload(file, kind);
      if (url) next.push(url);
    }
    onChange(next);
  };

  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="text-sm font-medium text-foreground mb-2 block">
        {label} <span className="text-muted-foreground font-normal">({values.length}/{max})</span>
      </label>
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}

      <div className="flex flex-wrap gap-3">
        {values.map((url, i) => (
          <div key={i} className="relative">
            {kind === 'image' ? (
              <img src={url} alt={`${label} ${i + 1}`} className="w-24 h-24 object-cover rounded-card border border-foreground/10" />
            ) : (
              <div className="w-32 h-24 px-2 py-2 rounded-card border border-foreground/10 bg-card text-xs text-muted-foreground flex items-center justify-center text-center break-all">
                {url.split('/').pop()?.slice(0, 20)}…
              </div>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-card border-2 border-dashed border-foreground/20 hover:border-secondary hover:bg-secondary/5 flex flex-col items-center justify-center gap-1 transition-all disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Plus className="w-5 h-5 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">Ajouter</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept[kind]}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            if (inputRef.current) inputRef.current.value = '';
          }}
        />
      </div>
    </div>
  );
};

export default MultiFileUpload;
