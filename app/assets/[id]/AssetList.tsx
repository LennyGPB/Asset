"use client";

import { useState } from "react";
import Navbar from "../../../components/shared/Navbar";
import Card from "../../../components/shared/Card";
import Meteors from "@/components/magicui/meteors";
import ScrollTextEffectOne from "@/components/shared/ScrollTextEffectOne";

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

  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const price = Number(e.target.value);
    console.log('Selected Price:', price);
    setSelectedPrice(price);
  
    if (price) {
      const filtered = assets.filter(asset => asset.prix <= price);
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assets); // Remet tous les assets si aucun prix n'est sélectionné
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tagId = Number(e.target.value);
    console.log('Selected Tag ID:', tagId);
    setSelectedTag(tagId);
  
    if (tagId) {
      const filtered = assets.filter(asset => 
        asset.tags.some(tag => tag.id_tags === tagId)
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assets); // Remet tous les assets si aucun tag n'est sélectionné
    }
  };
  

  return (
    <>
      <Navbar />


      <ScrollTextEffectOne text={categorie + " -"} size="3xl" />

      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-7 mt-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-16 button opacity-70 rounded-full p-2 hover:opacity-100 hover:scale-105 transition-all duration-300"
          aria-labelledby="3D"
        >
          <title id="svg1Title">3D</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
          />
        </svg>

        <select className="bg-white tracking-widest w-48 h-10 text-black font-bold border-2 border-black rounded-md focus:border-purple hover:scale-105 transition-all duration-300" onChange={handleTagChange} value={selectedTag || ""}>
          <option value="">Tous les tags</option>
          {tags.map(tag => (
            <option key={tag.id_tags} value={tag.id_tags}>{tag.nom}</option>
          ))}
        </select>

        <select className="bg-white tracking-widest w-48 h-10 text-black font-bold border-2 border-black rounded-md focus:border-purple hover:scale-105 transition-all duration-300" onChange={handlePriceChange} >
          <option value="10">- 10 euros</option>
          <option value="100">- 100 euros</option>
          <option value="1000">- 1000 euros</option>
        </select>

        <select className="bg-white tracking-widest w-48 h-10 text-black font-bold border-2 border-black rounded-md focus:border-purple hover:scale-105 transition-all duration-300" >
          <option value="option1">Bien noté</option>
          <option value="option2">Meilleurs Ventes</option>
        </select>

      </div>

      <div className="flex flex-wrap justify-center sm:gap-10">
        {filteredAssets.length === 0 ? (
          <div className="text-white text-center text-2xl mt-10 tracking-widest">Aucun asset trouvé</div>
        ) : (
          filteredAssets.map((asset) => (
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
      <Meteors number={30} />
    </>
     
  );
}
