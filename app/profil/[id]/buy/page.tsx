"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProfilHeader from "@/components/shared/profil/profilHeader";
import ProfilCardBuy from "@/components/shared/profil/profilCardBuy";

interface Asset {
  id_asset: number;
  image_couverture: string | null;
  file_url: string | null;
  updatedAt: Date;
  titre: string;
  prix: number;
  description: string;
  likes: number;
}

export default function Buy() {
  const [buyedAssets, setbuyedAssets] = useState<Asset[]>([]);

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    try{
      fetch(`/api/users/buyedAssets/${id}`)
        .then(response => response.json())
        .then(data => {
          const assetsData = data.map((buy: { asset: Asset }) => buy.asset);
          setbuyedAssets(assetsData);
        })
        .catch(error => console.error('Error fetching assets:', error));
    } catch (error) {
       console.error('Error fetching assets:', error);
    }
  }, [id]);

  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };
  const update = buyedAssets.length > 0 ? new Intl.DateTimeFormat("fr-FR", options).format(new Date(buyedAssets[0].updatedAt)) : "00/00/00";

  return (
   <>
   <ProfilHeader id={id} />

   <div className="flex flex-wrap gap-2 sm:gap-10 mt-10 sm:mb-10 justify-center">
    {buyedAssets.map((asset: Asset) => (
      <ProfilCardBuy key={asset.id_asset} lienImage={asset.image_couverture || ""} titre={asset.titre} prix={asset.prix} description={asset.description} id={asset.id_asset} userId={id} likes={asset.likes} update={update}  />
    ))}
   </div>
   </>
  )
}