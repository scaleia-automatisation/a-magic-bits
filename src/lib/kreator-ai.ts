import { supabase } from '@/integrations/supabase/client';
import type { AIModel } from '@/store/useKreatorStore';

interface AICallOptions {
  action: string;
  messages: { role: string; content: string }[];
  system_prompt?: string;
  model?: string;
  image_base64s?: string[];
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

export async function generateIdeaFromImages(params: {
  imageDescriptions: string[];
  imageBase64s: string[];
  contentType: string;
  objective: string;
  format: string;
  activity: string;
  sector: string;
  ton?: string;
  visualStyle?: string;
}) {
  const imageCount = params.imageBase64s.length;
  const systemPrompt = `Tu es un expert en marketing digital et création de contenu visuel.
Analyse visuellement les ${imageCount} image(s) de référence fournies et génère UNE idée de contenu unique, créative et engageante.

RÈGLES OBLIGATOIRES — L'idée générée DOIT prendre en compte et fusionner de façon cohérente :
1. L'ANALYSE VISUELLE DES IMAGES DE RÉFÉRENCE : éléments visuels, ambiance, couleurs, objets, personnes, contexte — ANALYSE les images directement
2. L'OBJECTIF DU CONTENU (PRIORITAIRE) : l'idée doit directement servir cet objectif (vendre, engager, éduquer, inspirer…)
3. L'ACTIVITÉ PRINCIPALE de l'entreprise : adapter l'idée au métier et au contexte professionnel
4. LE SECTEUR D'ACTIVITÉ : utiliser les codes et le vocabulaire du secteur
5. Le TYPE et FORMAT de contenu : adapter l'idée au support (image, carrousel, vidéo)
6. Le TON et STYLE VISUEL si renseignés

Tous ces éléments forment un CONTEXTE UNIFIÉ. L'idée doit être pertinente et actionnable pour l'entreprise.

RETOURNE UNIQUEMENT un JSON valide sans markdown:
{"idea":{"title":"max 30 chars avec emoji","angle":"Éducatif|Storytelling|Engagement|Preuve sociale|Urgence","description":"max 80 chars décrivant l'idée en détail"}}`;

  const contextText = `=== CONTEXTE ENTREPRISE ===
${params.activity ? `Activité principale: ${params.activity}` : 'Activité: non renseignée'}
${params.sector ? `Secteur d'activité: ${params.sector}` : 'Secteur: non renseigné'}

=== CONTENU ===
Type de contenu: ${params.contentType}
Format: ${params.format}
${params.objective ? `Objectif du contenu (PRIORITAIRE): ${params.objective}` : 'Objectif: non renseigné'}
${params.ton ? `Ton: ${params.ton}` : ''}
${params.visualStyle ? `Style visuel: ${params.visualStyle}` : ''}
${params.imageDescriptions.some(d => d) ? `\n=== DESCRIPTIONS FOURNIES ===\n${params.imageDescriptions.map((d, i) => d ? `Image ${i + 1}: ${d}` : '').filter(Boolean).join('\n')}` : ''}

Analyse visuellement les images de référence et génère une idée originale cohérente avec le contexte.`;

  const data = await callKreatorAI({
    action: 'generate_idea_from_images',
    image_base64s: params.imageBase64s,
    messages: [{ role: 'user', content: contextText }],
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
  referenceImageCount?: number;
  aiModel?: string;
  renderStyle?: string;
}) {
  const formatLabel = params.format === '1:1' ? 'carré (1:1)' : params.format === '16:9' ? 'horizontal large (16:9)' : 'vertical plein écran (9:16)';
  
  const aiModelName = params.aiModel || 'dall-e-3';
  let formatAdaptation = '';
  if (['imagen-4', 'imagen-4-ultra', 'imagen-4-fast'].includes(aiModelName)) {
    formatAdaptation = `Modèle IA: ${aiModelName} — Préciser explicitement "aspect ratio ${params.format}" dans le prompt FR.`;
  } else if (aiModelName === 'dall-e-3') {
    const dalleFormat = params.format === '1:1' ? 'image carrée' : params.format === '16:9' ? 'cadre cinématographique large' : 'format vertical mobile';
    formatAdaptation = `Modèle IA: DALL·E 3 — Intégrer "${dalleFormat}" dans la description du prompt FR.`;
  } else if (['veo-2', 'veo-3', 'veo-3-fast', 'veo-3.1', 'veo-3.1-fast'].includes(aiModelName)) {
    const veoFormat = params.format === '9:16' ? 'vidéo verticale 9:16' : params.format === '16:9' ? 'vidéo horizontale 16:9' : 'vidéo carrée 1:1';
    formatAdaptation = `Modèle IA: ${aiModelName} — Préciser "${veoFormat}" et optimiser le cadrage pour ce ratio.`;
  } else if (aiModelName === 'sora-2') {
    formatAdaptation = `Modèle IA: Sora 2 — Préciser "aspect ratio ${params.format}" et adapter le type de framing.`;
  }

  const contentTypeAdaptation = params.contentType === 'video'
    ? `Pour la vidéo : TOUJOURS respecter le ratio ${params.format}, cadrage optimisé pour mobile si 9:16, sujet centré et lisible.`
    : params.contentType === 'carousel'
      ? `Pour le carrousel : adapter la composition au ratio (centrage, marges, lisibilité), cohérence visuelle parfaite entre slides, optimiser pour affichage plateforme.`
      : `Pour l'image : adapter la composition au ratio (centrage, marges, lisibilité), optimiser pour affichage plateforme.`;

  const systemPrompt = `Tu es un expert en création de prompts pour la génération d'images et vidéos par IA.

Génère un prompt FR de 300 à 350 mots.

RÈGLE ABSOLUE — FORMAT / RATIO :
Tu DOIS STRICTEMENT respecter le format ${params.format} (${formatLabel}).
- Si FORMAT = "1:1" → visuel carré parfaitement centré
- Si FORMAT = "16:9" → visuel horizontal large
- Si FORMAT = "9:16" → visuel vertical plein écran, optimisé mobile

Le ratio ${params.format} est PRIORITAIRE sur tout le reste. Aucune génération ne doit ignorer ce paramètre.
Adapter la composition, le cadrage et le framing à ce ratio. Éviter tout élément coupé ou hors zone visible.
${contentTypeAdaptation}
${formatAdaptation}
Préciser explicitement "aspect ratio ${params.format}" dans le prompt français généré pour que l'image ou visuel produit respecte systématiquement le ratio.

RÈGLES PLATEFORMES :
- TikTok : images et carrousels → FORMAT = "9:16", vidéos → FORMAT = "16:9"
- Instagram : posts images et carrousels → FORMAT = "1:1", stories → FORMAT = "1:1", vidéos → FORMAT = "9:16"

CONTEXTE COMMUN OBLIGATOIRE — Tu DOIS intégrer TOUTES les informations suivantes dans le prompt généré si elles sont fournies :
1. ACTIVITÉ DE L'ENTREPRISE et SECTEUR D'ACTIVITÉ : adapter le vocabulaire, l'ambiance, les décors et les éléments visuels au domaine métier
2. TYPE DE CONTENU : adapter le format et la structure du prompt (image, carrousel, vidéo)
3. OBJECTIF DU CONTENU (TRÈS IMPORTANT) : c'est le fil conducteur principal, tout le prompt doit servir cet objectif (vendre, engager, éduquer, inspirer…)
4. ANALYSE DES IMAGES DE RÉFÉRENCE (OBLIGATOIRE SI PRÉSENTES) : les images doivent TOUJOURS être analysées et intégrées de façon cohérente avec l'objectif et l'idée. Elles définissent l'univers visuel, l'ambiance, les couleurs et les éléments clés du contenu à générer
5. IDÉE DÉCRITE ou IDÉE CHOISIE : le sujet central du visuel, à respecter fidèlement. Les images de référence viennent enrichir et illustrer cette idée
6. RÉGLAGES AVANCÉS (ton, style visuel, texte overlay, palette) : appliquer systématiquement s'ils sont actifs

Tous ces éléments forment un CONTEXTE UNIFIÉ et COHÉRENT. Ne pas les traiter séparément mais les fusionner en un prompt fluide et naturel.

CONSIGNES OBLIGATOIRES pour le prompt généré :
- Ultra HD, photo hyper réaliste et professionnel, indistinguable d'une vraie photo prise par un photographe professionnel
- Rendu ULTRA RÉALISTE, on ne doit JAMAIS deviner que c'est une image générée par IA
- Grain de peau naturel, reflets naturels dans les yeux, imperfections subtiles, texture des matériaux authentique
- Éclairage naturel et cinématographique, ombres douces et réalistes
- Optimisé pour les réseaux sociaux (Instagram, TikTok, LinkedIn, Facebook)
- NE JAMAIS inclure de texte, lettres, mots ou typographie DANS l'image générée SAUF si l'utilisateur a explicitement demandé du texte overlay ou si l'image de base en contenait
- Si du texte overlay est demandé : typographie parfaitement lisible, stylisée et professionnelle
- Pour les vidéos : décrire le contenu comme le ferait un réalisateur expert de renommée internationale
- Éviter absolument les éléments flous, déformés, artificiels ou « plastiques »
- Respecter les codes couleurs et le style de la marque si fournis
- Pour les carrousels : cohérence visuelle parfaite entre slides (même palette, même style, même ambiance, même éclairage)
- Préciser l'éclairage, l'angle de caméra, la profondeur de champ, le bokeh et l'ambiance
- Le prompt doit être directement utilisable par un modèle de génération d'image IA

RETOURNE UNIQUEMENT un JSON valide sans markdown:
{"prompt_fr":"...","prompt_en":"... (traduction anglaise fidèle du prompt FR, optimisée pour le modèle IA)","palette_used":["#HEX"],"marketing_angle":"..."}`;

  const userPrompt = `=== CONTEXTE ENTREPRISE ===
${params.companyActivity ? `Activité principale: ${params.companyActivity}` : 'Activité: non renseignée'}
${params.companySector ? `Secteur d'activité: ${params.companySector}` : 'Secteur: non renseigné'}

=== CONTENU ===
Type de contenu: ${params.contentType}
Format: ${params.format}
${params.objective ? `Objectif du contenu (PRIORITAIRE): ${params.objective}` : 'Objectif: non renseigné'}

=== IDÉE ===
${params.inputText ? `Idée décrite: "${params.inputText}"` : ''}
${params.ideaChosen ? `Idée choisie: "${params.ideaChosen}"` : ''}
${!params.inputText && !params.ideaChosen ? 'Aucune idée spécifique — proposer un concept cohérent avec le contexte' : ''}

=== IMAGES DE RÉFÉRENCE ===
${params.imageDescription ? `Analyse (${params.referenceImageCount || 1} image(s)): ${params.imageDescription}` : 'Aucune image de référence'}
${params.referenceImageCount && params.referenceImageCount > 1 ? `IMPORTANT: ${params.referenceImageCount} images fournies — analyser et fusionner les éléments visuels communs pour un rendu cohérent et harmonieux.` : ''}

=== RÉGLAGES AVANCÉS ===
${params.ton ? `Ton: ${params.ton}` : 'Ton: automatique'}
${params.visualStyle ? `Style visuel: ${params.visualStyle}` : 'Style: automatique'}
${params.showText ? `Texte overlay: "${params.textContent}" — Intégrer professionnellement dans le visuel` : 'Pas de texte overlay — NE PAS générer de texte dans l\'image'}
${params.paletteEnabled ? `Palette de couleurs active: ${params.paletteHex.join(', ')} — utiliser entre 30% et 50% dans le visuel` : 'Palette automatique'}

Génère un prompt unifié et cohérent intégrant TOUS ces éléments.`;

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

export async function generateImage(promptEn: string, aiModel: AIModel = 'dall-e-3') {
  const { data, error } = await supabase.functions.invoke('kreator-ai', {
    body: {
      action: 'generate_image',
      prompt: promptEn,
      ai_model: aiModel,
      size: '1024x1024',
      quality: 'hd',
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);

  const imageUrl = data?.image_url;
  if (!imageUrl) throw new Error('No image generated');

  return imageUrl;
}

export async function generateVideo(promptEn: string, aiModel: AIModel = 'sora-2', format: string = '9:16') {
  const { data, error } = await supabase.functions.invoke('kreator-ai', {
    body: {
      action: 'generate_video',
      prompt: promptEn,
      ai_model: aiModel,
      size: format,
    },
  });

  if (error) throw error;

  const videoUrl = data?.video_url;
  if (!videoUrl) throw new Error('No video generated');

  return videoUrl;
}
