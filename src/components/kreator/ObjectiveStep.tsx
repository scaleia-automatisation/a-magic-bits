import { useKreatorStore } from '@/store/useKreatorStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StepContainer from './StepContainer';
import { useEffect, useMemo } from 'react';
import type { ContentType } from '@/store/useKreatorStore';

const OBJECTIVES = [
  '🛒 Vendre un produit / service',
  '🎯 Générer des leads / prospects',
  '📣 Faire connaître la marque (notoriété)',
  '❤️ Engager la communauté',
  '🔁 Fidéliser les clients existants',
  '🚀 Lancer un nouveau produit',
  '📚 Éduquer / informer l\'audience',
  '⭐ Renforcer l\'image de marque',
];

// ─────────────────────────────────────────────────────────────────────────────
// Angles marketing et styles visuels personnalisés par SECTEUR et adaptés au
// TYPE DE CONTENU (image / carrousel / vidéo). Pensés pour générer des
// contenus business‑oriented, premium, ultraréalistes et indétectables IA.
// ─────────────────────────────────────────────────────────────────────────────

type AnglesAndStyles = {
  angles: string[];
  styles: { image: string[]; carousel: string[]; video: string[] };
};

const COMMON_ANGLES = [
  '🔥 Urgence / rareté (boost conversion)',
  '🤝 Preuve sociale / témoignages clients',
  '✨ Transformation avant / après',
  '💰 Offre irrésistible / ROI prouvé',
  '🧠 Expertise & autorité métier',
  '🎁 Exclusivité / nouveauté premium',
];

