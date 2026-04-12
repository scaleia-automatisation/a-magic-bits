import LegalPageLayout from '@/components/LegalPageLayout';
import { CheckCircle, Trash2, Clock, Lock, Mail, AlertTriangle } from 'lucide-react';

const DataDeletionConfirmation = () => (
  <LegalPageLayout>
    <div className="text-center mb-10">
      <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 className="text-2xl md:text-3xl font-black gradient-text mb-2">Demande de suppression prise en compte</h1>
      <p className="text-muted-foreground text-sm">Dernière mise à jour : 9 avril 2026</p>
    </div>

    <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 mb-8 text-center">
      <CheckCircle className="w-8 h-8 text-primary mx-auto mb-3" />
      <h2 className="text-lg font-bold text-foreground mb-2">Votre demande a bien été enregistrée</h2>
      <p className="text-foreground/80 text-sm">Votre demande de suppression de données a été prise en compte avec succès. Nous confirmons que votre compte Créafacile ainsi que vos données associées sont en cours de suppression.</p>
    </div>

    <h2 className="text-lg font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
      <Trash2 className="w-5 h-5 text-primary" /> Données concernées par la suppression
    </h2>
    <div className="bg-card border border-foreground/10 rounded-xl p-4">
      <ul className="space-y-2 text-sm text-foreground/80">
        {[
          'Votre profil utilisateur (nom, email)',
          'Votre identifiant Facebook (user ID)',
          'Vos identifiants de pages Facebook',
          'Votre compte Instagram connecté',
          'Vos tokens d\'accès Facebook et Instagram',
          'L\'ensemble de vos contenus générés (textes, images, vidéos)',
          'Votre historique de publications',
          'Vos préférences et paramètres',
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <div className="bg-card border border-foreground/10 rounded-xl p-4 text-center">
        <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Délai de traitement</p>
        <p className="text-xs text-muted-foreground">30 jours maximum</p>
      </div>
      <div className="bg-card border border-foreground/10 rounded-xl p-4 text-center">
        <Lock className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Accès désactivé</p>
        <p className="text-xs text-muted-foreground">effectif sous peu</p>
      </div>
      <div className="bg-card border border-foreground/10 rounded-xl p-4 text-center">
        <Mail className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Confirmation</p>
        <p className="text-xs text-muted-foreground">envoyée par email</p>
      </div>
    </div>

    <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mt-8">
      <h3 className="font-bold text-foreground flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-destructive" /> Exceptions légales</h3>
      <p className="text-foreground/80 text-sm">Certaines données peuvent être conservées uniquement si la loi l'exige (ex : obligations comptables ou légales).</p>
    </div>

    <div className="bg-card border border-foreground/10 rounded-xl p-4 mt-8">
      <h3 className="font-semibold text-foreground mb-2">📞 Besoin d'aide ?</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-foreground/80 text-sm"><Mail className="w-4 h-4 text-primary" /> bonjour@creafacile.com</div>
        <div className="flex items-center gap-2 text-foreground/80 text-sm"><Clock className="w-4 h-4 text-primary" /> Réponse sous 48h</div>
      </div>
    </div>
  </LegalPageLayout>
);

export default DataDeletionConfirmation;
