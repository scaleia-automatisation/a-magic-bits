import { Link } from 'react-router-dom';
import boosterLogo from '@/assets/creafacile-logo.png';

const MarketingFooter = () => {
  return (
    <footer className="border-t border-foreground/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2">
            <img src={boosterLogo} alt="Créafacile" className="h-12 mb-3" />
            <p className="text-sm text-muted-foreground max-w-xs">
              L'IA marketing française qui crée vos publications Facebook, Instagram, TikTok et LinkedIn en 3 clics.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Produit</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/fonctionnalites" className="text-muted-foreground hover:text-foreground">Fonctionnalités</Link></li>
              <li><Link to="/cas-dusage" className="text-muted-foreground hover:text-foreground">Cas d'usage</Link></li>
              <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground">Tarifs</Link></li>
              <li><Link to="/auth" className="text-muted-foreground hover:text-foreground">Essai gratuit</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Entreprise</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/a-propos" className="text-muted-foreground hover:text-foreground">À propos</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link to="/#faq" className="text-muted-foreground hover:text-foreground">FAQ</Link></li>
              <li><Link to="/partenariat" className="text-muted-foreground hover:text-foreground">Partenariat</Link></li>
              <li><Link to="/parrainage" className="text-muted-foreground hover:text-foreground">Parrainage</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Confidentialité</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Conditions</Link></li>
              <li><Link to="/data-deletion" className="text-muted-foreground hover:text-foreground">Suppression des données</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 Créafacile — Génération de contenu marketing par IA</p>
          <p className="text-xs text-muted-foreground">Fait avec ❤️ en France</p>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;