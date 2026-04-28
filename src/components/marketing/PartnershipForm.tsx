import { useState } from 'react';
import { Loader2, CheckCircle2, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface Props {
  defaultType?: string;
  compact?: boolean;
}

const PartnershipForm = ({ defaultType = '', compact = false }: Props) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    partnerType: defaultType,
    audienceSize: '',
    socialHandle: '',
    message: '',
  });

  const update = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.partnerType || form.message.trim().length < 10) {
      toast.error('Merci de remplir tous les champs requis (message ≥ 10 caractères)');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('submit-partnership', { body: form });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      setSuccess(true);
      toast.success('Demande envoyée. On revient vers vous sous 48h ✨');
    } catch (err) {
      toast.error("Impossible d'envoyer la demande. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 rounded-card border border-foreground/10 bg-card text-center">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">Demande reçue 🎉</h3>
        <p className="text-sm text-muted-foreground">
          Notre équipe étudie votre profil et revient vers vous sous 48h à <strong>{form.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${compact ? '' : 'p-6 md:p-8 rounded-card border border-foreground/10 bg-card'}`}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pf-name">Nom complet *</Label>
          <Input id="pf-name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Marie Dupont" required maxLength={120} />
        </div>
        <div>
          <Label htmlFor="pf-email">Email pro *</Label>
          <Input id="pf-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="marie@exemple.com" required maxLength={255} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pf-type">Vous êtes *</Label>
          <Select value={form.partnerType} onValueChange={(v) => update('partnerType', v)}>
            <SelectTrigger id="pf-type"><SelectValue placeholder="Sélectionnez…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Influenceur">Influenceur Instagram / TikTok</SelectItem>
              <SelectItem value="YouTubeur">YouTubeur</SelectItem>
              <SelectItem value="Créateur LinkedIn">Créateur LinkedIn</SelectItem>
              <SelectItem value="Entreprise">Entreprise / Agence</SelectItem>
              <SelectItem value="Affilié">Affilié / Revendeur</SelectItem>
              <SelectItem value="Média">Média / Presse</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="pf-audience">Taille d'audience</Label>
          <Input id="pf-audience" value={form.audienceSize} onChange={(e) => update('audienceSize', e.target.value)} placeholder="Ex : 50K abonnés Instagram" maxLength={60} />
        </div>
      </div>

      <div>
        <Label htmlFor="pf-handle">Lien réseau / site (facultatif)</Label>
        <Input id="pf-handle" value={form.socialHandle} onChange={(e) => update('socialHandle', e.target.value)} placeholder="@votre_compte ou https://…" maxLength={200} />
      </div>

      <div>
        <Label htmlFor="pf-message">Présentez-vous & votre projet *</Label>
        <Textarea
          id="pf-message"
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          placeholder="Votre audience, votre angle, le type de partenariat envisagé…"
          rows={5}
          required
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground mt-1">{form.message.length}/2000</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full gradient-bg text-primary-foreground px-6 py-3.5 rounded-pill text-base font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Envoyer ma demande de partenariat
      </button>
      <p className="text-xs text-muted-foreground text-center">
        Réponse sous 48h ouvrées · Vos données sont traitées conformément au RGPD
      </p>
    </form>
  );
};

export default PartnershipForm;