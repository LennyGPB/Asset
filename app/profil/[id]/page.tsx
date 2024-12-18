"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProfilHeader from "@/components/shared/profil/profilHeader";

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
   <ProfilHeader id={id} />
   </>
  )
}