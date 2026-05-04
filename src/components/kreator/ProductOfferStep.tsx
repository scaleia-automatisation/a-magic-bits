import { useState } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Users, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { generatePersonas } from '@/lib/kreator-ai';
import StepContainer from './StepContainer';

const OFFER_TYPES = ['📦 Produit', '🛠️ Service', '💻 SaaS', '🎓 Formation'];

type Persona = {
  id: number;
  profil: string;
  contexte_rapide: string;
  csp: string;
  probleme: string;
  objectif: string;
};

const ProductOfferStep = () => {
  const {
    company_activity,
    company_sector,
    product_service, setProductService,
    offer_type, setOfferType,
    target_persona, setTargetPersona,
  } = useKreatorStore();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loadingPersonas, setLoadingPersonas] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<number | null>(null);

  const handleGeneratePersonas = async () => {
    if (!company_activity?.trim()) {
      toast.error("Renseignez l'activité principale (bloc Votre activité)");
      return;
    }
    if (!company_sector?.trim()) {
      toast.error("Renseignez le secteur d'activité (bloc Votre activité)");
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
    <StepContainer stepNumber={2} title="Produit / Service">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Quel est votre produit ou service ?</label>
          <Input
            value={product_service}
            onChange={(e) => setProductService(e.target.value)}
            placeholder="Ex: Programme fitness 30 jours, Pain au levain bio..."
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
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
      </div>
    </StepContainer>
  );
};

export default ProductOfferStep;