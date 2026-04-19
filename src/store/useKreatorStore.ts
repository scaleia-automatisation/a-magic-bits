import { create } from 'zustand';

export type ContentType = 'image' | 'carousel' | 'video';
export type Format = '9:16' | '16:9' | '1:1';
export type AIModel =
  | 'dall-e-3' | 'imagen-4' | 'imagen-4-ultra' | 'imagen-4-fast' | 'nano-banana-2' | 'nano-banana-pro'
  | 'qwen/image-edit' | 'ideogram/character' | 'ideogram/image'
  | 'sora-2-t2v' | 'sora-2-i2v' | 'sora-2-pro-i2v' | 'sora-2-pro-t2v' | 'sora-2-pro-character'
  | 'veo-3' | 'veo-3.1'
  | 'grok-imagine-i2v' | 'grok-imagine-t2v'
  | 'bytedance/seedance-1.5-pro' | 'bytedance/seedance-2'
  | 'kling-2.1' | 'kling-2.5' | 'kling-2.6' | 'kling-3.0';
export type VideoResolution = '720p' | '1080p';
export type UserMode = 'beginner' | 'expert';
export type GenerationStatus = 'idle' | 'generating' | 'done' | 'error';
export type SoraCharacterScene = { duration: number };

// Réglages spécifiques par modèle vidéo (flexible, par clé de modèle)
export type SoraAspect = 'portrait' | 'paysage';
export type SoraDuration = 10 | 15;
export type SoraProSize = 'standard' | 'high';
export type VeoSubMode = 't2v' | 'i2v' | 'reference';
export type VeoSubModel = 'veo-3.1-lite' | 'veo-3.1-fast' | 'veo-3.1-quality';
export type VeoAspect = '16:9' | '9:16';
export type VeoResolution = '720p' | '1080p' | '4K';

export interface ModelSettings {
  // Sora 2 / Sora 2 Pro
  sora_aspect_ratio?: SoraAspect;
  sora_n_frames?: SoraDuration;
  sora_remove_watermark?: boolean;
  sora_image_url?: string;
  sora_pro_size?: SoraProSize;
  // Veo 3 / 3.1
  veo_sub_mode?: VeoSubMode;
  veo_sub_model?: VeoSubModel;
  veo_aspect?: VeoAspect;
  veo_resolution?: VeoResolution;
  veo_start_image_url?: string;
  veo_end_image_url?: string;
  veo_reference_image_urls?: string[];
}

interface KreatorOptions {
  show_text: boolean;
  text_content: string;
  palette_enabled: boolean;
  palette_hex: string[];
  ton: string;
  objective: string;
  visual_style: string;
}

interface KreatorState {
  user_mode: UserMode;
  setUserMode: (mode: UserMode) => void;

  type: ContentType;
  setType: (type: ContentType) => void;
  slides_count: number;
  setSlidesCount: (count: number) => void;
  ai_model: AIModel;
  setAiModel: (model: AIModel) => void;
  objective: string;
  setObjective: (obj: string) => void;
  render_style: string;
  setRenderStyle: (val: string) => void;
  video_render_style: string;
  setVideoRenderStyle: (val: string) => void;
  video_resolution: VideoResolution;
  setVideoResolution: (val: VideoResolution) => void;
  sora_character_total_duration: 10 | 15 | 25;
  setSoraCharacterTotalDuration: (val: 10 | 15 | 25) => void;
  sora_character_scenes: SoraCharacterScene[];
  setSoraCharacterScenes: (scenes: SoraCharacterScene[]) => void;
  model_settings: ModelSettings;
  setModelSetting: <K extends keyof ModelSettings>(key: K, value: ModelSettings[K]) => void;
  resetModelSettings: () => void;
  company_activity: string;
  setCompanyActivity: (val: string) => void;
  company_sector: string;
  setCompanySector: (val: string) => void;
  product_service: string;
  setProductService: (val: string) => void;
  market: string;
  setMarket: (val: string) => void;

  format: Format;
  setFormat: (format: Format) => void;

  input_image_url: string;
  setInputImageUrl: (url: string) => void;
  input_image_description: string;
  setInputImageDescription: (desc: string) => void;
  input_photos: { url: string; description: string }[];
  setInputPhotos: (photos: { url: string; description: string }[]) => void;
  input_text: string;
  setInputText: (text: string) => void;
  idea_chosen: string;
  setIdeaChosen: (idea: string) => void;

