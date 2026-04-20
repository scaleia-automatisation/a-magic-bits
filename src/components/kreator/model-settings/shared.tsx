import React from 'react';

export const IMAGE_HINT = 'Formats pris en charge : JPG, JPEG, PNG ; chaque fichier a une taille maximale de 10 Mo.';
export const IMAGE_HINT_WEBP = 'Cliquez pour télécharger ou glissez-déposez. Formats : JPEG, PNG, WEBP. Taille max : 10 Mo.';

export const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4 p-4 rounded-card border border-foreground/10 bg-card/50">{children}</div>
);

export const Field = ({ label, children, required, hint }: { label: string; children: React.ReactNode; required?: boolean; hint?: string }) => (
  <div>
    <label className="text-sm font-medium text-foreground mb-2 block">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}
    {children}
  </div>
);

export function PillGroup<T extends string | number>({
  options, value, onChange, cols,
}: {
  options: { value: T; label: string; sublabel?: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
  cols?: number;
}) {
  const c = cols ?? Math.min(options.length, 3);
  const colsClass = c === 2 ? 'grid-cols-2' : c === 3 ? 'grid-cols-3' : c === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3';
  return (
    <div className={`grid gap-2 sm:gap-3 ${colsClass}`}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-2 rounded-btn text-sm font-medium transition-all border-2 ${
            value === o.value
              ? 'border-primary bg-primary/10 text-foreground'
              : 'border-foreground/10 bg-card text-muted-foreground hover:border-secondary'
          }`}
        >
          <div>{o.label}</div>
          {o.sublabel && <div className="text-xs text-muted-foreground">{o.sublabel}</div>}
        </button>
      ))}
    </div>
  );
}

// Generic aspect cards with proportional preview rectangles
export function AspectCards<T extends string>({
  options, value, onChange,
}: {
  options: T[];
  value?: T;
  onChange: (v: T) => void;
}) {
  const dims = (a: string) => {
    const [w, h] = a.split(':').map(Number);
    if (!w || !h) return { w: 40, h: 40 };
    const max = 56;
    const ratio = w / h;
    if (ratio >= 1) return { w: max, h: Math.round(max / ratio) };
    return { w: Math.round(max * ratio), h: max };
  };
  return (
    <div className={`grid gap-3 ${options.length > 4 ? 'grid-cols-3 sm:grid-cols-6' : `grid-cols-${options.length}`}`}>
      {options.map((a) => {
        const d = dims(a);
        const active = value === a;
        return (
          <button
            key={a}
            type="button"
            onClick={() => onChange(a)}
            className={`flex flex-col items-center gap-2 p-3 rounded-card border-2 transition-all ${
              active ? 'border-primary bg-card' : 'border-foreground/10 bg-card hover:border-secondary'
            }`}
          >
            <div
              style={{ width: d.w, height: d.h }}
              className={`rounded border-2 ${active ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 bg-muted/30'}`}
            />
            <span className={`text-xs font-bold ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{a}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SubModelTabs<T extends string>({
  options, value, onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className={`grid gap-2 ${options.length === 2 ? 'grid-cols-2' : options.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3 py-2 rounded-card text-sm font-medium border-2 transition-all ${
            value === o.value
              ? 'border-primary bg-primary/10 text-foreground'
              : 'border-foreground/10 bg-card text-muted-foreground hover:border-secondary'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
