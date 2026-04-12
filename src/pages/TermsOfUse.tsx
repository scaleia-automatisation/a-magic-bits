import LegalPageLayout from '@/components/LegalPageLayout';
import { FileText, Mail, MapPin, Building } from 'lucide-react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg md:text-xl font-bold text-foreground mt-8 mb-3">{children}</h2>
);

const TermsOfUse = () => (
  <LegalPageLayout>
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
        <FileText className="w-5 h-5 text-primary-foreground" />
      </div>
      <h1 className="text-2xl md:text-3xl font-black gradient-text m-0">Conditions Générales d'Utilisation</h1>
    </div>
    <p className="text-muted-foreground text-sm mb-8">Dernière mise à jour : 9 avril 2026</p>

    <SectionTitle>1. Acceptation des conditions</SectionTitle>
    <p className="text-foreground/80">En accédant à www.creafacile.com et en utilisant nos services, vous acceptez pleinement et sans réserve les présentes Conditions Générales d'Utilisation.</p>
    <p className="text-foreground/80">Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service.</p>

    <SectionTitle>2. Description du service</SectionTitle>
    <p className="text-foreground/80">Créafacile est une plateforme SaaS permettant :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>de générer du contenu (textes, images, vidéos) pour les réseaux sociaux</li>
      <li>de connecter des comptes Facebook et Instagram via OAuth</li>
      <li>de publier du contenu sur les pages Facebook et comptes Instagram de l'utilisateur</li>
    </ul>
    <p className="text-foreground/80">La publication est déclenchée uniquement par une action de l'utilisateur depuis l'interface.</p>

    <SectionTitle>3. Compte utilisateur</SectionTitle>
    <p className="text-foreground/80">Pour utiliser le service, vous devez :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>fournir des informations exactes et à jour</li>
      <li>sécuriser vos accès</li>
      <li>être responsable de toutes les actions effectuées depuis votre compte</li>
    </ul>
    <p className="text-foreground/80">Vous devez être âgé d'au moins 16 ans ou respecter l'âge légal dans votre pays.</p>

    <SectionTitle>4. Utilisation de Facebook Login</SectionTitle>
    <p className="text-foreground/80">Notre application utilise Facebook Login conformément aux règles de Meta. Les permissions utilisées sont :</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 my-3">
      {['email', 'public_profile', 'pages_manage_posts', 'pages_read_engagement', 'instagram_basic', 'instagram_content_publish'].map(p => (
        <div key={p} className="bg-card border border-foreground/10 rounded-lg px-3 py-2 text-xs font-mono text-foreground/70">{p}</div>
      ))}
    </div>
    <p className="text-foreground/80">Ces permissions sont utilisées uniquement pour connecter votre compte, récupérer vos pages Facebook et publier du contenu sur vos réseaux sociaux. Nous n'utilisons pas ces données à d'autres fins.</p>

    <SectionTitle>5. Contenu utilisateur</SectionTitle>
    <p className="text-foreground/80">Vous êtes seul responsable du contenu que vous créez et publiez via notre application. Vous vous engagez à ne pas publier de contenu :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>illégal ou frauduleux</li>
      <li>diffamatoire ou haineux</li>
      <li>violant les droits de tiers</li>
      <li>contraire aux règles de Facebook ou Instagram</li>
    </ul>

    <SectionTitle>6. Propriété intellectuelle</SectionTitle>
    <p className="text-foreground/80">Les contenus générés via notre service vous appartiennent.</p>
    <p className="text-foreground/80">L'ensemble des éléments de la plateforme (code, design, marque, algorithmes) reste la propriété exclusive de Créafacile.</p>

    <SectionTitle>7. Abonnements et paiements</SectionTitle>
    <p className="text-foreground/80">Les services payants sont facturés selon les modalités choisies (mensuelles ou annuelles). Vous pouvez résilier votre abonnement à tout moment. Aucun remboursement ne sera effectué pour une période déjà engagée, sauf obligation légale.</p>

    <SectionTitle>8. Suspension et résiliation</SectionTitle>
    <p className="text-foreground/80">Nous pouvons suspendre ou résilier votre accès en cas de :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>violation des présentes conditions</li>
      <li>utilisation abusive ou frauduleuse</li>
      <li>non-paiement</li>
      <li>demande des autorités</li>
    </ul>

    <SectionTitle>9. Limitation de responsabilité</SectionTitle>
    <p className="text-foreground/80">Le service est fourni "tel quel". Nous ne garantissons pas un fonctionnement sans interruption. Notre responsabilité est limitée aux montants payés au cours des 3 derniers mois.</p>

    <SectionTitle>10. Données et confidentialité</SectionTitle>
    <p className="text-foreground/80">L'utilisation de vos données est régie par notre Politique de Confidentialité. Nous nous engageons à respecter la réglementation en vigueur, notamment le RGPD.</p>

    <SectionTitle>11. Droit applicable</SectionTitle>
    <p className="text-foreground/80">Les présentes conditions sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.</p>

    <SectionTitle>12. Contact</SectionTitle>
    <div className="bg-card border border-foreground/10 rounded-xl p-4 space-y-2 mt-3">
      <div className="flex items-center gap-2 text-foreground/80"><Mail className="w-4 h-4 text-primary" /> bonjour@creafacile.com</div>
      <div className="flex items-center gap-2 text-foreground/80"><MapPin className="w-4 h-4 text-primary" /> 17 av de la Galine, 34170 Castelnau-le-Lez</div>
      <div className="flex items-center gap-2 text-foreground/80"><Building className="w-4 h-4 text-primary" /> Scale.ia / Moussa Dembele</div>
    </div>
  </LegalPageLayout>
);

export default TermsOfUse;
