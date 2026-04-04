import { useEffect } from 'react';
import { useKreatorStore } from '@/store/useKreatorStore';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';

const ActivitySectorFields = () => {
  const { profile } = useAuth();
  const { company_activity, setCompanyActivity, company_sector, setCompanySector } = useKreatorStore();

  // Pre-fill from profile on mount
  useEffect(() => {
    if (profile) {
      if (profile.company_activity && !company_activity) {
        setCompanyActivity(profile.company_activity);
      }
      if (profile.company_sector && !company_sector) {
        setCompanySector(profile.company_sector);
      }
    }
  }, [profile]);

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
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Secteur d'activité</label>
          <Input
            value={company_sector}
            onChange={(e) => setCompanySector(e.target.value)}
            placeholder="Ex: Santé, Alimentation..."
            className="bg-card border-foreground/10 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
};

export default ActivitySectorFields;
