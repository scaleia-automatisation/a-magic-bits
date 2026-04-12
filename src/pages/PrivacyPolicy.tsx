import LegalPageLayout from '@/components/LegalPageLayout';
import { Shield, Mail, MapPin, Building } from 'lucide-react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg md:text-xl font-bold text-foreground mt-8 mb-3">{children}</h2>
);

const PrivacyPolicy = () => (
  <LegalPageLayout>
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
        <Shield className="w-5 h-5 text-primary-foreground" />
      </div>
      <h1 className="text-2xl md:text-3xl font-black gradient-text m-0">Politique de Confidentialité</h1>
    </div>
    <p className="text-muted-foreground text-sm mb-8">Dernière mise à jour : 9 avril 2026</p>

    <SectionTitle>1. Introduction</SectionTitle>
    <p className="text-foreground/80">Sur www.creafacile.com, nous nous engageons à protéger la vie privée des utilisateurs qui accèdent à notre application via Facebook Login et Instagram. Cette politique explique quelles données nous collectons, comment nous les utilisons, et comment vous pouvez les supprimer.</p>

    <SectionTitle>2. Données collectées via Facebook Login</SectionTitle>
    <p className="text-foreground/80">Lorsque vous vous connectez via Facebook, nous collectons uniquement les données suivantes, avec votre consentement explicite :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>Nom et prénom</li>
      <li>Adresse email</li>
      <li>Identifiant Facebook (user ID)</li>
    </ul>
    <p className="text-foreground/80">Nous collectons également les informations nécessaires à la publication de contenu, notamment :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>Identifiants de pages Facebook</li>
      <li>Identifiant de compte Instagram professionnel</li>
      <li>Tokens d'accès sécurisés fournis par Facebook</li>
    </ul>
    <p className="text-foreground/80">Nous ne collectons aucune donnée sans lien avec le fonctionnement de l'application. Nous n'accédons pas à vos messages privés, à votre liste d'amis, ni à aucune autre donnée non autorisée.</p>

    <SectionTitle>3. Utilisation des données</SectionTitle>
    <p className="text-foreground/80">Les données collectées sont utilisées exclusivement pour :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>Créer et gérer votre compte utilisateur</li>
      <li>Personnaliser votre expérience dans l'application</li>
      <li>Publier automatiquement du contenu (images, vidéos, textes) sur vos pages Facebook et comptes Instagram connectés, uniquement à votre demande</li>
      <li>Assurer la sécurité de votre compte</li>
      <li>Vous envoyer des notifications liées à votre utilisation du service</li>
    </ul>
    <p className="text-foreground/80 font-medium">Nous ne vendons, ne louons, ni ne partageons vos données personnelles à des fins commerciales.</p>

    <SectionTitle>4. Permissions utilisées</SectionTitle>
    <p className="text-foreground/80">Notre application utilise les permissions suivantes fournies par Facebook :</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 my-3">
      {['email', 'public_profile', 'pages_manage_posts', 'pages_read_engagement', 'instagram_basic', 'instagram_content_publish'].map(p => (
        <div key={p} className="bg-card border border-foreground/10 rounded-lg px-3 py-2 text-xs font-mono text-foreground/70">{p}</div>
      ))}
    </div>
    <p className="text-foreground/80">Ces permissions sont utilisées uniquement pour permettre la connexion de votre compte et la publication de contenu sur vos réseaux sociaux.</p>

    <SectionTitle>5. Partage des données</SectionTitle>
    <p className="text-foreground/80">Nous pouvons partager vos données uniquement dans les cas suivants :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>Avec nos prestataires techniques (hébergement, base de données) strictement nécessaires au fonctionnement du service</li>
      <li>Si la loi l'exige (obligation légale, décision judiciaire)</li>
      <li>Avec votre consentement explicite</li>
    </ul>

    <SectionTitle>6. Conservation des données</SectionTitle>
    <p className="text-foreground/80">Vos données sont conservées tant que votre compte est actif.</p>
    <p className="text-foreground/80">En cas de suppression de votre compte, toutes vos données personnelles sont supprimées dans un délai maximum de <strong>30 jours</strong>.</p>

    <SectionTitle>7. Sécurité</SectionTitle>
    <p className="text-foreground/80">Nous mettons en œuvre des mesures de sécurité conformes aux standards de l'industrie :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>Connexion sécurisée HTTPS</li>
      <li>Stockage sécurisé des tokens d'accès Facebook (chiffrés)</li>
      <li>Accès restreint aux données</li>
      <li>Mesures de protection contre les accès non autorisés</li>
    </ul>

    <SectionTitle>8. Vos droits</SectionTitle>
    <p className="text-foreground/80">Conformément au RGPD, vous disposez des droits suivants :</p>
    <ul className="list-disc pl-5 text-foreground/80 space-y-1">
      <li>Droit d'accès</li>
      <li>Droit de rectification</li>
      <li>Droit à l'effacement</li>
      <li>Droit à la portabilité</li>
      <li>Droit d'opposition</li>
    </ul>
    <p className="text-foreground/80">Pour exercer ces droits : <a href="mailto:bonjour@creafacile.com" className="text-primary hover:underline">bonjour@creafacile.com</a></p>

    <SectionTitle>9. Cookies</SectionTitle>
    <p className="text-foreground/80">Nous utilisons uniquement des cookies fonctionnels nécessaires au bon fonctionnement de l'application. Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</p>

    <SectionTitle>10. Modifications</SectionTitle>
    <p className="text-foreground/80">Nous nous réservons le droit de modifier cette politique. En cas de modification importante, vous serez informé.</p>

    <SectionTitle>11. Contact</SectionTitle>
    <div className="bg-card border border-foreground/10 rounded-xl p-4 space-y-2 mt-3">
      <div className="flex items-center gap-2 text-foreground/80"><Mail className="w-4 h-4 text-primary" /> bonjour@creafacile.com</div>
      <div className="flex items-center gap-2 text-foreground/80"><MapPin className="w-4 h-4 text-primary" /> 17 av de la Galine, 34170 Castelnau-le-Lez</div>
      <div className="flex items-center gap-2 text-foreground/80"><Building className="w-4 h-4 text-primary" /> Scale.ia / Moussa Dembele</div>
    </div>
  </LegalPageLayout>
);

export default PrivacyPolicy;
