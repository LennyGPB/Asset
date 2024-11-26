import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function PrivacyPolicy() {
    return (
        <>
        <Navbar />
        <div className="text-white text-center mt-10">
        <h1 className="text-2xl font-bold mb-5 title tracking-[10px]">Politique de confidentialité</h1>
        
        <p>
            <strong>Introduction</strong><br />
            La protection de vos données personnelles est une priorité pour <strong>Asset</strong>. Cette politique de confidentialité
            explique comment nous collectons, utilisons, stockons et protégeons vos données lorsque vous utilisez notre site.
            En accédant à notre site ou en utilisant nos services, vous acceptez cette politique de confidentialité.
        </p>

        <p className="mt-5">
            <strong>Responsable du traitement</strong><br />
            Le traitement des données personnelles collectées sur le site <strong>Asset</strong> est effectué par :<br />
            - <strong>Nom de l’entreprise :</strong> [Asset Company].<br />
            - <strong>Adresse :</strong> [Adresse complète].<br />
            - <strong>Contact :</strong> [Adresse e-mail officielle].<br />
            Pour toute question relative à vos données personnelles, contactez-nous à l’adresse ci-dessus.
        </p>

        <p className="mt-5">
            <strong>Données collectées et finalités</strong><br />
            Nous collectons plusieurs types de données pour vous fournir nos services :<br />
            - <strong>Données fournies par l’utilisateur :</strong> lors de l’inscription, de l’achat ou de la mise en vente d’un produit,
            telles que votre nom, adresse e-mail, pseudonyme Discord, et données nécessaires pour les transactions Stripe.<br />
            - <strong>Données techniques :</strong> adresse IP, type de navigateur, système d’exploitation, et logs de connexion.<br />
            - <strong>Données relatives à votre activité :</strong> likes, achats effectués, et interactions avec le site.<br />
            Ces données sont collectées pour :<br />
            - Gérer vos comptes utilisateur.<br />
            - Traiter vos transactions (via Stripe).<br />
            - Améliorer nos services grâce à des analyses statistiques.<br />
            - Assurer la sécurité de nos utilisateurs et du site.
        </p>

        <p className="mt-5">
            <strong>Partage des données avec des tiers</strong><br />
            Nous partageons certaines données uniquement avec des prestataires nécessaires au fonctionnement de notre site :<br />
            - <strong>Stripe :</strong> pour la gestion des paiements sécurisés.<br />
            - <strong>Azure :</strong> pour l’hébergement sécurisé des données.<br />
            - <strong>Discord :</strong> pour l’authentification et les notifications liées à votre compte.<br />
            Nous ne vendons jamais vos données à des tiers.
        </p>

        <p className="mt-5">
            <strong>Durée de conservation des données</strong><br />
            Nous conservons vos données aussi longtemps que nécessaire pour fournir nos services :<br />
            - Données des comptes : jusqu’à la suppression volontaire de votre compte.<br />
            - Logs techniques : jusqu’à 1 an après votre dernière connexion.<br />
            - Données relatives aux transactions : conformément aux obligations légales (ex. : fiscalité).
        </p>

        <p className="mt-5">
            <strong>Droits des utilisateurs</strong><br />
            Conformément au RGPD, vous disposez des droits suivants :<br />
            - <strong>Droit d’accès :</strong> demander une copie des données que nous possédons sur vous.<br />
            - <strong>Droit de rectification :</strong> corriger vos données si elles sont inexactes.<br />
            - <strong>Droit de suppression :</strong> demander la suppression de vos données (sous certaines conditions).<br />
            - <strong>Droit d’opposition :</strong> refuser le traitement de vos données dans certains cas.<br />
            - <strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré.<br />
            Pour exercer vos droits, contactez-nous à : [adresse e-mail].
        </p>

        <p className="mt-5">
            <strong>Sécurité des données</strong><br />
            Nous utilisons des mesures techniques et organisationnelles pour protéger vos données :<br />
            - Chiffrement des données sensibles (ex. : paiements).<br />
            - Serveurs sécurisés hébergés sur <strong>Microsoft Azure</strong>.<br />
            - Accès restreint aux données personnelles pour les employés autorisés.
        </p>

        <p className="mt-5">
            <strong>Cookies</strong><br />
            Le site utilise des cookies pour améliorer l’expérience utilisateur et analyser le trafic :<br />
            - <strong>Cookies fonctionnels :</strong> nécessaires pour le fonctionnement du site (connexion, panier, etc.).<br />
            - <strong>Cookies analytiques :</strong> pour suivre les performances et améliorer nos services.<br />
            Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
        </p>

        <p className="mt-5">
            <strong>Modifications de la politique de confidentialité</strong><br />
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. En cas de changement 
            important, nous informerons les utilisateurs via une notification sur le site.
        </p>

        <p className="mt-5">
            <strong>Contact</strong><br />
            Pour toute question ou demande liée à la confidentialité, contactez-nous à :<br />
            - <strong>Adresse e-mail :</strong> [adresse e-mail officielle].<br />
        </p>
        </div>
        </>
    )
}