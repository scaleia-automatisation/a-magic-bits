import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Mail, Check, Gift, Send, Loader2, Users, Sparkles, X, Plus, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SITE_URL = 'https://creafacile.com';
const MAX_EMAILS = 10;

interface InvitationRow {
  id: string;
  invited_email: string;
  status: string;
  created_at: string;
  converted_at: string | null;
}

const ReferralSection = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [invitations, setInvitations] = useState<InvitationRow[]>([]);

  const referralCode = profile?.referral_code ?? '';
  const referralLink = referralCode ? `${SITE_URL}/auth?ref=${referralCode}` : '';

  const fetchInvitations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('referral_invitations')
      .select('id, invited_email, status, created_at, converted_at')
      .eq('inviter_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setInvitations(data as InvitationRow[]);
  };

  useEffect(() => { fetchInvitations(); }, [user]);

  const convertedCount = invitations.filter((i) => i.status === 'converted').length;
  const earnedCredits = convertedCount * 5;

  const copy = async (text: string, setter: (v: boolean) => void, label: string) => {
    await navigator.clipboard.writeText(text);
    setter(true);
    toast.success(`${label} copié !`);
    setTimeout(() => setter(false), 2000);
  };

  const addEmail = () => {
    const v = emailInput.trim().toLowerCase();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return toast.error('Email invalide');
    if (emails.includes(v)) return toast.error('Email déjà ajouté');
    if (emails.length >= MAX_EMAILS) return toast.error(`Maximum ${MAX_EMAILS} emails par envoi`);
    setEmails([...emails, v]);
    setEmailInput('');
  };

  const removeEmail = (e: string) => setEmails(emails.filter((x) => x !== e));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addEmail();
    }
  };

  const sendInvitations = async () => {
    if (emails.length === 0) return toast.error('Ajoutez au moins un email');
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-referral-invitation', {
        body: { emails },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      const sent = (data as any)?.sent ?? 0;
      toast.success(`${sent} invitation${sent > 1 ? 's' : ''} envoyée${sent > 1 ? 's' : ''} 🎉`);
      setEmails([]);
      fetchInvitations();
    } catch {
      toast.error("Impossible d'envoyer les invitations");
    } finally {
      setSending(false);
    }
  };

  // Pas connecté → CTA
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="text-center p-8 md:p-12 rounded-card border border-foreground/10 bg-card">
          <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Connectez-vous pour parrainer</h3>
          <p className="text-muted-foreground mb-6">
            Créez votre compte (gratuit) pour obtenir votre code et inviter vos amis.
          </p>
          <Button onClick={() => navigate('/auth')} className="gradient-bg text-primary-foreground hover:opacity-90">
            Créer mon compte
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-5 mb-8">
        {[
          { v: invitations.length, l: 'Invitations envoyées', icon: Mail },
          { v: convertedCount, l: 'Amis inscrits', icon: Users },
          { v: `+${earnedCredits}`, l: 'Crédits gagnés', icon: Sparkles },
        ].map((s) => (
          <div key={s.l} className="p-4 md:p-5 rounded-card border border-foreground/5 bg-card text-center">
            <s.icon className="w-4 h-4 text-primary mx-auto mb-2" />
            <div className="text-2xl md:text-3xl font-black gradient-text">{s.v}</div>
            <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Code parrain */}
      <div className="p-6 md:p-8 rounded-card border border-foreground/10 bg-card mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-primary" />
          Votre code de parrainage
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 px-4 py-3 rounded-md border border-foreground/10 bg-background font-mono text-2xl font-bold tracking-wider text-center sm:text-left">
            {referralCode || '—'}
          </div>
          <Button
            onClick={() => copy(referralCode, setCopiedCode, 'Code')}
            disabled={!referralCode}
            className="gradient-bg text-primary-foreground hover:opacity-90 shrink-0"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedCode ? 'Copié' : 'Copier le code'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Partagez ce code à vos amis. À l'inscription, ils gagnent <strong className="text-foreground">5 crédits</strong> et vous aussi.
        </p>
      </div>

      {/* Lien parrainage */}
      <div className="p-6 md:p-8 rounded-card border border-foreground/10 bg-card mb-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Copy className="w-4 h-4 text-primary" />
          Votre lien personnalisé
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input value={referralLink} readOnly className="font-mono text-sm" />
          <Button
            onClick={() => copy(referralLink, setCopiedLink, 'Lien')}
            disabled={!referralLink}
            className="gradient-bg text-primary-foreground hover:opacity-90 shrink-0"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedLink ? 'Copié' : 'Copier'}
          </Button>
        </div>
      </div>

      {/* Invitations email */}
      <div className="p-6 md:p-8 rounded-card border border-foreground/10 bg-card mb-6">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Inviter par email
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Jusqu'à <strong className="text-foreground">{MAX_EMAILS} amis par envoi</strong>. On envoie un email chaleureux contenant votre code.
        </p>

        <div className="flex gap-2 mb-3">
          <Input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ami@exemple.com"
            type="email"
            disabled={emails.length >= MAX_EMAILS}
          />
          <Button onClick={addEmail} variant="outline" className="shrink-0" disabled={emails.length >= MAX_EMAILS}>
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </div>

        {emails.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-background rounded-btn border border-foreground/5">
            {emails.map((e) => (
              <span key={e} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-card border border-foreground/10 text-sm">
                {e}
                <button onClick={() => removeEmail(e)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={sendInvitations}
          disabled={sending || emails.length === 0}
          className="w-full gradient-bg text-primary-foreground px-6 py-3 rounded-pill text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Envoyer {emails.length > 0 ? `${emails.length} invitation${emails.length > 1 ? 's' : ''}` : 'les invitations'}
        </button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          {emails.length}/{MAX_EMAILS} emails · Envoi depuis Créafacile
        </p>
      </div>

      {/* Historique */}
      {invitations.length > 0 && (
        <div className="p-6 md:p-8 rounded-card border border-foreground/10 bg-card">
          <h3 className="text-lg font-bold mb-4">Historique des invitations</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {invitations.slice(0, 30).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-btn bg-background border border-foreground/5">
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm truncate">{inv.invited_email}</span>
                </div>
                {inv.status === 'converted' ? (
                  <span className="text-xs px-2 py-1 rounded-pill bg-primary/10 text-primary font-medium shrink-0">
                    ✓ Inscrit · +5 crédits
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-pill bg-muted text-muted-foreground shrink-0">
                    En attente
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralSection;