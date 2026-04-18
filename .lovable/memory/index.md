# Memory: index.md
Updated: 4h ago

# Project Memory

## Core
- **Stack**: Supabase (Postgres, Edge Functions), Zustand, strict TypeScript.
- **Design**: Default dark theme (#000000 bg), Geist/Inter fonts. Pink/orange/cyan accents.
- **Auth**: Google OAuth ONLY via Supabase. Custom login forms strictly forbidden.
- **Credits**: Deduct atomically only after successful final generation. Hide costs in UI.
- **Generations**: Respecting 1:1, 16:9, or 9:16 aspect ratio is absolute priority.
- **Prompts**: French prompt exclusively used for generation. English removed.
- **Captions**: Call to Action (CTA) must be strictly separated from the description text.
- **Hooks**: Tous les contenus (images, carrousels, vidéos, captions) DOIVENT avoir un hook ultra-persuasif scroll-stop dans les 2 premières secondes, aligné sur l'objectif. Règle absolue, jamais d'exception.

## Memories
- [Vision](mem://project/vision) — BoosterApp SaaS overview: AI marketing content with credits
- [Design System](mem://style/design-system) — Visual identity, colors, typography, theme support, logo sizes
- [Tech Stack](mem://tech/stack-technique) — State management, async patterns, email, payments
- [AI Providers](mem://tech/ai-providers) — OpenAI, Vertex AI, Gemini, models routing, long video start-and-poll
- [AI Orchestration](mem://tech/ai-orchestration) — Structured JSON prompts, prompt injection hacks for aspect ratio, video framework
- [Credit Logic](mem://features/credits-logic) — Atomic deductions, cost per action, rollback rules
- [Pricing Plans](mem://features/pricing-plans) — Free/Pro/Premium tiers, rollover, Stripe webhook lifecycle
- [Stripe Integration](mem://tech/stripe-integration-technical) — Webhook endpoints, invoice/subscription events, Edge Functions
- [Auth & Onboarding](mem://auth/onboarding-flow) — Mandatory onboarding for sector/activity definition, auto-deduction
- [Roles & Permissions](mem://auth/roles-and-permissions) — Admin/moderator/user roles, admin perks, RLS
- [Workflow Structure](mem://ui/workflow-structure) — 3-column start, 6 marketing objectives, post-gen buttons, cross-platform captions
- [User Modes](mem://ui/user-modes) — Simple/Expert toggle pill, UI adaptations for advanced settings
- [Content Inputs](mem://features/content-inputs) — Reference photos, free desc, performing content image, multimodal fallback
- [Idea Discovery](mem://ui/idea-discovery-ux) — Mind map UI for "Je n'ai pas d'idée" fallback
- [Prompt Editing](mem://features/prompt-editing-logic) — Auto-expanding French prompt editor, clears status on modify
- [Rendering Styles](mem://features/rendering-styles) — 15 image styles, 8 video styles, adapts dynamically
- [Generation Formats](mem://features/generation-format-logic) — DALL-E pixel dimensions vs aspect ratio params for platforms
- [Caption Logic](mem://features/caption-logic) — 4 platform texts, segmented structure, separated CTA
- [Content Management](mem://features/content-management) — 'Mes générations', native video, interactive inline block for Make webhook publish
- [Referral System](mem://features/referral-system) — +3 credits per registration via 4-char code
- [Legal & Compliance](mem://legal/compliance-and-policies) — GDPR, Meta Platform Policy, Data deletion, Legal pages
- [Navigation & Footer](mem://ui/navigation-and-footer) — Legal links, LegalPageLayout layout specifics
