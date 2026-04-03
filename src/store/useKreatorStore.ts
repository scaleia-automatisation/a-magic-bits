import { create } from 'zustand';

export type ContentType = 'image' | 'carousel' | 'video';
export type Format = '9:16' | '16:9' | '1:1';
export type AIModel = 'dall-e-3' | 'nano-banana-2' | 'nano-banana-pro' | 'imagen' | 'sora-2' | 'veo-3' | 'veo-3-fast';
export type UserMode = 'beginner' | 'expert';
export type GenerationStatus = 'idle' | 'generating' | 'done' | 'error';

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
  // Mode
  user_mode: UserMode;
  setUserMode: (mode: UserMode) => void;

  // Step 1
  type: ContentType;
  setType: (type: ContentType) => void;
  slides_count: number;
  setSlidesCount: (count: number) => void;
  ai_model: AIModel;
  setAiModel: (model: AIModel) => void;
  objective: string;
  setObjective: (obj: string) => void;
  company_activity: string;
  setCompanyActivity: (val: string) => void;
  company_sector: string;
  setCompanySector: (val: string) => void;

  // Step 2
  format: Format;
  setFormat: (format: Format) => void;

  // Step 3
  input_image_url: string;
  setInputImageUrl: (url: string) => void;
  input_image_description: string;
  setInputImageDescription: (desc: string) => void;
  input_text: string;
  setInputText: (text: string) => void;
  idea_chosen: string;
  setIdeaChosen: (idea: string) => void;

  // Step 4
  options: KreatorOptions;
  setOptions: (opts: Partial<KreatorOptions>) => void;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;

  // Step 5
  prompt_fr: string;
  setPromptFr: (p: string) => void;
  prompt_en: string;
  setPromptEn: (p: string) => void;
  prompt_en_final: string;
  setPromptEnFinal: (p: string) => void;

  // Step 6
  status: GenerationStatus;
  setStatus: (s: GenerationStatus) => void;
  result_url: string;
  setResultUrl: (url: string) => void;
  result_urls: string[];
  setResultUrls: (urls: string[]) => void;
  credits_used: number;
  setCreditsUsed: (c: number) => void;
}

export const useKreatorStore = create<KreatorState>((set) => ({
  user_mode: 'beginner',
  setUserMode: (mode) => set({ user_mode: mode }),

  type: 'image',
  setType: (type) => {
    const defaultModel = type === 'video' ? 'sora-2' : 'dall-e-3';
    const format = type === 'video' ? '9:16' as Format : '9:16' as Format;
    set({ type, ai_model: defaultModel, format });
  },
  slides_count: 2,
  setSlidesCount: (count) => set({ slides_count: count }),
  ai_model: 'dall-e-3',
  setAiModel: (model) => set({ ai_model: model }),
  objective: '',
  setObjective: (obj) => set({ objective: obj }),
  company_activity: '',
  setCompanyActivity: (val) => set({ company_activity: val }),
  company_sector: '',
  setCompanySector: (val) => set({ company_sector: val }),

  format: '9:16',
  setFormat: (format) => set({ format }),

  input_image_url: '',
  setInputImageUrl: (url) => set({ input_image_url: url }),
  input_image_description: '',
  setInputImageDescription: (desc) => set({ input_image_description: desc }),
  input_text: '',
  setInputText: (text) => set({ input_text: text }),
  idea_chosen: '',
  setIdeaChosen: (idea) => set({ idea_chosen: idea }),

  options: {
    show_text: false,
    text_content: '',
    palette_enabled: false,
    palette_hex: ['#FF2D73', '#FF6A3D', '#000000'],
    ton: '',
    objective: '',
    visual_style: '',
  },
  setOptions: (opts) => set((state) => ({ options: { ...state.options, ...opts } })),
  showAdvanced: false,
  setShowAdvanced: (show) => set({ showAdvanced: show }),

  prompt_fr: '',
  setPromptFr: (p) => set({ prompt_fr: p }),
  prompt_en: '',
  setPromptEn: (p) => set({ prompt_en: p }),
  prompt_en_final: '',
  setPromptEnFinal: (p) => set({ prompt_en_final: p }),

  status: 'idle',
  setStatus: (s) => set({ status: s }),
  result_url: '',
  setResultUrl: (url) => set({ result_url: url }),
  result_urls: [],
  setResultUrls: (urls) => set({ result_urls: urls }),
  credits_used: 0,
  setCreditsUsed: (c) => set({ credits_used: c }),
}));
