import { useEffect, useState } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Users, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { generatePersonas } from '@/lib/kreator-ai';

const SECTORS = [
  '🛍️ E-commerce / Retail (DTC, marketplaces)',
  '🧃 Produits grande consommation (cosmétiques, food, boissons)',
  '👗 Mode / Fashion / Luxe',
  '🧴 Beauté / Cosmétique / Skincare',
  '💻 Tech / SaaS / IA / startups digitales',
  '🏦 Banque / Finance / Assurance (Fintech incluse)',
  '🏠 Immobilier (promotion, agences, location courte durée)',
  '🚗 Automobile (constructeurs + concessionnaires)',
  '✈️ Tourisme / Voyage / Hôtellerie',
  '🍽️ Restauration / Food brands / Dark kitchens',
  '🩺 Santé / Pharma / Cliniques / Bien-être',
  '🎓 Éducation / Formation / Infoproduits',
  '💼 Coaching / Consulting / Services B2B',
  '🎮 Médias / Divertissement / Gaming / Créateurs',
  '📡 Télécom / Internet / Services digitaux',
];

const OFFER_TYPES = ['📦 Produit', '🛠️ Service', '💻 SaaS', '🎓 Formation'];

const MARKETS = [
  'Asiatique',
  'Européen',
  'Américain',
  'Africain',
  'Moyen-oriental',
  'Latino/Hispanique',
  'Amérindien',
  'Océanien',
];

type Persona = {
  id: number;
  profil: string;
  contexte_rapide: string;
  csp: string;
  probleme: string;
  objectif: string;
};

