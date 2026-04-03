export const STRIPE_PLANS = {
  free: {
    name: "Gratuit",
    price: 0,
    credits: 5,
    price_id: null,
    product_id: null,
    features: [
      "5 crédits offerts",
      "Génération d'images",
      "Formats standards",
    ],
  },
  pro: {
    name: "Pro",
    price: 29.90,
    credits: 30,
    price_id: "price_1TIHJC06OmzKqSbkRzfHsQqF",
    product_id: "prod_UGoxPc1EAXScVJ",
    features: [
      "30 crédits / mois",
      "Images, carrousels & vidéos",
      "Tous les modèles IA",
      "Support prioritaire",
    ],
  },
  premium: {
    name: "Premium",
    price: 49.90,
    credits: 50,
    price_id: "price_1TIHJK06OmzKqSbk7iQoqgxa",
    product_id: "prod_UGoxTqXcvOco9s",
    features: [
      "50 crédits / mois",
      "Images, carrousels & vidéos",
      "Tous les modèles IA",
      "Support prioritaire",
      "Accès anticipé nouvelles fonctionnalités",
    ],
  },
} as const;

export type PlanKey = keyof typeof STRIPE_PLANS;
