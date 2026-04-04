import { supabase } from '@/integrations/supabase/client';

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
- Le visuel DOIT être en qualité ULTRA HD 8K, photoréaliste et professionnel, indistinguable d'une vraie photo prise par un photographe professionnel
- IMPÉRATIF : le rendu doit être ULTRA RÉALISTE, on ne doit JAMAIS pouvoir deviner que c'est une image générée par IA
- Préciser des détails réalistes : grain de peau naturel, reflets naturels dans les yeux, imperfections subtiles, texture des matériaux authentique
- Éclairage naturel et cinématographique, ombres douces et réalistes
- Optimisé pour les réseaux sociaux (Instagram, TikTok, LinkedIn, Facebook)
- NE JAMAIS inclure de texte, lettres, mots ou typographie DANS l'image générée SAUF si l'utilisateur a explicitement demandé du texte overlay
- Si du texte overlay est demandé : le rédiger comme le ferait un graphiste infographiste de renommée internationale expert en marketing et publicité, avec une typographie parfaitement lisible, stylisée et professionnelle
- Pour les vidéos : décrire le contenu comme le ferait un réalisateur expert de renommée internationale
- Éviter absolument les éléments flous, déformés, artificiels ou « plastiques »
- Respecter les codes couleurs et le style de la marque si fournis
- Pour les carrousels : chaque slide doit avoir une cohérence visuelle parfaite (même palette, même style, même ambiance, même éclairage)
- Préciser l'éclairage, l'angle de caméra, la profondeur de champ, le bokeh et l'ambiance
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
${params.showText ? `Texte overlay: "${params.textContent}" — Le texte doit être intégré dans l'image de manière professionnelle et esthétique, comme le ferait un graphiste expert.` : 'Pas de texte overlay — NE PAS générer de texte dans l\'image'}
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

export async function generateCaption(params: {
  objective: string;
  idea: string;
  contentType: string;
  sector: string;
  activity: string;
}) {
  const systemPrompt = `Tu es un expert en copywriting marketing et réseaux sociaux de renommée internationale.
Génère un caption complet pour un post sur les réseaux sociaux.

RÈGLES STRICTES :
- Hook : phrase d'accroche percutante, MAX 10 mots, en lien direct avec l'objectif
- Description : complémente le hook, MAX 15 mots, cohérent avec l'objectif et l'idée
- Appel à l'action : incitation claire, 2 à 5 mots MAX avec un émoji à la fin
- Hashtags : SEO optimisé, inclure le secteur, l'activité, le produit, 5 à 10 mots MAX

Tout doit être en cohérence avec l'objectif du contenu et l'idée choisie.

RETOURNE UNIQUEMENT un JSON valide sans markdown:
{"hook":"...","description":"...","cta":"...","hashtags":"..."}`;

  const userPrompt = `Objectif: ${params.objective || 'Engagement et visibilité'}
Idée: ${params.idea || 'Contenu marketing professionnel'}
Type de contenu: ${params.contentType}
${params.sector ? `Secteur: ${params.sector}` : ''}
${params.activity ? `Activité: ${params.activity}` : ''}`;

  const data = await callKreatorAI({
    action: 'generate_caption',
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

export async function generateImage(promptEn: string, _model?: string) {
  // Always use DALL-E 3 via OpenAI for image generation
  const { data, error } = await supabase.functions.invoke('kreator-ai', {
    body: {
      action: 'generate_image_dalle',
      prompt: promptEn,
      size: '1024x1024',
      quality: 'hd',
    },
  });

  if (error) throw error;

  const imageUrl = data?.data?.[0]?.url;
  if (!imageUrl) throw new Error('No image generated');

  return imageUrl;
}
