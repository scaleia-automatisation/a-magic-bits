import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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

const ACTIVITY_SECTOR_MAP: Record<string, string> = {
  coach: 'Santé & Bien-être',
  fitness: 'Santé & Bien-être',
  sport: 'Santé & Bien-être',
  thérapeute: 'Santé & Bien-être',
  médecin: 'Santé & Bien-être',
  kiné: 'Santé & Bien-être',
  nutritionniste: 'Santé & Bien-être',
  psychologue: 'Santé & Bien-être',
  restaurant: 'Restauration & Hôtellerie',
  boulangerie: 'Restauration & Hôtellerie',
  café: 'Restauration & Hôtellerie',
  traiteur: 'Restauration & Hôtellerie',
  hôtel: 'Restauration & Hôtellerie',
  agence: 'Marketing & Communication',
  marketing: 'Marketing & Communication',
  communication: 'Marketing & Communication',
  publicité: 'Marketing & Communication',
  graphiste: 'Marketing & Communication',
  développeur: 'Technologies & IT',
  saas: 'Technologies & IT',
  startup: 'Technologies & IT',
  informatique: 'Technologies & IT',
  tech: 'Technologies & IT',
  formation: 'Éducation & Formation',
  école: 'Éducation & Formation',
  professeur: 'Éducation & Formation',
  formateur: 'Éducation & Formation',
  immobilier: 'Immobilier',
  agent: 'Immobilier',
  banque: 'Finance & Assurance',
  assurance: 'Finance & Assurance',
  comptable: 'Finance & Assurance',
  boutique: 'Commerce & Distribution',
  'e-commerce': 'Commerce & Distribution',
  magasin: 'Commerce & Distribution',
  vente: 'Commerce & Distribution',
  transport: 'Transport & Logistique',
  livraison: 'Transport & Logistique',
  logistique: 'Transport & Logistique',
  consulting: 'Services aux entreprises (B2B)',
  conseil: 'Services aux entreprises (B2B)',
  freelance: 'Services aux entreprises (B2B)',
};

function deduceSector(activity: string): string {
  const lower = activity.toLowerCase().trim();
  for (const [keyword, sector] of Object.entries(ACTIVITY_SECTOR_MAP)) {
    if (lower.includes(keyword)) return sector;
  }
  return '';
}

const OnboardingModal = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState('');
  const [sector, setSector] = useState('');
  const [customSector, setCustomSector] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && profile && !profile.company_activity) {
      setOpen(true);
    }
  }, [user, profile]);

  useEffect(() => {
    if (activity.length >= 3) {
      const deduced = deduceSector(activity);
      if (deduced && !sector) {
        setSector(deduced);
      }
    }
  }, [activity]);

  const handleSave = async () => {
    if (!activity.trim()) {
      toast.error('Veuillez renseigner votre activité principale');
      return;
    }
    const finalSector = sector === 'custom' ? customSector : sector;
    if (!finalSector.trim()) {
      toast.error('Veuillez sélectionner un secteur d\'activité');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ company_activity: activity.trim(), company_sector: finalSector.trim() })
        .eq('user_id', user!.id);

      if (error) throw error;
      await refreshProfile();
      setOpen(false);
      toast.success('Bienvenue sur Créafacile ! 🎉');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md bg-background border-foreground/10" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl font-black gradient-text text-center">Bienvenue sur Créafacile 🚀</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Pour personnaliser vos contenus, dites-nous en plus sur votre activité
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Activité principale *</label>
            <Input
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Ex: Coach fitness, Boulangerie, Agence marketing..."
              className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Secteur d'activité *</label>
            <Select value={sector} onValueChange={(v) => { setSector(v); if (v !== 'custom') setCustomSector(''); }}>
              <SelectTrigger className="bg-card border-foreground/10 text-foreground">
                <SelectValue placeholder="Sélectionner un secteur..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-foreground/10">
                {SECTORS.map((s) => (
                  <SelectItem key={s} value={s} className="text-foreground focus:bg-secondary/20">{s}</SelectItem>
                ))}
                <SelectItem value="custom" className="text-foreground focus:bg-secondary/20">
                  ✏️ Secteur personnalisé
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sector === 'custom' && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Votre secteur</label>
              <Input
                value={customSector}
                onChange={(e) => setCustomSector(e.target.value)}
                placeholder="Ex: Artisanat, Mode, Agriculture..."
                className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={saving || !activity.trim()}
            className="w-full py-5 text-base font-extrabold gradient-bg border-0 text-primary-foreground hover:opacity-90 rounded-btn"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Commencer à créer 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
