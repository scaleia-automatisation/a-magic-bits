import LegalPageLayout from '@/components/LegalPageLayout';
import { Bell, Lock, Trash2, Mail, Clock, AlertTriangle, Settings } from 'lucide-react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg md:text-xl font-bold text-foreground mt-8 mb-3">{children}</h2>
);

const DataDeletionReminder = () => (
  <LegalPageLayout>
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
        <Bell className="w-5 h-5 text-primary-foreground" />
      </div>
      <h1 className="text-2xl md:text-3xl font-black gradient-text m-0">Rappel — Suppression des données</h1>
    </div>
    <p className="text-muted-foreground text-sm mb-8">Dernière mise à jour : 9 avril 2026</p>

    <div className="bg-card border border-primary/20 rounded-xl p-5 mb-8">
      <div className="flex items-start gap-3">
        <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div>
          <h3 className="font-bold text-foreground mb-1">Votre droit à la suppression</h3>
          <p className="text-foreground/80 text-sm">Conformément à la réglementation en vigueur (RGPD) et à la politique de Meta, vous pouvez demander à tout moment la suppression complète de vos données personnelles.</p>
        </div>
      </div>
    </div>

    <SectionTitle>🗑️ Quelles données sont concernées ?</SectionTitle>
    <p className="text-foreground/80">La suppression inclut :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>Vos informations personnelles (nom, email)</li>
      <li>Votre identifiant Facebook</li>
      <li>Vos pages Facebook connectées</li>
      <li>Votre compte Instagram professionnel</li>
      <li>Vos tokens d'accès Facebook et Instagram</li>
      <li>Vos contenus générés (textes, images, vidéos)</li>
      <li>Votre historique de publications</li>
      <li>Vos paramètres et préférences</li>
    </ul>

    <SectionTitle>⚙️ Comment supprimer vos données ?</SectionTitle>

    <div className="space-y-3 mt-4">
      <div className="bg-card border border-primary/20 rounded-xl p-4">
        <h3 className="font-bold text-foreground flex items-center gap-2 mb-2"><Settings className="w-4 h-4 text-primary" /> Méthode rapide (recommandée)</h3>
        <ol className="list-decimal pl-5 text-foreground/80 space-y-1 text-sm">
          <li>Connectez-vous à votre compte</li>
          <li>Accédez à : <strong>Paramètres → Mon compte</strong></li>
          <li>Cliquez sur "<strong>Supprimer mon compte</strong>"</li>
        </ol>
      </div>

      <div className="bg-card border border-foreground/10 rounded-xl p-4">
        <h3 className="font-bold text-foreground flex items-center gap-2 mb-2"><Mail className="w-4 h-4 text-primary" /> Méthode par email</h3>
        <p className="text-foreground/80 text-sm">Envoyez votre demande à : <a href="mailto:bonjour@creafacile.com" className="text-primary hover:underline">bonjour@creafacile.com</a></p>
      </div>

      <div className="bg-card border border-foreground/10 rounded-xl p-4">
        <h3 className="font-bold text-foreground mb-2">Via Facebook</h3>
        <p className="text-foreground/80 text-sm">Vous pouvez également retirer l'accès depuis vos paramètres Facebook (Applications et sites web).</p>
      </div>
    </div>

    <SectionTitle>⏱️ Délai de traitement</SectionTitle>
    <div className="flex gap-4 mt-3">
      <div className="flex-1 bg-card border border-foreground/10 rounded-xl p-4 text-center">
        <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Traitement</p>
        <p className="text-xs text-muted-foreground">sous 30 jours maximum</p>
      </div>
      <div className="flex-1 bg-card border border-foreground/10 rounded-xl p-4 text-center">
        <Mail className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Confirmation</p>
        <p className="text-xs text-muted-foreground">envoyée par email</p>
      </div>
    </div>

    <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mt-8">
      <h3 className="font-bold text-foreground flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-destructive" /> Important</h3>
      <ul className="list-disc pl-5 text-foreground/80 space-y-1 text-sm">
        <li>La suppression est <strong>définitive</strong></li>
        <li>Vous perdrez l'accès à votre compte</li>
        <li>Certaines données peuvent être conservées si la loi l'exige</li>
      </ul>
    </div>

    <SectionTitle>📞 Contact</SectionTitle>
    <div className="bg-card border border-foreground/10 rounded-xl p-4 space-y-2 mt-3">
      <div className="flex items-center gap-2 text-foreground/80"><Mail className="w-4 h-4 text-primary" /> bonjour@creafacile.com</div>
      <div className="flex items-center gap-2 text-foreground/80"><Clock className="w-4 h-4 text-primary" /> Réponse sous 48h</div>
    </div>
  </LegalPageLayout>
);

export default DataDeletionReminder;
