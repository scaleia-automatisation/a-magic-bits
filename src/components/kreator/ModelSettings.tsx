import { useKreatorStore, type AIModel, type SoraAspect, type SoraDuration, type SoraProSize, type VeoSubMode, type VeoSubModel, type VeoAspect, type VeoResolution } from '@/store/useKreatorStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import FileDropUpload from './FileDropUpload';
import MultiFileUpload from './MultiFileUpload';

const IMAGE_HINT = 'Formats pris en charge : JPG, JPEG, PNG ; chaque fichier a une taille maximale de 10 Mo.';

const PillGroup = <T extends string | number>({
  options, value, onChange,
}: {
  options: { value: T; label: string; sublabel?: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
}) => (
  <div className={`grid gap-2 sm:gap-3 grid-cols-${Math.min(options.length, 3)}`}>
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

const AspectCards = ({
  options, value, onChange,
}: {
  options: VeoAspect[];
  value?: VeoAspect;
  onChange: (v: VeoAspect) => void;
}) => (
  <div className="grid grid-cols-2 gap-3">
    {options.map((a) => (
      <button
        key={a}
        type="button"
        onClick={() => onChange(a)}
        className={`flex flex-col items-center gap-2 p-3 rounded-card border-2 transition-all ${
          value === a ? 'border-primary bg-card' : 'border-foreground/10 bg-card hover:border-secondary'
        }`}
      >
        <div className={`${a === '9:16' ? 'w-8 h-14' : 'w-14 h-8'} rounded border-2 ${
          value === a ? 'border-primary bg-primary/10' : 'border-muted-foreground/30 bg-muted/30'
        }`} />
        <span className={`text-sm font-bold ${value === a ? 'text-foreground' : 'text-muted-foreground'}`}>{a}</span>
      </button>
    ))}
  </div>
);

const Section = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4 p-4 rounded-card border border-foreground/10 bg-card/50">{children}</div>
);

const Field = ({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) => (
  <div>
    <label className="text-sm font-medium text-foreground mb-2 block">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {children}
  </div>
);

// ---------- SORA ----------
const SoraT2V = ({ pro = false }: { pro?: boolean }) => {
  const { model_settings, setModelSetting } = useKreatorStore();
  return (
    <Section>
      <Field label="Format">
        <PillGroup<SoraAspect>
          options={[{ value: 'portrait', label: 'Portrait' }, { value: 'paysage', label: 'Paysage' }]}
          value={model_settings.sora_aspect_ratio}
          onChange={(v) => setModelSetting('sora_aspect_ratio', v)}
        />
      </Field>
      <Field label="Durée">
        <PillGroup<SoraDuration>
          options={[{ value: 10, label: '10s' }, { value: 15, label: '15s' }]}
          value={model_settings.sora_n_frames}
          onChange={(v) => setModelSetting('sora_n_frames', v)}
        />
      </Field>
      {pro && (
        <Field label="Qualité" required>
          <PillGroup<SoraProSize>
            options={[{ value: 'standard', label: 'Standard' }, { value: 'high', label: 'Haute' }]}
            value={model_settings.sora_pro_size}
            onChange={(v) => setModelSetting('sora_pro_size', v)}
          />
        </Field>
      )}
      <div className="flex items-center justify-between">
        <Label htmlFor="rmwm" className="text-sm text-foreground">Retirer le watermark</Label>
        <Switch
          id="rmwm"
          checked={!!model_settings.sora_remove_watermark}
          onCheckedChange={(c) => setModelSetting('sora_remove_watermark', c)}
        />
      </div>
    </Section>
  );
};

const SoraI2V = ({ pro = false }: { pro?: boolean }) => {
  const { model_settings, setModelSetting } = useKreatorStore();
  return (
    <Section>
      <FileDropUpload
        label="Image source"
        hint={IMAGE_HINT + ' (1 image max)'}
        value={model_settings.sora_image_url}
        onChange={(url) => setModelSetting('sora_image_url', url || undefined)}
        kind="image"
      />
      <Field label="Format">
        <PillGroup<SoraAspect>
          options={[{ value: 'portrait', label: 'Portrait' }, { value: 'paysage', label: 'Paysage' }]}
          value={model_settings.sora_aspect_ratio}
          onChange={(v) => setModelSetting('sora_aspect_ratio', v)}
        />
      </Field>
      <Field label="Durée">
        <PillGroup<SoraDuration>
          options={[{ value: 10, label: '10s' }, { value: 15, label: '15s' }]}
          value={model_settings.sora_n_frames}
          onChange={(v) => setModelSetting('sora_n_frames', v)}
        />
      </Field>
      {pro && (
        <Field label="Qualité" required>
          <PillGroup<SoraProSize>
            options={[{ value: 'standard', label: 'Standard' }, { value: 'high', label: 'Haute' }]}
            value={model_settings.sora_pro_size}
            onChange={(v) => setModelSetting('sora_pro_size', v)}
          />
        </Field>
      )}
      {!pro && (
        <div className="flex items-center justify-between">
          <Label htmlFor="rmwm-i" className="text-sm text-foreground">Retirer le watermark</Label>
          <Switch
            id="rmwm-i"
            checked={!!model_settings.sora_remove_watermark}
            onCheckedChange={(c) => setModelSetting('sora_remove_watermark', c)}
          />
        </div>
      )}
    </Section>
  );
};

// ---------- VEO ----------
const VeoSettings = () => {
  const { model_settings, setModelSetting } = useKreatorStore();
  const sub: VeoSubMode = model_settings.veo_sub_mode || 't2v';
  const subModel: VeoSubModel = model_settings.veo_sub_model || 'veo-3.1-quality';

  return (
    <Section>
      <Field label="Type de génération" required>
        <div className="grid grid-cols-3 gap-2">
          {([
            { v: 't2v', l: 'Texte vers vidéo' },
            { v: 'i2v', l: 'Image vers vidéo' },
            { v: 'reference', l: 'Référence' },
          ] as { v: VeoSubMode; l: string }[]).map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setModelSetting('veo_sub_mode', o.v)}
              className={`px-3 py-2 rounded-card text-sm font-medium border-2 transition-all ${
                sub === o.v
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-foreground/10 bg-card text-muted-foreground hover:border-secondary'
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Modèle">
        <Select value={subModel} onValueChange={(v) => setModelSetting('veo_sub_model', v as VeoSubModel)}>
          <SelectTrigger className="bg-card border-foreground/10 text-foreground"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-card border-foreground/10">
            <SelectItem value="veo-3.1-lite">Veo 3.1 Lite</SelectItem>
            <SelectItem value="veo-3.1-fast">Veo 3.1 Fast</SelectItem>
            <SelectItem value="veo-3.1-quality">Veo 3.1 Quality</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {sub === 'i2v' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileDropUpload
            label="Image de départ"
            hint={IMAGE_HINT}
            value={model_settings.veo_start_image_url}
            onChange={(url) => setModelSetting('veo_start_image_url', url || undefined)}
            kind="image"
          />
          <FileDropUpload
            label="Image de fin"
            hint={IMAGE_HINT}
            value={model_settings.veo_end_image_url}
            onChange={(url) => setModelSetting('veo_end_image_url', url || undefined)}
            kind="image"
          />
        </div>
      )}

      {sub === 'reference' && (
        <MultiFileUpload
          label="Images de référence"
          hint={IMAGE_HINT}
          values={model_settings.veo_reference_image_urls || []}
          onChange={(urls) => setModelSetting('veo_reference_image_urls', urls)}
          max={3}
          kind="image"
        />
      )}

      <Field label="Format" required>
        <AspectCards
          options={['16:9', '9:16']}
          value={model_settings.veo_aspect}
          onChange={(v) => setModelSetting('veo_aspect', v)}
        />
      </Field>

      <Field label="Résolution" required>
        <PillGroup<VeoResolution>
          options={[
            { value: '720p', label: '720p' },
            { value: '1080p', label: '1080p' },
            { value: '4K', label: '4K' },
          ]}
          value={model_settings.veo_resolution}
          onChange={(v) => setModelSetting('veo_resolution', v)}
        />
      </Field>
    </Section>
  );
};

// ---------- ROUTER ----------
const ModelSettings = () => {
  const { ai_model } = useKreatorStore();
  const m: AIModel = ai_model;

  if (m === 'sora-2-t2v') return <SoraT2V />;
  if (m === 'sora-2-i2v') return <SoraI2V />;
  if (m === 'sora-2-pro-t2v') return <SoraT2V pro />;
  if (m === 'sora-2-pro-i2v') return <SoraI2V pro />;
  if (m === 'veo-3' || m === 'veo-3.1') return <VeoSettings />;

  return null;
};

export default ModelSettings;
