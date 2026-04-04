import { supabase } from '@/integrations/supabase/client';

const AI_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kreator-ai`;

interface AICallOptions {
  action: string;
  messages: { role: string; content: string }[];
  system_prompt?: string;
  model?: string;
}

export async function callKreatorAI(options: AICallOptions) {
  const { data, error } = await supabase.functions.invoke('kreator-ai', {
    body: options,
  });

  if (error) throw error;
  return data;
}

export async function generateIdeas(
  activity: string,
  sector: string,
  contentType: string,
  objective: string
) {
  const systemPrompt = `Tu es un expert en marketing digital. Génère exactement 3 idées de contenu.
RETOURNE UNIQUEMENT un JSON valide sans markdown:
{"ideas":[{"id":1,"title":"max 20 chars","angle":"Éducatif|Storytelling|Engagement|Preuve sociale|Urgence","description":"max 50 chars"},{"id":2,...},{"id":3,...}]}`;

  const userPrompt = `Activité: ${activity}
${sector ? `Secteur: ${sector}` : ''}
Type: ${contentType}
${objective ? `Objectif: ${objective}` : ''}
Génère 3 idées originales et engageantes.`;

  const data = await callKreatorAI({
    action: 'generate_ideas',
    messages: [{ role: 'user', content: userPrompt }],
    system_prompt: systemPrompt,
  });

  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  try {
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse AI response');
  }
}

export async function generatePrompt(params: {
  contentType: string;
  format: string;
  objective: string;
  ton: string;
  visualStyle: string;
  inputText: string;
  ideaChosen: string;
  companyActivity: string;
  companySector: string;
  showText: boolean;
  textContent: string;
  paletteEnabled: boolean;
  paletteHex: string[];
  imageDescription: string;
}) {
  const systemPrompt = `Tu es un expert en création de prompts pour la génération d'images et vidéos par IA.
Génère un prompt FR et EN de 300 à 350 mots chacun.

CONSIGNES OBLIGATOIRES pour les prompts générés :
- Le visuel doit être en qualité ULTRA HD, photoréaliste et professionnel
- Optimisé pour les réseaux sociaux (Instagram, TikTok, LinkedIn, Facebook)
- NE JAMAIS inclure de texte, lettres, mots ou typographie DANS l'image générée (sauf si l'utilisateur a explicitement demandé du texte overlay)
- Éviter les éléments flous, déformés ou artificiels
- Respecter les codes couleurs et le style de la marque si fournis
- Pour les carrousels : chaque slide doit avoir une cohérence visuelle (même palette, même style, même ambiance)
- Préciser l'éclairage, l'angle de caméra, la profondeur de champ et l'ambiance
- Le prompt doit être directement utilisable par un modèle de génération d'image IA

RETOURNE UNIQUEMENT un JSON valide sans markdown:
{"prompt_fr":"...","prompt_en":"...","palette_used":["#HEX"],"marketing_angle":"..."}`;

  const userPrompt = `Type: ${params.contentType}
Format: ${params.format}
${params.objective ? `Objectif: ${params.objective}` : ''}
${params.ton ? `Ton: ${params.ton}` : ''}
${params.visualStyle ? `Style: ${params.visualStyle}` : ''}
${params.inputText ? `Idée: "${params.inputText}"` : ''}
${params.ideaChosen ? `Idée choisie: "${params.ideaChosen}"` : ''}
${params.companyActivity ? `Activité: ${params.companyActivity}` : ''}
${params.companySector ? `Secteur: ${params.companySector}` : ''}
${params.showText ? `Texte overlay: "${params.textContent}"` : 'Pas de texte overlay'}
${params.paletteEnabled ? `Palette: ${params.paletteHex.join(', ')}` : 'Palette automatique'}
${params.imageDescription ? `Description image: ${params.imageDescription}` : ''}`;

  const data = await callKreatorAI({
    action: 'generate_prompt',
    messages: [{ role: 'user', content: userPrompt }],
    system_prompt: systemPrompt,
  });

  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('No response from AI');

  try {
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse AI response');
  }
}

export async function generateImage(promptEn: string, model?: string) {
  const aiModel = model || 'google/gemini-3.1-flash-image-preview';
  
  const data = await callKreatorAI({
    action: 'generate_image',
    messages: [{ role: 'user', content: promptEn }],
    model: aiModel,
  });

  const imageUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (!imageUrl) throw new Error('No image generated');

  return imageUrl;
}
