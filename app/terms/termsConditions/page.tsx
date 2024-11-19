import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function termsConditions() {
    return (
        <>
        <Navbar />
        <div className="text-white text-center mt-10">
        <h1 className="text-2xl font-bold mb-5 title tracking-[10px]">Conditions Générales d’Utilisation</h1>
        
        <p>
            <strong>1. Présentation du site</strong><br />
            Le site <strong>Assets Store</strong> (ci-après "le Site") est une plateforme en ligne permettant aux utilisateurs 
            inscrits de vendre et d’acheter des produits numériques, tels que des modèles 3D, graphismes, scripts, 
            et fichiers audio. Le Site agit en tant qu’intermédiaire technique entre les vendeurs et les acheteurs 
            mais n’intervient pas directement dans les transactions.<br />
            En accédant au Site, vous acceptez de respecter les présentes Conditions Générales d’Utilisation (CGU).
        </p>

        <p className="mt-5">
            <strong>2. Conditions d'accès et d'inscription</strong><br />
            L’accès au Site est gratuit pour tous les visiteurs. Toutefois, certaines fonctionnalités, comme l’achat 
            ou la vente de produits numériques, nécessitent la création d’un compte utilisateur via une authentification 
            par Discord.<br />
            En vous inscrivant, vous certifiez être âgé d’au moins 18 ans ou avoir l’autorisation de vos parents ou 
            tuteurs légaux pour utiliser le Site.<br />
            Vous êtes responsable des informations fournies lors de votre inscription et de leur mise à jour en cas de 
            modification.
        </p>

        <p className="mt-5">
            <strong>3. Règles pour les vendeurs</strong><br />
            Seuls les utilisateurs certifiés et ayant le rôle "vendeur" peuvent proposer des produits à la vente sur le Site.<br />
            Les vendeurs s’engagent à :<br />
            - Publier uniquement des contenus qu’ils possèdent ou pour lesquels ils disposent des droits nécessaires.<br />
            - Fournir des descriptions exactes et complètes de leurs produits.<br />
            - Respecter les lois en vigueur, notamment en matière de propriété intellectuelle.<br />
            En cas de non-respect de ces règles, le Site se réserve le droit de suspendre ou de supprimer le compte du vendeur.
        </p>

        <p className="mt-5">
            <strong>4. Règles pour les acheteurs</strong><br />
            Les produits achetés sur le Site sont réservés à un usage strictement personnel.<br />
            Toute revente, reproduction, ou redistribution des produits sans l’autorisation explicite du vendeur est interdite.<br />
            Les acheteurs sont responsables de vérifier la compatibilité des produits avec leurs besoins avant l’achat. 
            Aucun remboursement ne sera effectué en cas d’erreur de choix ou d’incompatibilité.
        </p>

        <p className="mt-5">
            <strong>5. Paiements et commissions</strong><br />
            Les paiements sur le Site sont sécurisés et effectués via la plateforme Stripe.<br />
            Une commission de 8% est prélevée sur chaque vente réalisée par les vendeurs. Cette commission est déduite 
            automatiquement lors du transfert des fonds.<br />
            Les vendeurs sont responsables de déclarer leurs revenus issus de la vente de produits numériques conformément 
            à la législation applicable dans leur pays.
        </p>

        <p className="mt-5">
            <strong>6. Propriété intellectuelle</strong><br />
            Les contenus des produits mis en vente sur le Site restent la propriété exclusive des vendeurs qui les publient.<br />
            Les logos, designs, textes, et éléments graphiques du Site sont la propriété exclusive de <strong>Asset</strong>. 
            Toute utilisation ou reproduction de ces éléments sans autorisation préalable est strictement interdite.
        </p>

        <p className="mt-5">
            <strong>7. Responsabilité</strong><br />
            Le Site agit en tant qu’intermédiaire technique et ne garantit pas la qualité, l’exactitude, ou la légitimité 
            des produits vendus.<br />
            En cas de litige entre un acheteur et un vendeur, les parties sont invitées à résoudre leur différend de manière 
            amiable. Le Site n’est pas responsable des dommages indirects résultant de l’utilisation des produits achetés 
            ou de litiges entre utilisateurs.<br />
            Cependant, le Site se réserve le droit de suspendre ou supprimer tout compte en cas de comportement frauduleux 
            ou illicite.
        </p>

        <p className="mt-5">
            <strong>8. Sanctions</strong><br />
            En cas de non-respect des présentes CGU, le Site peut appliquer les sanctions suivantes :<br />
            - Suspension temporaire du compte utilisateur.<br />
            - Suppression définitive du compte.<br />
            - Signalement aux autorités compétentes en cas d’infraction grave.<br />
            Les sanctions sont appliquées après analyse par l’équipe de modération du Site.
        </p>

        <p className="mt-5">
            <strong>9. Règlement des litiges</strong><br />
            En cas de litige, une solution à l’amiable sera recherchée en priorité. Si aucun accord n’est trouvé, 
            les parties peuvent recourir à un médiateur agréé.<br />
            En dernier recours, le litige sera porté devant les tribunaux compétents, conformément à la législation en vigueur.
        </p>

        <p className="mt-5">
            <strong>10. Modification des CGU</strong><br />
            <strong>Asset</strong> se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront 
            informés des modifications via une notification sur le Site.<br />
            En continuant à utiliser le Site après la mise à jour des CGU, vous acceptez les termes modifiés.
        </p>

        <p className="mt-5">
            <strong>Contact</strong><br />
            Pour toute question ou réclamation relative aux présentes CGU, veuillez nous contacter à :<br />
            - <strong>Adresse e-mail :</strong> [adresse e-mail officielle].<br />
        </p>
        </div>

        <Footer />
        </>
    )
}