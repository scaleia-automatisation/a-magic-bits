import { useKreatorStore, type SeedanceAspect, type SeedanceResolution, type Seedance2SubModel } from '@/store/useKreatorStore';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileDropUpload from '../FileDropUpload';
import MultiFileUpload from '../MultiFileUpload';
import { Section, Field, PillGroup, AspectCards, SubModelTabs, IMAGE_HINT } from './shared';

const ASPECTS: SeedanceAspect[] = ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9'];
const RES: SeedanceResolution[] = ['480p', '720p', '1080p'];
const AUDIO_HINT = 'Formats pris en charge : MPEG, WAV, X-WAV, AAC, MP4, OGG. Taille max : 15 Mo.';

export const Seedance15Pro = () => {
  const { model_settings, setModelSetting } = useKreatorStore();
  return (
    <Section>
      <MultiFileUpload
        label="Images source (optionnel)"
        hint={IMAGE_HINT + ' (max 2 images)'}
        values={model_settings.seedance_image_urls || []}
        onChange={(urls) => setModelSetting('seedance_image_urls', urls)}
        max={2}
        kind="image"
      />
      <Field label="Format">
        <AspectCards options={ASPECTS} value={model_settings.seedance_aspect} onChange={(v) => setModelSetting('seedance_aspect', v)} />
      </Field>
      <Field label="Résolution">
        <PillGroup<SeedanceResolution>
          options={RES.map((r) => ({ value: r, label: r }))}
          value={model_settings.seedance_resolution}
          onChange={(v) => setModelSetting('seedance_resolution', v)}
        />
      </Field>
      <Field label="Durée">
        <PillGroup<4 | 8 | 12>
          options={[{ value: 4, label: '4s' }, { value: 8, label: '8s' }, { value: 12, label: '12s' }]}
          value={model_settings.seedance_duration}
          onChange={(v) => setModelSetting('seedance_duration', v)}
        />
      </Field>
      <div className="flex items-center justify-between">
        <Label htmlFor="sd-audio" className="text-sm text-foreground">Audio actif</Label>
        <Switch
          id="sd-audio"
          checked={!!model_settings.seedance_audio_enabled}
          onCheckedChange={(c) => setModelSetting('seedance_audio_enabled', c)}
        />
      </div>
    </Section>
  );
};

const Seedance2Common = () => {
  const { model_settings, setModelSetting } = useKreatorStore();
  const durations = Array.from({ length: 12 }, (_, i) => i + 4); // 4..15
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FileDropUpload
          label="Première image (cadre de départ)"
          hint={IMAGE_HINT}
          value={model_settings.seedance2_first_frame_url}
          onChange={(url) => setModelSetting('seedance2_first_frame_url', url || undefined)}
          kind="image"
        />
        <FileDropUpload
          label="Dernière image (cadre de fin)"
          hint={IMAGE_HINT}
          value={model_settings.seedance2_last_frame_url}
          onChange={(url) => setModelSetting('seedance2_last_frame_url', url || undefined)}
          kind="image"
        />
      </div>

      <MultiFileUpload
        label="Images de référence"
        hint={IMAGE_HINT + ' (max 9 fichiers)'}
        values={model_settings.seedance2_reference_image_urls || []}
        onChange={(urls) => setModelSetting('seedance2_reference_image_urls', urls)}
        max={9}
        kind="image"
      />

      <MultiFileUpload
        label="Vidéos de référence"
        hint="Formats : MP4, MOV, WEBM. Max 3 vidéos. La durée totale ne doit pas dépasser 15 secondes."
        values={model_settings.seedance2_reference_video_urls || []}
        onChange={(urls) => setModelSetting('seedance2_reference_video_urls', urls)}
        max={3}
        kind="video"
      />

      <FileDropUpload
        label="Audio de référence (optionnel)"
        hint={AUDIO_HINT}
        value={model_settings.seedance2_reference_audio_url}
        onChange={(url) => setModelSetting('seedance2_reference_audio_url', url || undefined)}
        kind="audio"
      />

      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="sd2-audio" className="text-sm text-foreground">Générer un son</Label>
          <p className="text-xs text-muted-foreground">Faut-il générer un son IA synchronisé avec la vidéo ?</p>
        </div>
        <Switch
          id="sd2-audio"
          checked={!!model_settings.seedance2_generate_audio}
          onCheckedChange={(c) => setModelSetting('seedance2_generate_audio', c)}
        />
      </div>

      <Field label="Résolution" hint="Résolution vidéo de sortie">
        <PillGroup<SeedanceResolution>
          options={RES.map((r) => ({ value: r, label: r }))}
          value={model_settings.seedance2_resolution}
          onChange={(v) => setModelSetting('seedance2_resolution', v)}
        />
      </Field>
      <Field label="Format">
        <AspectCards options={ASPECTS} value={model_settings.seedance2_aspect} onChange={(v) => setModelSetting('seedance2_aspect', v)} />
      </Field>
      <Field label="Durée">
        <Select
          value={String(model_settings.seedance2_duration ?? '')}
          onValueChange={(v) => setModelSetting('seedance2_duration', Number(v))}
        >
          <SelectTrigger className="bg-card border-foreground/10 text-foreground"><SelectValue placeholder="Choisir une durée" /></SelectTrigger>
          <SelectContent className="bg-card border-foreground/10 max-h-64">
            {durations.map((d) => <SelectItem key={d} value={String(d)}>{d}s</SelectItem>)}
          </SelectContent>
        </Select>
      </Field>
    </>
  );
};

export const Seedance2 = () => {
  const { model_settings, setModelSetting } = useKreatorStore();
  const sub = model_settings.seedance2_sub_model || 'seedance-2';
  return (
    <Section>
      <Field label="Type de modèle" required>
        <SubModelTabs<Seedance2SubModel>
          options={[
            { value: 'seedance-2', label: 'Seedance 2' },
            { value: 'seedance-2-fast', label: 'Seedance 2 Fast' },
          ]}
          value={sub}
          onChange={(v) => setModelSetting('seedance2_sub_model', v)}
        />
      </Field>
      <Seedance2Common />
    </Section>
  );
};
