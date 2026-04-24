import { useState } from 'react';
import { Mail, MessageSquare, Send, Clock, MapPin } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(`De : ${name} <${email}>\n\n${message}`);
    const sub = encodeURIComponent(subject || 'Contact depuis Créafacile');
    window.location.href = `mailto:bonjour@creafacile.com?subject=${sub}&body=${body}`;
    toast.success('Votre client mail s\'est ouvert.');
  };

  return (
    <MarketingLayout
      title="Contact — Créafacile"
      description="Une question, un retour, un partenariat ? Contactez l'équipe Créafacile, réponse sous 24h ouvrées."
    >
      <section className="pt-16 md:pt-24 pb-12 text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5">
            Parlons <span className="gradient-text">ensemble.</span>
          </h1>
          <p className="text-lg text-muted-foreground">Une question, un retour, un partenariat ? Nous répondons sous 24h ouvrées.</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="p-5 rounded-card border border-foreground/5 bg-card">
              <Mail className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Email</h3>
              <a href="mailto:bonjour@creafacile.com" className="text-sm text-muted-foreground hover:text-foreground break-all">bonjour@creafacile.com</a>
            </div>
            <div className="p-5 rounded-card border border-foreground/5 bg-card">
              <Clock className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Délai de réponse</h3>
              <p className="text-sm text-muted-foreground">24h ouvrées (lun-ven)</p>
            </div>
            <div className="p-5 rounded-card border border-foreground/5 bg-card">
              <MapPin className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Localisation</h3>
              <p className="text-sm text-muted-foreground">France 🇫🇷</p>
            </div>
            <div className="p-5 rounded-card border border-foreground/5 bg-card">
              <MessageSquare className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Sujets fréquents</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Support technique</li>
                <li>• Facturation</li>
                <li>• Partenariats</li>
                <li>• Presse</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="md:col-span-2 p-6 md:p-8 rounded-card border border-foreground/5 bg-card space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nom complet</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Marie Dupont" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="marie@exemple.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Sujet</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Question sur l'abonnement Pro" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} placeholder="Votre message…" />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto gradient-bg text-primary-foreground px-6 py-3 rounded-pill text-sm font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              Envoyer le message <Send className="w-4 h-4" />
            </button>
            <p className="text-xs text-muted-foreground">
              En envoyant ce formulaire, vous acceptez notre politique de confidentialité.
            </p>
          </form>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Contact;