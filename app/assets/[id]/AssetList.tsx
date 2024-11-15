"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/shared/Navbar";
import Card from "../../../components/shared/Card";
import Meteors from "@/components/magicui/meteors";
import ScrollTextEffectOne from "@/components/shared/ScrollTextEffectOne";
import Cardv2 from "@/components/shared/Cardv2";

interface Tag {
  id_tags: number;
  nom: string;
}

interface Asset {
  id_asset: number;
  image_couverture: string | null;
  file_url: string | null;
  titre: string;
  prix: number;
  description: string;
  tags : Tag[];
  likes: number;
}

interface AssetsListProps {
  assets: Asset[];
  tags: Tag[];
  categorie: string;
}

export default function AssetsList({ assets, tags, categorie }: AssetsListProps) {
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets);

  useEffect(() => {
    applyFilters();
  }, [selectedPrice, selectedTag]);

  const applyFilters = () => {
    let filtered = assets;
  
    // Prix
    if (selectedPrice !== null) {
      filtered = filtered.filter(asset => asset.prix <= selectedPrice);
    }
  
    // Tags
    if (selectedTag !== null) {
      filtered = filtered.filter(asset =>
        asset.tags.some(tag => tag.id_tags === selectedTag)
      );
    }
  
    setFilteredAssets(filtered);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const price = Number(e.target.value);
    setSelectedPrice(price);
  };
  
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tagId = Number(e.target.value);
    setSelectedTag(tagId);
  };
  
  return (
    <>
      <Navbar />

      <ScrollTextEffectOne text={categorie + " -"} size="3xl mt-7 sm:mt-0" />

      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-7 mt-7 sm:mt-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="hidden sm:block  size-16 text-white opacity-70 rounded-full p-2 hover:opacity-100 hover:scale-105 transition-all duration-300"
          aria-labelledby="3D"
        >
          <title id="svg1Title">3D</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
          />
        </svg>

        <select className="bg-white tracking-widest w-36 sm:w-48 h-10 text-sm sm:text-base text-black font-bold border-2 border-black rounded-md focus:border-purple hover:scale-105 transition-all duration-300" onChange={handleTagChange} value={selectedTag || ""}>
          <option value="">Les tags</option>
          {tags.map(tag => (
            <option key={tag.id_tags} value={tag.id_tags}>{tag.nom}</option>
          ))}
        </select>

        <select className="bg-white tracking-widest w-36 sm:w-48 h-10 text-sm sm:text-base text-black font-bold border-2 border-black rounded-md focus:border-purple hover:scale-105 transition-all duration-300" onChange={handlePriceChange} >
          <option value="10">- 10 euros</option>
          <option value="100">- 100 euros</option>
          <option value="1000">- 1000 euros</option>
        </select>

        <select className="bg-white tracking-widest w-36 sm:w-48 h-10 text-sm sm:text-base text-black font-bold border-2 border-black rounded-md focus:border-purple hover:scale-105 transition-all duration-300" >
          <option value="option1">Bien noté</option>
          <option value="option2">Meilleurs Ventes</option>
        </select>

      </div>

      <div className="flex flex-wrap justify-center gap-5 sm:gap-10 mt-5 sm:mb-5">
        {filteredAssets.length === 0 ? (
          <div className="text-white text-center text-2xl mt-10 tracking-widest">Aucun asset trouvé</div>
        ) : (
          filteredAssets.map((asset) => (
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
      </div>
      <Meteors number={30} />
    </>
     
  );
}
