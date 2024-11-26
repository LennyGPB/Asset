"use client";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar"
import ProfilHeader from "@/components/shared/profil/profilHeader"
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface SellerInfo {
    numberOfSales: number;
    availableBalance: number;
    pendingBalance: number;
    loginLink: string;
  }

export default function Dashboard() {
    const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
    const params = useParams();
    const id = params?.id as string;


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

        <ProfilHeader  id={id}  />

        {/* {sellerInfo && (
            <div className="flex flex-col justify-center mt-7 gap-7">
                <a href={`${sellerInfo.loginLink}`} className="text-center text-purple text-lg tracking-widest hover:scale-105 transition duraton-500">Accéder à votre dashboard Stripe complet.</a>

                <div className="flex flex-col sm:flex-row justify-center items-center mx-auto gap-8 border border-white/70 rounded-lg p-5 sm:w-[808px]">
                    <div className="flex items-center">
                        <p className="text-md bg-white rounded-lg p-2 font-bold tracking-widest">Solde disponible :</p>
                        <p className="text-sm ml-3 text-white font-bold">{sellerInfo.availableBalance / 100} €</p>
                    </div>
                    <div className="flex items-center">
                        <p className="text-md bg-white rounded-lg p-2 font-bold tracking-widest">Nombre de ventes : </p>
                        <p className="text-sm ml-3 text-white font-bold">{sellerInfo.numberOfSales}</p>
                    </div>
                    <div className="flex items-center">
                        <p className="text-md bg-white rounded-lg p-2 font-bold tracking-widest">Solde en attente :</p>
                        <p className="text-sm ml-3 text-white font-bold">{sellerInfo.pendingBalance / 100} €</p>
                    </div>
                </div>
            </div>
        )} */}

        </>
    );
}