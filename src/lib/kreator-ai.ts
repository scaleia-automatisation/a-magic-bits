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
  objective: string,
  productService?: string
) {
  const systemPrompt = `Tu es un expert en marketing digital viral. Génère exactement 3 idées de contenu PERSUASIVES, IMPACTANTES, ENGAGEANTES qui suscitent immédiatement l'intérêt et le partage.

RÈGLE ABSOLUE — HOOK 0-2 SECONDES (NON NÉGOCIABLE) :
Chaque idée DOIT s'ouvrir sur un hook ULTRA PUISSANT et PERSUASIF capable de capter l'attention dans les 2 PREMIÈRES SECONDES, quel que soit le type de contenu (image, carrousel, vidéo).
Le hook doit être : émotionnel, intrigant, choquant ou provoquant une curiosité irrésistible (ex : "Personne ne te dit ça…", "Arrête tout de suite si tu fais ça", "J'ai perdu X à cause de ça", "90% se trompent ici", "Le secret que personne ne révèle…").
Aucune idée molle, descriptive ou générique n'est acceptée. Le scroll-stop est PRIORITAIRE sur tout. La description doit expliciter le hook d'ouverture.

Chaque idée doit avoir un angle viral fort (curiosité, émotion, controverse douce, transformation, preuve sociale, urgence) aligné sur l'objectif.
RETOURNE UNIQUEMENT un JSON valide sans markdown:
{"ideas":[{"id":1,"title":"hook punchy max 30 chars avec emoji","angle":"Éducatif|Storytelling|Engagement|Preuve sociale|Urgence|Curiosité","description":"max 80 chars — hook 0-2s + pourquoi ça scroll-stop"},{"id":2,...},{"id":3,...}]}`;

  const userPrompt = `=== CONTEXTE ENTREPRISE ===
${activity ? `Activité principale: ${activity}` : ''}
${sector ? `Secteur: ${sector}` : ''}
${productService ? `Produit ou service à mettre en avant: ${productService}` : ''}

=== CONTENU ===
Type de contenu: ${contentType}
${objective ? `Objectif du contenu (PRIORITAIRE): ${objective}` : ''}

Génère 3 idées virales, persuasives, impactantes et engageantes qui suscitent l'intérêt immédiat. Fusionne TOUS ces éléments dans chaque idée.`;

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
  productService?: string;
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
${params.productService ? `Produit ou service à mettre en avant: ${params.productService}` : ''}

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
  videoRenderStyle?: string;
}) {
  const formatLabel = params.format === '1:1' ? 'carré (1:1)' : params.format === '16:9' ? 'horizontal large (16:9)' : 'vertical plein écran (9:16)';
  
  const aiModelName = params.aiModel || 'dall-e-3';
  let formatAdaptation = '';
  if (['imagen-4', 'imagen-4-ultra', 'imagen-4-fast'].includes(aiModelName)) {
    formatAdaptation = `Modèle IA: ${aiModelName} — Préciser explicitement "aspect ratio ${params.format}" dans le prompt FR.`;
  } else if (aiModelName === 'dall-e-3') {
    const dalleFormat = params.format === '1:1' ? 'image carrée' : params.format === '16:9' ? 'cadre cinématographique large' : 'format vertical mobile';
    formatAdaptation = `Modèle IA: DALL·E 3 — Intégrer "${dalleFormat}" dans la description du prompt FR.`;
  } else if (['veo-2', 'veo-3', 'veo-3-fast'].includes(aiModelName)) {
    const veoFormat = params.format === '9:16' ? 'vidéo verticale 9:16' : params.format === '16:9' ? 'vidéo horizontale 16:9' : 'vidéo carrée 1:1';
    formatAdaptation = `Modèle IA: ${aiModelName} — Préciser "${veoFormat}" et optimiser le cadrage pour ce ratio.`;
  } else if (aiModelName === 'sora-2') {
    formatAdaptation = `Modèle IA: Sora 2 — Préciser "aspect ratio ${params.format}" et adapter le type de framing.`;
  } else if (['nano-banana-2', 'nano-banana-pro'].includes(aiModelName)) {
    const nanoFormat = params.format === '1:1' ? 'image carrée parfaite (1:1)' : params.format === '16:9' ? 'image horizontale large (16:9)' : 'image verticale plein écran mobile (9:16)';
    formatAdaptation = `Modèle IA: ${aiModelName === 'nano-banana-pro' ? 'Nano Banana Pro' : 'Nano Banana 2'} — OBLIGATION ABSOLUE : le visuel généré DOIT être au format ${params.format} (${nanoFormat}). Inclure IMPÉRATIVEMENT l'instruction "Generate this image in ${params.format} aspect ratio" dans le prompt anglais ET "Générer cette image au format ${params.format}" dans le prompt français. Le ratio ${params.format} doit être mentionné au DÉBUT et à la FIN du prompt pour forcer le modèle à le respecter.`;
  }

  const contentTypeAdaptation = params.contentType === 'video'
    ? `Pour la vidéo : TOUJOURS respecter le ratio ${params.format}, cadrage optimisé pour mobile si 9:16, sujet centré et lisible.`
    : params.contentType === 'carousel'
      ? `Pour le carrousel : adapter la composition au ratio (centrage, marges, lisibilité), cohérence visuelle parfaite entre slides, optimiser pour affichage plateforme.`
      : `Pour l'image : adapter la composition au ratio (centrage, marges, lisibilité), optimiser pour affichage plateforme.`;

  // Video-specific directives
  const videoDirectives = params.contentType === 'video' ? `

CONSIGNES VIDÉO OBLIGATOIRES :
🎬 Logique de création (niveau production) :
- Micro-vidéo ultra impactante (6–8 secondes)
- Émotion naturelle, réalisme élevé, rythme rapide, message clair + CTA
- 2 à 3 plans MAX (pas plus), chaque plan = 2–3 secondes
- 1 idée forte par vidéo
- Continuité visuelle parfaite (lumière, sujet, couleurs)
- Mouvement de caméra subtil mais professionnel

🎥 Structure du script (obligatoire) :
Plan 1 (Hook – 0-2s) : Attirer l'attention immédiatement, mouvement léger caméra, déclencheur émotionnel ou curiosité
Plan 2 (Value – 2-5s) : Montrer usage / bénéfice, interaction humaine ou contexte réel, montée émotionnelle
Plan 3 (Impact + CTA – 5-8s) : Image forte / résultat, texte court, call to action

🎧 Direction sonore :
- Bruitages réalistes (pas exagérés)
- Musique cohérente avec l'émotion (douce → lifestyle, épique → premium, rythmée → pub)
- Voix off optionnelle : naturelle, humaine, courte, max 1 phrase

🎥 Mouvements caméra pro :
- Travelling lent (cinéma), zoom léger (focus émotion), handheld subtil (UGC réaliste)
- Slow motion léger (premium), rack focus (focus dynamique)

✨ Effets visuels (réalisme avant tout) :
- Lumière naturelle cohérente, profondeur de champ, motion blur léger
- Reflets réalistes, aucun effet "fake IA"

🧠 Niveau expert :
- Micro-expressions humaines = + engagement
- Imperfections réalistes = + crédibilité
- Rythme rapide mais fluide = + rétention
- 1 message = + conversion

${params.videoRenderStyle ? `TYPE DE RENDU VIDÉO SÉLECTIONNÉ : "${params.videoRenderStyle}" — Adapter TOUTE la direction artistique, l'ambiance, le cadrage et le style de montage à ce rendu vidéo.` : ''}
` : '';

  // Determine the active render style
  const activeRenderStyle = params.contentType === 'video' ? params.videoRenderStyle : params.renderStyle;

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
3. OBJECTIF DU CONTENU (TRÈS IMPORTANT) : c'est le fil conducteur principal, tout le prompt doit servir cet objectif
4. TYPE DE RENDU${params.contentType === 'video' ? ' VIDÉO' : ''} : définit l'ambiance visuelle et le style de mise en scène du contenu. Adapter le prompt pour refléter fidèlement ce rendu
5. ANALYSE DES IMAGES DE RÉFÉRENCE (OBLIGATOIRE SI PRÉSENTES) : les images doivent TOUJOURS être analysées et intégrées de façon cohérente avec l'objectif et l'idée
6. IDÉE DÉCRITE ou IDÉE CHOISIE : le sujet central du visuel, à respecter fidèlement
7. RÉGLAGES AVANCÉS (ton, style visuel, texte overlay, palette) : appliquer systématiquement s'ils sont actifs

Tous ces éléments forment un CONTEXTE UNIFIÉ et COHÉRENT. Ne pas les traiter séparément mais les fusionner en un prompt fluide et naturel.

CONSIGNES OBLIGATOIRES pour le prompt généré :
- Ultra HD, photo hyper réaliste et professionnel, indistinguable d'une vraie photo prise par un photographe professionnel
- Rendu ULTRA RÉALISTE, on ne doit JAMAIS deviner que c'est une image générée par IA
- Grain de peau naturel, reflets naturels dans les yeux, imperfections subtiles, texture des matériaux authentique
- Éclairage naturel et cinématographique, ombres douces et réalistes
- Optimisé pour les réseaux sociaux (Instagram, TikTok, LinkedIn, Facebook)
- NE JAMAIS inclure de texte, lettres, mots ou typographie DANS l'image générée SAUF si l'utilisateur a explicitement demandé du texte overlay ou si l'image de base en contenait
- Si du texte overlay est demandé : typographie parfaitement lisible, stylisée et professionnelle
- Éviter absolument les éléments flous, déformés, artificiels ou « plastiques »
- Respecter les codes couleurs et le style de la marque si fournis
- Pour les carrousels : cohérence visuelle parfaite entre slides (même palette, même style, même ambiance, même éclairage). La PREMIÈRE slide DOIT être un hook visuel scroll-stop.
- Préciser l'éclairage, l'angle de caméra, la profondeur de champ, le bokeh et l'ambiance
- Le prompt doit être directement utilisable par un modèle de génération d'image IA

RÈGLE ABSOLUE — HOOK VISUEL 0-2 SECONDES (NON NÉGOCIABLE, TOUS TYPES DE CONTENU) :
Le visuel généré DOIT fonctionner comme un SCROLL-STOPPER capable de capter l'attention dans les 2 PREMIÈRES SECONDES. Quel que soit le type (image, carrousel, vidéo) :
- Composition à fort impact visuel immédiat (contraste élevé, sujet dominant, regard direct, expression émotionnelle marquée, geste ou action en cours)
- Élément intrigant, inattendu, émotionnel ou provocateur dès le premier coup d'œil
- Aucune image plate, descriptive ou neutre — TOUJOURS chercher la tension visuelle, l'émotion ou la curiosité
- Pour les vidéos : la frame d'ouverture (0-2s) DOIT être le hook le plus puissant de toute la séquence
- Pour les carrousels : la slide 1 DOIT contenir le hook visuel le plus fort
- Aligner le hook visuel avec l'objectif marketing (vente, notoriété, engagement…)
Cette règle est PRIORITAIRE et ne doit JAMAIS être ignorée.
${videoDirectives}
RETOURNE UNIQUEMENT un JSON valide sans markdown:
{"prompt_fr":"...","palette_used":["#HEX"],"marketing_angle":"..."}`;

  const userPrompt = `=== CONTEXTE ENTREPRISE ===
${params.companyActivity ? `Activité principale: ${params.companyActivity}` : 'Activité: non renseignée'}
${params.companySector ? `Secteur d'activité: ${params.companySector}` : 'Secteur: non renseigné'}

=== CONTENU ===
Type de contenu: ${params.contentType}
Format: ${params.format}
${params.objective ? `Objectif du contenu (PRIORITAIRE): ${params.objective}` : 'Objectif: non renseigné'}
${activeRenderStyle ? `Type de rendu${params.contentType === 'video' ? ' vidéo' : ''}: ${activeRenderStyle}` : 'Type de rendu: automatique'}

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

export interface PlatformCaptions {
  facebook: { hook: string; description: string; cta: string; hashtags: string };
  instagram: { hook: string; description: string; cta: string; hashtags: string };
  tiktok: { hook: string; description: string; cta: string; hashtags: string };
  linkedin: { hook: string; description: string; cta: string; hashtags: string };
}

export async function generateCaption(params: {
  objective: string;
  idea: string;
  contentType: string;
  sector: string;
  activity: string;
}): Promise<PlatformCaptions> {
  const isVideo = params.contentType === 'video';
  const isCarousel = params.contentType === 'carousel';
  const contentLabel = isVideo ? 'vidéo' : isCarousel ? 'carrousel' : 'image';

  const systemPrompt = `Tu es un expert mondial en copywriting marketing, psychologie de conversion et algorithmes des réseaux sociaux en 2026.

Génère 4 versions de caption optimisées pour chaque plateforme : Facebook, Instagram, TikTok et LinkedIn.
Le type de contenu est : ${contentLabel}.

CONSIGNES STRICTES PAR PLATEFORME ET PAR TYPE DE CONTENU :

📘 FACEBOOK :
${isVideo ? `🎥 Vidéo :
✅ Texte : 30 – 50 mots
Structure : Hook → Contexte rapide → CTA` : `🖼️ ${isCarousel ? 'Carrousel' : 'Image'} :
✅ Texte : 30 – 50 mots
Structure optimale :
🔥 Hook (1ère ligne) → 💡 Message court`}
Hook (puissant) : "Personne ne parle de ça…", "Erreur que 90% font…", "Tu fais ça aussi ?"
Description : Directe, simple, orientée problème, 1 idée principale. NE JAMAIS inclure le CTA dans la description.
Hashtags (SEO) : 3 à 5 max, liés au domaine / activité
CTA ciblé en lien avec le post (2–6 mots) : "Tu es d'accord ?", "Tu fais ça ?", "Ton avis ?"

📸 INSTAGRAM :
${isVideo ? `🎥 Reels :
✅ Texte : 30 – 50 mots
Structure : Hook court → description → CTA + hashtags` : `🖼️ ${isCarousel ? 'Carrousel' : 'Image'} :
✅ Texte : 30 – 50 mots
Structure : 🔥 Hook fort → Story / valeur → Hashtags`}
Hook (impact) : "J'aurais aimé savoir ça avant…", "Si tu fais ça, arrête…", "Voici pourquoi tu galères…"
Description : Storytelling + conseils, lisible (sauts de ligne). NE JAMAIS inclure le CTA dans la description.
Hashtags (SEO) : 5 à 10, niche + activité + problème
CTA (2–6 mots) : "Tu en penses quoi ?", "Tu veux la suite ?", "Tu testes quand ?"

🎵 TIKTOK :
🎥 ${isVideo ? 'Vidéo' : contentLabel} :
✅ Texte : 50 – 150 caractères
Structure : Hook direct → Description courte
Hook (ultra punchy) : "Arrête de faire ça", "Tu perds de l'argent ici", "Personne ne t'explique ça"
Description : Ultra courte, impact immédiat. NE JAMAIS inclure le CTA dans la description.
Hashtags (SEO + viral) : 3 à 6 : niche (#business) + viral (#fyp) + spécifique (#marketingdigital)
CTA (2–6 mots) : "Tu savais ça ?", "Tu valides ?", "Tu veux plus ?"

💼 LINKEDIN :
${isVideo ? `🎥 Vidéo :
✅ Texte : 50 – 70 mots
Structure : Hook → Explication claire → Conclusion → CTA` : `🖼️ ${isCarousel ? 'Carrousel' : 'Image'} :
✅ Texte : 50 – 70 mots
Structure : 🔥 Hook fort (ligne 1) → description forte`}
Hook (pro + impact) : "J'ai perdu X à cause de ça…", "Voici ce que j'ai compris…", "90% des gens font cette erreur…"
Description : Structurée, lisible (retours à la ligne), orientée valeur business. NE JAMAIS inclure le CTA dans la description.
Hashtags (SEO pro) : 7 à 10 mots : #startup #business #saas #marketing
CTA (2–6 mots) : "Tu es d'accord ?", "Ton expérience ?", "Tu fais pareil ?"

RÈGLES COMMUNES :
- RÈGLE ABSOLUE — HOOK 0-2 SECONDES : sur CHAQUE plateforme et pour CHAQUE type de contenu (image, carrousel, vidéo), le hook DOIT être ULTRA PERSUASIF, PUISSANT et capable de STOPPER LE SCROLL dans les 2 PREMIÈRES SECONDES. Aucune exception, jamais. Le hook doit déclencher curiosité, émotion forte, choc, surprise ou tension immédiate, et être directement aligné sur l'objectif du contenu. Pas de hook descriptif, mou ou générique — toujours du scroll-stop.
- Le CTA ne doit JAMAIS apparaître dans la description. Le CTA est un champ séparé.
- Hook : déclenche une émotion FORTE et COHÉRENTE avec le contenu et l'objectif
- Chaque plateforme a sa propre longueur et son propre style — RESPECTER STRICTEMENT les limites de mots/caractères ci-dessus
- Le contenu doit déclencher une émotion cohérente avec le média généré
- CTA : toujours en lien direct avec le post, TOUJOURS dans le champ "cta", JAMAIS dans "description"
- Hashtags : SEO optimisé, inclure secteur + activité

RETOURNE UNIQUEMENT un JSON valide sans markdown:
{"facebook":{"hook":"...","description":"...","cta":"...","hashtags":"..."},"instagram":{"hook":"...","description":"...","cta":"...","hashtags":"..."},"tiktok":{"hook":"...","description":"...","cta":"...","hashtags":"..."},"linkedin":{"hook":"...","description":"...","cta":"...","hashtags":"..."}}`;

  const userPrompt = `Objectif: ${params.objective || 'Engagement et visibilité'}
Idée: ${params.idea || 'Contenu marketing professionnel'}
Type de contenu: ${contentLabel}
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

export async function generateImage(
  promptEn: string,
  aiModel: AIModel = 'dall-e-3',
  format: string = '1:1',
  inputImageUrl?: string
) {
  const isKieImageModel = ['qwen/image-edit', 'ideogram/character', 'ideogram/image'].includes(aiModel);

  // === kie.ai image models — start + polling ===
  if (isKieImageModel) {
    const { data: startData, error: startError } = await supabase.functions.invoke('kreator-ai', {
      body: {
        action: 'kie_start_image',
        prompt: promptEn,
        ai_model: aiModel,
        size: format,
        input_image_url: inputImageUrl || '',
      },
    });
    if (startError) throw startError;
    if (startData?.error) throw new Error(startData.error);
    if (startData?.done && startData?.image_url) return startData.image_url;

    const taskId = startData?.task_id;
    if (!taskId) throw new Error('No task_id returned from kie.ai');

    const maxAttempts = 60;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, 4000));
      const { data: pollData, error: pollError } = await supabase.functions.invoke('kreator-ai', {
        body: { action: 'kie_poll_image', task_id: taskId },
      });
      if (pollError) { console.warn('kie.ai poll error', pollError); continue; }
      if (pollData?.error) throw new Error(pollData.error);
      if (pollData?.done && pollData?.image_url) return pollData.image_url;
    }
    throw new Error('La génération image kie.ai a pris trop de temps. Réessayez.');
  }

  // Map format to DALL-E size
  const dalleSize = format === '9:16' ? '1024x1792' : format === '16:9' ? '1792x1024' : '1024x1024';

  const { data, error } = await supabase.functions.invoke('kreator-ai', {
    body: {
      action: 'generate_image',
      prompt: promptEn,
      ai_model: aiModel,
      size: format,
      dalle_size: dalleSize,
      quality: 'hd',
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);

  const imageUrl = data?.image_url;
  if (!imageUrl) throw new Error('No image generated');

  return imageUrl;
}

export async function generateVideo(
  promptEn: string,
  aiModel: AIModel = 'veo-3',
  format: string = '9:16',
  onProgress?: (pct: number) => void,
  abortSignal?: AbortSignal
) {
  const isKieModel = [
    'veo-3', 'veo-3.1', 'kling-2.1', 'kling-2.5', 'kling-2.6', 'kling-3.0',
    'grok-imagine', 'bytedance/seedance-2-fast', 'bytedance/seedance-2',
    'hailuo/2-3-image-to-video-standard', 'hailuo/2-3-image-to-video-standard-pro',
  ].includes(aiModel);

  // === kie.ai models — start + polling ===
  if (isKieModel) {
    const { data: startData, error: startError } = await supabase.functions.invoke('kreator-ai', {
      body: { action: 'kie_start_video', prompt: promptEn, ai_model: aiModel, size: format },
    });
    if (startError) throw startError;
    if (startData?.error) throw new Error(startData.error);
    if (startData?.done && startData?.video_url) return startData.video_url;

    const taskId = startData?.task_id;
    if (!taskId) throw new Error('No task_id returned from kie.ai');

    const maxAttempts = 90;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (abortSignal?.aborted) throw new DOMException('Generation cancelled', 'AbortError');
      await new Promise((r) => setTimeout(r, 5000));
      if (abortSignal?.aborted) throw new DOMException('Generation cancelled', 'AbortError');
      if (onProgress) onProgress(10 + Math.min(85, (attempt / maxAttempts) * 85));

      const { data: pollData, error: pollError } = await supabase.functions.invoke('kreator-ai', {
        body: { action: 'kie_poll_video', task_id: taskId, ai_model: aiModel },
      });
      if (pollError) { console.warn('kie.ai poll error', pollError); continue; }
      if (pollData?.error) throw new Error(pollData.error);
      if (pollData?.done && pollData?.video_url) {
        if (onProgress) onProgress(100);
        return pollData.video_url;
      }
    }
    throw new Error('La génération vidéo kie.ai a pris trop de temps. Réessayez.');
  }

  throw new Error(`Modèle vidéo non supporté: ${aiModel}`);
}