import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar"

export default function LegalNotice() {
    return (
        <>
        <Navbar />
            <h1 className="title text-white text-center text-3xl tracking-[10px] mt-10">Mentions légales :</h1>
            <div className="text-white text-center mt-5">
            <p>
                <strong>Éditeur du site :</strong><br />
                Le site <strong>Assets Store</strong> (ci-après "le Site") est édité par :<br />
                <strong>Nom de l’entreprise :</strong> InTheGleam.<br />
                <strong>Forme juridique :</strong>Auto-entrepreneur<br />
                <strong>Siège social :</strong> [Adresse complète].<br />
                <strong>SIRET :</strong> [Numéro SIRET].<br />
                <strong>Numéro de TVA intracommunautaire :</strong> [Numéro TVA].<br />
                <strong>Directeur de la publication :</strong> [Nom du responsable].<br />
                <strong>Contact :</strong> [Adresse e-mail officielle].
            </p>

            <p className="mt-5">
                <strong>Hébergeur du site :</strong><br />
                Le site <strong>Assets Store</strong> est hébergé par :<br />
                <strong>Hébergeur :</strong> Microsoft Azure.<br />
                <strong>Adresse :</strong> [Adresse de Microsoft Azure].<br />
                <strong>Téléphone :</strong> [Téléphone de Microsoft Azure].
            </p>

            <p className="mt-5">
                <strong>Propriété intellectuelle :</strong><br />
                Les contenus des produits numériques mis en ligne sur le site <strong>Asset</strong> 
                (images, fichiers, descriptions, vidéos, etc.) sont fournis par des vendeurs tiers, qui en 
                restent les propriétaires exclusifs.<br />
                Les vendeurs garantissent qu’ils disposent des droits nécessaires pour publier ces contenus sur le Site 
                et ne violent pas les droits d’auteur ou d’autres droits de propriété intellectuelle d’un tiers.<br />
                L’achat d’un produit numérique sur le Site confère au client un droit d’utilisation strictement personnel, 
                conformément aux conditions définies par le vendeur. <strong>Toute revente, reproduction ou redistribution 
                des produits achetés sans l’autorisation expresse du vendeur est interdite.</strong><br />
                En cas de réclamation concernant une violation de droits, l’équipe <strong>Asset</strong> s’engage à retirer 
                rapidement tout contenu litigieux conformément aux lois en vigueur.<br /><br />
                Le design, les logos, la charte graphique, les textes originaux, et les fonctionnalités techniques du site 
                <strong>Asset</strong> sont la propriété exclusive de l’éditeur. Toute reproduction, distribution ou 
                utilisation sans autorisation préalable est strictement interdite.
            </p>

            <p className="mt-5">
                <strong>Responsabilité :</strong><br />
                <strong>Responsabilité des vendeurs :</strong><br />
                Les vendeurs sont seuls responsables des contenus qu’ils publient sur le Site. Ils s’engagent à garantir que 
                leurs produits ne contreviennent à aucun droit de propriété intellectuelle, ni à aucune réglementation en 
                vigueur.<br />
                En cas de litige ou de réclamation de la part d’un tiers, la responsabilité du vendeur sera pleinement engagée, 
                et le Site pourra prendre les mesures nécessaires, notamment le retrait des produits concernés.<br /><br />
                <strong>Responsabilité de l’éditeur :</strong><br />
                L’éditeur du Site <strong>Asset</strong> met tout en œuvre pour assurer la disponibilité et le bon fonctionnement 
                du Site. Toutefois, il ne peut être tenu responsable des interruptions temporaires ou des éventuelles erreurs techniques.<br />
                Le Site ne pourra être tenu responsable des dommages indirects résultant de l’utilisation des produits achetés ou 
                des litiges entre vendeurs et acheteurs.
            </p>

            <p className="mt-5">
                <strong>Utilisation des cookies :</strong><br />
                Le Site utilise des cookies pour améliorer l’expérience utilisateur et à des fins statistiques. En poursuivant 
                votre navigation, vous acceptez l’utilisation des cookies conformément à notre 
                <a href="#" className="text-blue-400 underline">Politique de confidentialité</a>.
            </p>

            <p className="mt-5">
                <strong>Contact :</strong><br />
                Pour toute question ou réclamation, vous pouvez contacter l’équipe <strong>Asset</strong> :<br />
                <strong>Adresse e-mail :</strong> [adresse e-mail officielle].<br />
            </p>

            <p className="mt-5">
                <strong>Signalement de contenus :</strong><br />
                En cas de violation de droits ou de contenu illicite, merci de signaler immédiatement à :<br />
                <strong>Adresse e-mail :</strong> [adresse e-mail officielle].<br />
                <strong>Procédure :</strong> Fournir une description détaillée de la violation et vos coordonnées pour un suivi.
            </p>

            <p className="mt-5">
                <strong>Médiation et règlement des litiges :</strong><br />
                Conformément à la réglementation en vigueur, en cas de litige entre un utilisateur et le Site, une solution 
                à l’amiable sera recherchée en priorité. Si aucun accord n’est trouvé, l’utilisateur pourra saisir un médiateur 
                agréé ou porter l’affaire devant les tribunaux compétents.
            </p>

            <p className="mt-5">
                <strong>Copyright :</strong><br />
                © 2024 Asset. Tous droits réservés.<br />
                Toute reproduction ou utilisation non autorisée des éléments du Site est interdite.
            </p>
            </div>
        </>
    );
}