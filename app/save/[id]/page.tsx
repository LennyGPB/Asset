"use client";

import Card from "@/components/shared/Card";
import Navbar from "@/components/shared/Navbar";
import { prisma } from "@/lib/prisma";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Asset {
  id_asset: number;
  image_couverture: string | null;
  file_url: string | null;
  titre: string;
  prix: number;
  description: string;
  likes: number;
}

export default function Save({params}: {params: {id: string}}) {
  const [assetsLiked, setAssetsLiked] = useState<Asset[]>([]);
  const userId = Number.parseInt(params.id);
  const router = useRouter();

  useEffect(() => {
    const fetchLikedAssets = async () => {
      const session = await getSession();

      // Vérifiez si l'ID de l'utilisateur correspond au paramètre de l'URL
      if (session?.user?.id !== userId.toString()) {
        router.push("/"); 
        return; // Quittez la fonction si redirigé
      }

      const response = await fetch('/api/likedAsset');
      if (response.ok) {
        const data = await response.json();
        setAssetsLiked(data);
      } else {
        console.error('Failed to fetch liked assets');
      }
    };

    fetchLikedAssets();
  }, [params.id, router]); 

  return (
    <>
      <Navbar />

      <h2 className="text-white text-center text-4xl mt-10 tracking-widest uppercase">Mes Assets sauvegardés</h2>

      <div className="flex flex-wrap justify-center sm:gap-7">
        {assetsLiked.length === 0 ? (
          <div>Aucun asset trouvé</div>
        ) : (
          assetsLiked.map((asset) => (
            <Card
              key={asset.id_asset}
              lienImage={asset.image_couverture ?? ""}
              titre={asset.titre}
              prix={asset.prix}
              description={asset.description}
              likes={asset.likes}
              id={asset.id_asset}
            />
          ))
        )}
      </div>
    </>
  );
}
