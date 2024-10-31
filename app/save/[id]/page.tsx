"use client";

import Card from "@/components/shared/Card";
import Navbar from "@/components/shared/Navbar";
import { prisma } from "@/lib/prisma";
import { useState, useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Meteors from "@/components/magicui/meteors";
import Cardv2 from "@/components/shared/Cardv2";

interface Asset {
  id_asset: number;
  image_couverture: string | null;
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

      const response = await fetch('/api/assets/likedAsset');
      if (response.ok) {
        const data = await response.json();
        console.log(data);
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

      <h2 className="text-white text-center text-4xl mt-10 tracking-widest uppercase sm:mt-10">Mes Assets sauvegardés</h2>

      <div className="flex flex-wrap justify-center sm:gap-10">
        {assetsLiked.length === 0 ? (
          <div>Aucun asset trouvé</div>
        ) : (
          assetsLiked.map((asset) => (
            <Cardv2
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
          <Meteors number={30} />
      </div>
    </>
  );
}
