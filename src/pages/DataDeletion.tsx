import LegalPageLayout from '@/components/LegalPageLayout';
import { Trash2, Mail, Clock, CheckCircle } from 'lucide-react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg md:text-xl font-bold text-foreground mt-8 mb-3">{children}</h2>
);

const DataDeletion = () => (
  <LegalPageLayout>
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
        <Trash2 className="w-5 h-5 text-primary-foreground" />
      </div>
      <h1 className="text-2xl md:text-3xl font-black gradient-text m-0">Suppression des données utilisateur</h1>
    </div>
    <p className="text-muted-foreground text-sm mb-2">Conformité à la Meta Platform Policy</p>
    <p className="text-muted-foreground text-sm mb-8">Dernière mise à jour : 9 avril 2026</p>

    <SectionTitle>1. Introduction</SectionTitle>
    <p className="text-foreground/80">Conformément à la politique de la plateforme Meta et au RGPD, les utilisateurs de www.creafacile.com ont le droit de demander la suppression complète de leurs données personnelles à tout moment. Cette page explique la procédure à suivre.</p>

    <SectionTitle>2. Données concernées</SectionTitle>
    <p className="text-foreground/80">La suppression de votre compte entraîne la suppression définitive des données suivantes :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>Nom et prénom</li>
      <li>Adresse email</li>
      <li>Identifiant Facebook (user ID)</li>
      <li>Identifiants de pages Facebook</li>
      <li>Identifiant de compte Instagram professionnel</li>
      <li>Tokens d'accès Facebook et Instagram</li>
      <li>Contenus générés (textes, images, vidéos)</li>
      <li>Historique de publications</li>
      <li>Préférences et paramètres</li>
    </ul>
    <p className="text-foreground/80 text-sm italic">Certaines données peuvent être conservées uniquement si la loi l'exige (obligations comptables ou légales).</p>

    <SectionTitle>3. Méthodes de suppression</SectionTitle>

    <div className="space-y-4 mt-4">
      <div className="bg-card border border-primary/20 rounded-xl p-4">
        <h3 className="font-bold text-foreground flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4 text-primary" /> Méthode 1 — Depuis l'application (recommandée)</h3>
        <ol className="list-decimal pl-5 text-foreground/80 space-y-1 text-sm">
          <li>Connectez-vous à votre compte sur www.creafacile.com</li>
          <li>Accédez à : <strong>Paramètres → Mon compte</strong></li>
          <li>Cliquez sur "<strong>Supprimer mon compte</strong>"</li>
          <li>Confirmez votre demande</li>
        </ol>
        <p className="text-muted-foreground text-xs mt-2">👉 Votre compte sera supprimé dans un délai maximum de 30 jours.</p>
      </div>

      <div className="bg-card border border-foreground/10 rounded-xl p-4">
        <h3 className="font-bold text-foreground flex items-center gap-2 mb-2"><Mail className="w-4 h-4 text-primary" /> Méthode 2 — Par email</h3>
        <p className="text-foreground/80 text-sm">Envoyez un email à : <a href="mailto:bonjour@creafacile.com" className="text-primary hover:underline">bonjour@creafacile.com</a></p>
        <div className="bg-muted rounded-lg p-3 mt-2 text-sm text-foreground/70">
          <p><strong>Objet :</strong> Demande de suppression de données</p>
          <p><strong>Contenu :</strong> Votre email de compte + "Je demande la suppression complète de mes données personnelles"</p>
        </div>
      </div>

      <div className="bg-card border border-foreground/10 rounded-xl p-4">
        <h3 className="font-bold text-foreground mb-2">Méthode 3 — Via Facebook</h3>
        <ol className="list-decimal pl-5 text-foreground/80 space-y-1 text-sm">
          <li>Aller sur Facebook</li>
          <li>Paramètres et confidentialité → Paramètres</li>
          <li>Applications et sites web</li>
          <li>Sélectionner Créafacile</li>
          <li>Cliquer sur Supprimer</li>
        </ol>
        <p className="text-muted-foreground text-xs mt-2">👉 Ensuite, envoyez un email pour confirmer la suppression complète côté serveur.</p>
      </div>
    </div>

    <SectionTitle>4. Délai de traitement</SectionTitle>
    <div className="flex gap-4 mt-3">
      <div className="flex-1 bg-card border border-foreground/10 rounded-xl p-4 text-center">
        <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Accusé de réception</p>
        <p className="text-xs text-muted-foreground">sous 48 heures</p>
      </div>
      <div className="flex-1 bg-card border border-foreground/10 rounded-xl p-4 text-center">
        <Trash2 className="w-5 h-5 text-primary mx-auto mb-2" />
        <p className="text-sm font-semibold text-foreground">Suppression complète</p>
        <p className="text-xs text-muted-foreground">sous 30 jours maximum</p>
      </div>
    </div>

    <SectionTitle>5. Confirmation</SectionTitle>
    <p className="text-foreground/80">Une fois la suppression effectuée, vous recevrez un email confirmant la suppression complète de vos données et la révocation de vos accès Facebook et Instagram.</p>

    <SectionTitle>6. Contact</SectionTitle>
    <div className="bg-card border border-foreground/10 rounded-xl p-4 space-y-2 mt-3">
      <div className="flex items-center gap-2 text-foreground/80"><Mail className="w-4 h-4 text-primary" /> bonjour@creafacile.com</div>
      <div className="flex items-center gap-2 text-foreground/80"><Clock className="w-4 h-4 text-primary" /> Réponse sous 48h</div>
      <div className="flex items-center gap-2 text-foreground/80"><Trash2 className="w-4 h-4 text-primary" /> Traitement : maximum 30 jours</div>
    </div>
  </LegalPageLayout>
);

export default DataDeletion;