const ActivitySectorFields = () => {
  const { profile } = useAuth();
  const {
    company_activity, setCompanyActivity,
    company_sector, setCompanySector,
    product_service, setProductService,
    market, setMarket,
    offer_type, setOfferType,
    target_persona, setTargetPersona,
    marketing_angle, setMarketingAngle,
    visual_style_brief, setVisualStyleBrief,
  } = useKreatorStore();
  const [sectorMode, setSectorMode] = useState<'preset' | 'custom'>('preset');
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null);

  useEffect(() => {
    if (profile) {
      if (profile.company_activity && !company_activity) {
        setCompanyActivity(profile.company_activity);
      }
      if (profile.company_sector && !company_sector) {
        setCompanySector(profile.company_sector);
        if (profile.company_sector && !SECTORS.includes(profile.company_sector)) {
          setSectorMode('custom');
        }
      }
    }
  }, [profile]);

  const handleSectorChange = (value: string) => {
    if (value === 'custom') {
      setSectorMode('custom');
      setCompanySector('');
    } else {
      setSectorMode('preset');
      setCompanySector(value);
    }
  };

  const handleGeneratePersonas = async () => {
    if (!company_activity?.trim()) {
      toast.error("Renseignez l'activité principale");
      return;
    }
    if (!company_sector?.trim()) {
      toast.error("Renseignez le secteur d'activité");
      return;
    }
    if (!offer_type?.trim()) {
      toast.error("Sélectionnez le type d'offre");
      return;
    }
    setLoadingPersonas(true);
    try {
      const result = await generatePersonas({
        activity: company_activity,
        sector: company_sector,
        offerType: offer_type,
      });
      setPersonas(result.personas || []);
      setSelectedPersonaId(null);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la génération des personas');
    } finally {
      setLoadingPersonas(false);
    }
  };

  const handleSelectPersona = (p: Persona) => {
    setSelectedPersonaId(p.id);
    const text = `${p.profil} — ${p.contexte_rapide} | CSP: ${p.csp} | Problème: ${p.probleme} | Objectif: ${p.objectif}`;
    setTargetPersona(text);
  };

  return (
    <div className="step-border bg-background p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-2 h-2 rounded-full gradient-bg" />
        <h2 className="text-lg font-bold text-foreground">Votre activité</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Activité principale *</label>
          <Input
            value={company_activity}
            onChange={(e) => setCompanyActivity(e.target.value)}
            placeholder="Ex: Coach fitness, Boulangerie..."
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Secteur d'activité *</label>
          {sectorMode === 'preset' ? (
            <Select value={company_sector} onValueChange={handleSectorChange}>
              <SelectTrigger className="bg-card border-foreground/10 text-foreground">
                <SelectValue placeholder="Sélectionner un secteur..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-foreground/10">
                {SECTORS.map((s) => (
                  <SelectItem key={s} value={s} className="text-foreground focus:bg-secondary/20">{s}</SelectItem>
                ))}
                <SelectItem value="custom" className="text-foreground focus:bg-secondary/20">
                  ✏️ Personnaliser
                </SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <div className="flex gap-2">
              <Input
                value={company_sector}
                onChange={(e) => setCompanySector(e.target.value)}
                placeholder="Ex: Artisanat, Mode..."
                className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground flex-1"
              />
              <button
                onClick={() => { setSectorMode('preset'); setCompanySector(''); }}
                className="text-xs text-muted-foreground hover:text-foreground px-2"
                title="Revenir à la liste"
              >
                ↩
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Quel est votre produit ou service ?</label>
          <Input
            value={product_service}
            onChange={(e) => setProductService(e.target.value)}
            placeholder="Ex: Programme fitness 30 jours, Pain au levain bio..."
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Type d'offre *</label>
          <Select value={offer_type} onValueChange={setOfferType}>
            <SelectTrigger className="bg-card border-foreground/10 text-foreground">
              <SelectValue placeholder="Choisir un type d'offre..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-foreground/10">
              {OFFER_TYPES.map((o) => (
                <SelectItem key={o} value={o} className="text-foreground focus:bg-secondary/20">{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Client cible / Persona
            </label>
            <Button
              type="button"
              size="sm"
              onClick={handleGeneratePersonas}
              disabled={loadingPersonas}
              className="gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn text-xs font-bold"
            >
              {loadingPersonas ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              )}
              Générer mon persona
            </Button>
          </div>
          <Textarea
            value={target_persona}
            onChange={(e) => setTargetPersona(e.target.value)}
            placeholder="Décrivez votre client idéal (âge, situation, problème, objectif…) ou utilisez le bouton pour le générer."
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground text-sm min-h-[80px] resize-none"
          />
          {personas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              {personas.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPersona(p)}
                  className={`text-left relative p-4 rounded-xl border-[2px] transition-all ${
                    selectedPersonaId === p.id
                      ? 'border-primary shadow-lg shadow-primary/20'
                      : 'border-foreground/10 hover:border-secondary/50'
                  } bg-card`}
                >
                  {selectedPersonaId === p.id && (
                    <CheckCircle className="absolute -top-2 -right-2 w-5 h-5 text-primary" />
                  )}
                  <div className="text-sm font-bold text-foreground mb-2">{p.profil}</div>
                  <div className="text-xs text-muted-foreground mb-1.5">{p.contexte_rapide}</div>
                  <div className="text-xs text-muted-foreground mb-1"><span className="text-primary font-semibold">CSP:</span> {p.csp}</div>
                  <div className="text-xs text-muted-foreground mb-1"><span className="text-primary font-semibold">Problème:</span> {p.probleme}</div>
                  <div className="text-xs text-muted-foreground"><span className="text-primary font-semibold">Objectif:</span> {p.objectif}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Marché / Localisation</label>
          <Select value={market} onValueChange={(v) => setMarket(v === '__none__' ? '' : v)}>
            <SelectTrigger className="bg-card border-foreground/10 text-foreground">
              <SelectValue placeholder="Choisir un marché cible..." />
            </SelectTrigger>
            <SelectContent className="bg-card border-foreground/10">
              <SelectItem value="__none__" className="text-foreground focus:bg-secondary/20">Aucun (automatique)</SelectItem>
              {MARKETS.map((m) => (
                <SelectItem key={m} value={m} className="text-foreground focus:bg-secondary/20">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Angle marketing</label>
          <Input
            value={marketing_angle}
            onChange={(e) => setMarketingAngle(e.target.value)}
            placeholder="Ex: Gain de temps, transformation, statut, économies…"
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Style visuel</label>
          <Input
            value={visual_style_brief}
            onChange={(e) => setVisualStyleBrief(e.target.value)}
            placeholder="Ex: minimaliste premium, lifestyle authentique, cinématographique…"
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
};

export default ActivitySectorFields;