const SECTOR_PRESETS: Record<string, AnglesAndStyles> = {
  '🛍️ E-commerce / Retail (DTC, marketplaces)': {
    angles: [
      '🛒 Démonstration produit "scroll-stop"',
      '⭐ Avis clients 5★ / unboxing viral',
      '📦 Livraison rapide & satisfait ou remboursé',
      '💸 Promo limitée / ventes flash',
      '🆚 Comparatif vs concurrent',
      ...COMMON_ANGLES,
    ],
    styles: {
      image: ['🖼️ Packshot studio premium fond neutre', '☀️ Flat lay lumière naturelle douce', '🏠 Mise en situation lifestyle réaliste', '✨ Macro produit ultra-détaillée'],
      carousel: ['📊 Avant / après produit', '🔢 Top features numérotées', '🆚 Comparatif visuel structuré', '📖 Storytelling produit en 3-5 slides'],
      video: ['📱 UGC main-tenue iPhone naturel', '🎬 Démo produit cinématographique', '📦 Unboxing ASMR satisfaisant', '⚡ Hook 2s + bénéfice + CTA'],
    },
  },
  '🧃 Produits grande consommation (cosmétiques, food, boissons)': {
    angles: ['😋 Sensation / plaisir immédiat', '🌿 Naturel / clean ingredients', '👨‍👩‍👧 Moment partagé en famille', '🏆 Best-seller validé', ...COMMON_ANGLES],
    styles: {
      image: ['📷 Macro food/produit ultra-appétissant', '☀️ Lumière naturelle matinale', '🌿 Flat lay ingrédients bruts', '🎨 Pop coloré packaging hero'],
      carousel: ['🍳 Recette / routine en 3 étapes', '🌿 Ingrédients & bénéfices', '⭐ Avis consommateurs', '📖 Histoire de la marque'],
      video: ['💧 ASMR pour / verser / craquer', '🎬 Pack-shot rotatif premium', '📱 UGC dégustation authentique', '⚡ Stop-motion pop & fun'],
    },
  },
  '👗 Mode / Fashion / Luxe': {
    angles: ['👑 Statut / prestige', '✨ Pièce iconique / it-piece', '🆕 Drop / collection capsule', '🪞 Style transformation', ...COMMON_ANGLES],
    styles: {
      image: ['🏛️ Editorial luxe magazine', '🌆 Street style urbain', '🖼️ Studio fond neutre fashion', '🌸 Romantique lumière dorée'],
      carousel: ['👗 Lookbook 3-5 tenues', '🆚 1 pièce 3 façons', '📖 Behind the scenes shooting', '🎯 Guide morphologie'],
      video: ['🎬 Catwalk cinématographique slow-mo', '📱 GRWM authentique', '🌆 Try-on haul lifestyle', '✨ Teaser drop dramatique'],
    },
  },
  '🧴 Beauté / Cosmétique / Skincare': {
    angles: ['✨ Avant / après peau visible', '🧪 Science & ingrédients actifs', '👩 Routine experte simplifiée', '🌿 Clean & cruelty-free', ...COMMON_ANGLES],
    styles: {
      image: ['💎 Macro texture produit hyperréel', '☀️ Skin glow lumière naturelle', '🖼️ Packshot studio premium', '🌸 Lifestyle salle de bain épurée'],
      carousel: ['🧴 Routine matin / soir', '🧪 Actifs & bénéfices', '✨ Résultats avant / après', '⭐ Témoignages clientes'],
      video: ['📱 UGC application produit', '✨ Glow-up transformation', '🧪 Démo texture macro', '🎬 Storytelling fondateur'],
    },
  },
  '💻 Tech / SaaS / IA / startups digitales': {
    angles: ['⏱️ Gain de temps mesurable', '📈 ROI / KPI prouvés', '🔧 Démo produit clair', '🧠 Thought leadership', ...COMMON_ANGLES],
    styles: {
      image: ['🖥️ UI mockup propre & moderne', '✨ Minimaliste tech premium', '🌑 Dark mode néon', '📊 Data viz claire'],
      carousel: ['📊 Étude de cas chiffrée', '💡 5 tips actionnables', '🆚 Avant vs après automatisation', '🎯 Roadmap / framework'],
      video: ['🎬 Screencast démo produit', '📱 Talking head founder', '⚡ Motion graphics data', '💼 Témoignage client B2B'],
    },
  },
  '🏦 Banque / Finance / Assurance (Fintech incluse)': {
    angles: ['🛡️ Sécurité & confiance', '📈 Optimisation / rendement', '⏱️ Simplicité d\'usage', '🧠 Expertise pédagogique', ...COMMON_ANGLES],
    styles: {
      image: ['🏛️ Premium institutionnel sobre', '📊 Data viz infographique', '🖥️ App UI clean', '🌆 Lifestyle pro confiant'],
      carousel: ['📚 Guide en 5 étapes', '🆚 Comparatif solutions', '📊 Chiffres clés impactants', '⚠️ Erreurs à éviter'],
      video: ['🎬 Talking head expert pédagogique', '📊 Motion data storytelling', '💼 Témoignage client résultat', '⚡ Hook chiffré + insight'],
    },
  },
  '🏠 Immobilier (promotion, agences, location courte durée)': {
    angles: ['🏡 Coup de cœur visuel', '💰 Rentabilité / investissement', '📍 Emplacement premium', '🔑 Off-market / exclusivité', ...COMMON_ANGLES],
    styles: {
      image: ['📸 Photo immo grand-angle lumière dorée', '🏛️ Architecture éditoriale', '🌆 Vue drone aérienne', '🖼️ Staging intérieur magazine'],
      carousel: ['🏠 Visite virtuelle slide par slide', '💰 Calcul rentabilité', '📍 Quartier & atouts', '🆚 Avant / après home staging'],
      video: ['🎬 Tour cinématographique gimbal', '🚁 Drone aérien dynamique', '📱 Walkthrough natif agent', '⚡ Hook prix + surface + CTA'],
    },
  },
  '🚗 Automobile (constructeurs + concessionnaires)': {
    angles: ['🏁 Performance & sensation', '💎 Design iconique', '⛽ Économie / éco-responsable', '🎁 Offre concession limitée', ...COMMON_ANGLES],
    styles: {
      image: ['🌆 Auto cinématique éclairage ciné', '🏁 Action shot dynamique', '🖼️ Studio fond gradient premium', '🌅 Golden hour route ouverte'],
      carousel: ['🔧 Specs techniques visuelles', '🆚 Comparatif modèles', '🎁 Offres concession', '📖 Histoire du modèle'],
      video: ['🎬 Spot publicitaire ciné', '🚗 Roulage drone dynamique', '📱 Walk-around concession', '⚡ Hook + perf + CTA RDV'],
    },
  },
  '✈️ Tourisme / Voyage / Hôtellerie': {
    angles: ['🌅 Évasion / rêve éveillé', '🎁 Bon plan / early booking', '🏆 Expérience unique', '🌿 Slow & authentique', ...COMMON_ANGLES],
    styles: {
      image: ['🌅 Paysage golden hour épique', '🏖️ Lifestyle vacances authentique', '🏛️ Hôtel éditorial magazine', '🍽️ Gastronomie locale macro'],
      carousel: ['🗺️ Itinéraire jour par jour', '✅ Top 5 expériences', '💰 Budget & bons plans', '📖 Carnet de voyage'],
      video: ['🚁 Drone destination épique', '📱 Vlog immersif POV', '🎬 Trailer destination ciné', '⚡ Hook lieu + prix + CTA'],
    },
  },
  '🍽️ Restauration / Food brands / Dark kitchens': {
    angles: ['😋 Appétissant irrésistible', '👨‍🍳 Savoir-faire chef', '🌿 Local & frais', '🎁 Menu / offre du moment', ...COMMON_ANGLES],
    styles: {
      image: ['📷 Food photography macro vapeur', '☀️ Table styling lumière naturelle', '🔥 Action cuisine ambiance chaude', '🖼️ Plat hero fond sombre'],
      carousel: ['🍽️ Menu signature visuel', '👨‍🍳 Étapes recette', '⭐ Avis clients', '📍 Adresse & ambiance'],
      video: ['🎬 ASMR cuisine satisfaisant', '👨‍🍳 Behind the scenes chef', '📱 Foodie review authentique', '⚡ Hook plat + prix + CTA resa'],
    },
  },
  '🩺 Santé / Pharma / Cliniques / Bien-être': {
    angles: ['🛡️ Confiance & expertise médicale', '✨ Résultat patient mesurable', '🌿 Approche naturelle / douce', '📚 Éducation santé', ...COMMON_ANGLES],
    styles: {
      image: ['🏥 Clinique épurée lumière douce', '👩‍⚕️ Portrait praticien rassurant', '🌿 Wellness naturel apaisant', '📊 Infographie médicale claire'],
      carousel: ['📚 Guide santé en 5 points', '✨ Avant / après protocole', '⚠️ Idées reçues vs réalité', '👩‍⚕️ Présentation équipe'],
      video: ['🎬 Talking head expert santé', '🏥 Tour clinique rassurant', '💬 Témoignage patient authentique', '⚡ Hook problème + solution + RDV'],
    },
  },
  '🎓 Éducation / Formation / Infoproduits': {
    angles: ['🚀 Transformation apprenant', '🎯 Compétence concrète & rapide', '💼 Débouché pro / ROI carrière', '🧠 Méthode unique', ...COMMON_ANGLES],
    styles: {
      image: ['📚 Lifestyle apprenant inspirant', '✨ Mockup formation premium', '🖼️ Portrait formateur autoritaire', '📊 Infographie pédagogique'],
      carousel: ['💡 5 leçons clés', '🛣️ Parcours apprenant', '⭐ Témoignages élèves', '🆚 Avant / après formation'],
      video: ['🎬 Talking head expert pédagogue', '📱 Témoignage élève transformation', '⚡ Mini-leçon valeur immédiate', '💼 Hook problème + méthode + CTA'],
    },
  },
  '💼 Coaching / Consulting / Services B2B': {
    angles: ['📈 Résultat client chiffré', '🧠 Méthodologie propriétaire', '🎯 Diagnostic personnalisé', '🤝 Partenariat long-terme', ...COMMON_ANGLES],
    styles: {
      image: ['💼 Portrait pro confiant éditorial', '🖥️ Setup bureau premium', '📊 Framework visuel propre', '🏛️ Corporate haut de gamme'],
      carousel: ['📊 Étude de cas client', '🧠 Framework / méthode', '⚠️ 5 erreurs à éviter', '✅ Checklist actionnable'],
      video: ['🎬 Talking head expert charismatique', '💬 Témoignage client B2B chiffré', '📱 Mini-conseil valeur', '⚡ Hook + insight + CTA appel'],
    },
  },
  '🎮 Médias / Divertissement / Gaming / Créateurs': {
    angles: ['🤩 Émotion / hype', '🆕 Drop / annonce exclusive', '🤝 Communauté & participation', '🏆 Best-of / highlights', ...COMMON_ANGLES],
    styles: {
      image: ['🌑 Sombre dramatique néon', '🎨 Coloré pop saturé', '🖼️ Key art éditorial', '⚡ Dynamique action freeze'],
      carousel: ['🏆 Top 5 / classement', '📖 Lore / behind scenes', '🎯 Tips gameplay', '⭐ Réactions communauté'],
      video: ['⚡ Highlight reel rythmé', '🎬 Trailer cinématographique', '📱 Reaction / face cam authentique', '🎮 Gameplay teaser hook 2s'],
    },
  },
  '📡 Télécom / Internet / Services digitaux': {
    angles: ['⚡ Vitesse / performance', '💰 Forfait imbattable', '🛡️ Fiabilité & support', '🎁 Bonus / cadeau souscription', ...COMMON_ANGLES],
    styles: {
      image: ['🖥️ UI app épurée premium', '🌆 Lifestyle connecté moderne', '✨ Minimaliste tech bleu', '📊 Data viz vitesse'],
      carousel: ['📊 Comparatif forfaits', '⚡ Bénéfices clés', '🎁 Offres en cours', '🆚 Avant / après changement'],
      video: ['🎬 Spot pub lifestyle connecté', '📱 Témoignage client satisfait', '⚡ Motion data vitesse', '💼 Hook prix + débit + CTA'],
    },
  },
};

