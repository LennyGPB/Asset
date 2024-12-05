"use client";

import { useState, useEffect } from "react";
import Cardv2 from "../Cardv2";

interface Asset {
  id_asset: number;
  image_couverture: string | null;
  file_url: string | null;
  titre: string;
  prix: number;
  description: string;
  likes: number;
}


export default function S2_home() {
 const [popularAssets, setPopularAssets] = useState<Asset[]>();

  useEffect(() => {
    fetchPopularAssets();
  }, []);

  const fetchPopularAssets = async () => {
    try {
      const response = await fetch('/api/assets/popularAsset');
      const data = await response.json();
      setPopularAssets(data);
    } catch (error) {
      console.error('Error fetching popular assets:', error);
    }
  };

  return (
    <>
    {/* <div className="h-[1px] w-full bg-white mt-20" /> */}
      <h1 className="mt-20  pb-8 pt-8 text-4xl text-center text-white uppercase tracking-[10px] title"> Assets Populaire </h1>
      <div className="flex flex-wrap justify-center gap-7 sm:gap-10 pb-16">
        {popularAssets &&
          popularAssets.map((asset) => (
            <Cardv2
              key={asset.id_asset}
              lienImage={asset.image_couverture ?? ""}
              titre={asset.titre}
              prix={asset.prix}
              description={asset.description}
              id={asset.id_asset}
              likes={asset.likes}
            />
          ))}
      </div>
    </>
  );
}
