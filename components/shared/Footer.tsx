export default function Footer() {
    return (
        <footer>
        <p className="text-white/80 text-center tracking-widest mt-16">© 2024 Assets Store. Tous droits réservés.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-5">
            <a href="terms/legalNotice" className="text-white/70 text-center text-sm tracking-widest mt-2 mb-2 hover:scale-105 transition duration-500">Mentions légales</a>
            <a href="terms/privacyPolicy" className="text-white/70 text-center text-sm tracking-widest mt-2 mb-2 hover:scale-105 transition duration-500">Politique de confidentialité</a>
            <a href="terms/termsConditions" className="text-white/70 text-center text-sm tracking-widest mt-2 mb-2 hover:scale-105 transition duration-500">Conditions Générales d'Utilisation</a>
            <a href="https://discord.gg/WdyfxACn3G" target="blank" className="text-white/70 text-center text-sm tracking-widest mt-2 mb-2 hover:scale-105 transition duration-500">Rejoindre le discord</a>
        </div>
        </footer>
    )
}