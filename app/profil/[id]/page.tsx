"use client";

import Meteors from "@/components/magicui/meteors";
import Card from "@/components/shared/Card";
import Navbar from "@/components/shared/Navbar";
import ProfilCard from "@/components/shared/profil/profilCard";
import ScrollTextEffectOne from "@/components/shared/ScrollTextEffectOne";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Asset {
  id_asset: number;
  image_couverture: string | null;
  file_url: string | null;
  titre: string;
  prix: number;
  description: string;
  likes: number;
}

export default function Profile() {
  const [assets, setAssets] = useState<Asset[]>([]);

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    try{
      fetch(`/api/users/ownedAssets/${id}`)
        .then(response => response.json())
        .then(data => {
          const assetsData = data.map((possession: { asset: Asset }) => possession.asset);
          setAssets(assetsData);
        })
        .catch(error => console.error('Error fetching assets:', error));
    } catch (error) {
       console.error('Error fetching assets:', error);
    }
  }, [id]);

  console.log(assets);

  return (
   <>
   <Navbar />
   <ScrollTextEffectOne text={"Mes assets -"} size="3xl" />
   <Meteors number={30} />

   <div className="flex flex-wrap gap-2 sm:gap-10 justify-center">
    {assets.map((asset: Asset) => (
      <ProfilCard key={asset.id_asset} lienImage={asset.image_couverture || ""} titre={asset.titre} prix={asset.prix} description={asset.description} id={asset.id_asset} likes={asset.likes} />
    ))}
   </div>
   </>
  )
}