const DEFAULT_PRESET: AnglesAndStyles = {
  angles: COMMON_ANGLES,
  styles: {
    image: ['✨ Minimaliste premium', '🌿 Lifestyle authentique', '🏛️ Luxe haut de gamme', '🖼️ Studio fond neutre'],
    carousel: ['📊 Avant / après', '🔢 Top features numérotées', '📖 Storytelling 3-5 slides', '🆚 Comparatif structuré'],
    video: ['🎬 Cinématographique premium', '📱 UGC authentique', '⚡ Hook 2s + bénéfice + CTA', '🌆 Lifestyle dynamique'],
  },
};

const QUALITY_DIRECTIVE =
  '🎯 Tous les rendus visent un niveau agence premium : ultraréaliste, 100% naturel, indétectable IA, orienté business & boost de chiffre d\'affaires.';

const ObjectiveStep = () => {
  const {
    objective, setObjective,
    marketing_angle, setMarketingAngle,
    visual_style_brief, setVisualStyleBrief,
    company_sector, type,
  } = useKreatorStore();

  const preset = useMemo(() => SECTOR_PRESETS[company_sector] ?? DEFAULT_PRESET, [company_sector]);
  const angles = preset.angles;
  const styles = preset.styles[type as ContentType] ?? preset.styles.image;

  // Reset si la valeur sélectionnée n'appartient plus aux options du secteur/type
  useEffect(() => {
    if (marketing_angle && !angles.includes(marketing_angle)) setMarketingAngle('');
  }, [angles, marketing_angle, setMarketingAngle]);
  useEffect(() => {
    if (visual_style_brief && !styles.includes(visual_style_brief)) setVisualStyleBrief('');
  }, [styles, visual_style_brief, setVisualStyleBrief]);

  return (
    <StepContainer stepNumber={4} title="Votre objectif">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Objectif du contenu</label>
          <Select value={objective} onValueChange={setObjective}>
            <SelectTrigger className="bg-card border-foreground/10 text-foreground">
              <SelectValue placeholder="Choisir un objectif..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-foreground/10">
              {OBJECTIVES.map((o) => (
                <SelectItem key={o} value={o} className="text-foreground focus:bg-secondary/20">{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Angle marketing <span className="text-xs opacity-70">(adapté à votre secteur)</span>
          </label>
          <Select value={marketing_angle} onValueChange={setMarketingAngle}>
            <SelectTrigger className="bg-card border-foreground/10 text-foreground">
              <SelectValue placeholder="Choisir un angle..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-foreground/10">
              {angles.map((a) => (
                <SelectItem key={a} value={a} className="text-foreground focus:bg-secondary/20">{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Style visuel <span className="text-xs opacity-70">(adapté au {type === 'video' ? 'format vidéo' : type === 'carousel' ? 'carrousel' : 'visuel'})</span>
          </label>
          <Select value={visual_style_brief} onValueChange={setVisualStyleBrief}>
            <SelectTrigger className="bg-card border-foreground/10 text-foreground">
              <SelectValue placeholder="Choisir un style visuel..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-foreground/10">
              {styles.map((v) => (
                <SelectItem key={v} value={v} className="text-foreground focus:bg-secondary/20">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-muted-foreground italic">{QUALITY_DIRECTIVE}</p>
        </div>
      </div>
    </StepContainer>
  );
};

export default ObjectiveStep;