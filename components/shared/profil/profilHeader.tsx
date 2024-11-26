import Navbar from "@/components/shared/Navbar";
import ScrollTextEffectOne from "@/components/shared/ScrollTextEffectOne";
import Meteors from "@/components/magicui/meteors";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";

export default function ProfilHeader({ id }: { id: string }) {
    const pathname = usePathname(); // Récupère le chemin actuel
    const [sellerInfo, setSellerInfo] = useState<{ loginLink: string } | null>(null);
    const { data: session, status } = useSession();
    const role = session?.user?.role;

    useEffect(() => {
      const fetchSellerInfo = async () => {
        try {
          const response = await fetch(`/api/stripe/sellerInfo/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch seller info: ${response.status}`);
          }
          const data = await response.json();
          setSellerInfo(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des informations vendeur :', error);
        }
      };
    
      if (id) {
        fetchSellerInfo();
      }
    }, [id]);

    useEffect(() => {
      console.log('Seller Info:', sellerInfo);
    }, [sellerInfo]);
  
    return (
        <>
          <Navbar />
          <ScrollTextEffectOne text={"Mon profil -"} size="3xl mt-10 sm:mt-0" />
          <Meteors number={30} />
    
            <div className="flex flex-col items-center sm:flex-row justify-center gap-5 mt-8">
            <Link 
              href={`/profil/${id}/post`}
              className={`text-center text-lg p-2 w-64 rounded-lg font-bold tracking-widest border border-white/70 transition-all duration-300 ${pathname === `/profil/${id}/post` ? 'bg-white text-black' : ' text-white hover:scale-105'}`}
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
            {(role === 'admin' || role === 'seller') && (
              <Link 
                href={sellerInfo?.loginLink || '#'}
                className={`text-center text-lg p-2 w-64 rounded-lg font-bold tracking-widest border border-white/70 transition-all duration-300 ${
                  pathname === `/profil/${id}/dashboard` ? 'bg-white text-black' : 'text-white hover:scale-105'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>
        </>
      );
    }