  options: KreatorOptions;
  setOptions: (opts: Partial<KreatorOptions>) => void;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;

  prompt_fr: string;
  setPromptFr: (p: string) => void;
  prompt_en: string;
  setPromptEn: (p: string) => void;
  prompt_en_final: string;
  setPromptEnFinal: (p: string) => void;

  status: GenerationStatus;
  setStatus: (s: GenerationStatus) => void;
  result_url: string;
  setResultUrl: (url: string) => void;
  result_urls: string[];
  setResultUrls: (urls: string[]) => void;
  credits_used: number;
  setCreditsUsed: (c: number) => void;

  resetProject: () => void;
}

const initialState = {
  user_mode: 'beginner' as UserMode,
  type: 'image' as ContentType,
  slides_count: 2,
  ai_model: 'nano-banana-2' as AIModel,
  objective: '',
  render_style: '',
  company_activity: '',
  company_sector: '',
  product_service: '',
  market: '',
  video_render_style: '',
  video_resolution: '1080p' as VideoResolution,
  sora_character_total_duration: 10 as 10 | 15 | 25,
  sora_character_scenes: [{ duration: 10 }] as SoraCharacterScene[],
  model_settings: {} as ModelSettings,
  format: '9:16' as Format,
  input_image_url: '',
  input_image_description: '',
  input_photos: [] as { url: string; description: string }[],
  input_text: '',
  idea_chosen: '',
  options: {
    show_text: false,
    text_content: '',
    palette_enabled: false,
    palette_hex: ['#FF2D73', '#FF6A3D', '#000000'],
    ton: '',
    objective: '',
    visual_style: '',
  },
  showAdvanced: false,
  prompt_fr: '',
  prompt_en: '',
  prompt_en_final: '',
  status: 'idle' as GenerationStatus,
  result_url: '',
  result_urls: [],
  credits_used: 0,
};

export const useKreatorStore = create<KreatorState>((set) => ({
  ...initialState,
  setUserMode: (mode) => set({ user_mode: mode }),
  setType: (type) => {
    const defaultModel = type === 'video' ? 'veo-3' as AIModel : 'nano-banana-2' as AIModel;
    const format = type === 'video' ? '9:16' as Format : '9:16' as Format;
    set({ type, ai_model: defaultModel, format });
  },
  setSlidesCount: (count) => set({ slides_count: count }),
  setAiModel: (model) => set({ ai_model: model }),
  setObjective: (obj) => set({ objective: obj }),
  setRenderStyle: (val) => set({ render_style: val }),
  setVideoRenderStyle: (val) => set({ video_render_style: val }),
  setVideoResolution: (val) => set({ video_resolution: val }),
  setSoraCharacterTotalDuration: (val) => set({ sora_character_total_duration: val }),
  setSoraCharacterScenes: (scenes) => set({ sora_character_scenes: scenes }),
  setCompanyActivity: (val) => set({ company_activity: val }),
  setCompanySector: (val) => set({ company_sector: val }),
  setProductService: (val) => set({ product_service: val }),
  setMarket: (val) => set({ market: val }),
  setFormat: (format) => set({ format }),
  setInputImageUrl: (url) => set({ input_image_url: url }),
  setInputImageDescription: (desc) => set({ input_image_description: desc }),
  setInputPhotos: (photos) => set({ input_photos: photos }),
  setInputText: (text) => set({ input_text: text }),
  setIdeaChosen: (idea) => set({ idea_chosen: idea }),
  setOptions: (opts) => set((state) => ({ options: { ...state.options, ...opts } })),
  setShowAdvanced: (show) => set({ showAdvanced: show }),
  setPromptFr: (p) => set({ prompt_fr: p }),
  setPromptEn: (p) => set({ prompt_en: p }),
  setPromptEnFinal: (p) => set({ prompt_en_final: p }),
  setStatus: (s) => set({ status: s }),
  setResultUrl: (url) => set({ result_url: url }),
  setResultUrls: (urls) => set({ result_urls: urls }),
  setCreditsUsed: (c) => set({ credits_used: c }),
  resetProject: () => set({ ...initialState }),
}));
