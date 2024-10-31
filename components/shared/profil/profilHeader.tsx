import Navbar from "@/components/shared/Navbar";
import ScrollTextEffectOne from "@/components/shared/ScrollTextEffectOne";
import Meteors from "@/components/magicui/meteors";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function ProfilHeader({ id }: { id: string }) {
    const pathname = usePathname(); // Récupère le chemin actuel
    return (
        <>
          <Navbar />
          <ScrollTextEffectOne text={"Mon profil -"} size="3xl mt-7 sm:mt-0" />
          <Meteors number={30} />
    
          <div className="flex justify-center gap-5 mt-8">
            <Link 
              href={`/profil/${id}/post`}
              className={`text-center text-lg p-2 w-64 rounded-lg font-bold tracking-widest border border-white/70 transition-all duration-300 ${
                pathname === `/profil/${id}/post` ? 'bg-white text-black' : ' text-white hover:scale-105'
              }`}
            >
              Mes assets
            </Link>
    
            <Link 
              href={`/profil/${id}/buy`}
              className={`text-center text-lg p-2 w-64 rounded-lg font-bold tracking-widest border border-white/70 transition-all duration-300 ${
                pathname === `/profil/${id}/buy` ? 'bg-white text-black' : 'text-white hover:scale-105'
              }`}
            >
              Mes achats
            </Link>
          </div>
        </>
      );
    }