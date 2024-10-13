"use client";

import { useState } from "react";
import Navbar from "../../../components/shared/Navbar";
import Card from "../../../components/shared/Card";

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
}

interface AssetsListProps {
  assets: Asset[];
  tags: Tag[];
}

export default function AssetsList({ assets, tags }: AssetsListProps) {
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
        asset.tags.some(tagRelation => tagRelation.tag.id_tags === tagId)
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assets); // Remet tous les assets si aucun tag n'est sélectionné
    }
  };
  

  return (
    <>
      <Navbar />
      <h2 className="text-white text-center text-4xl mt-10 tracking-widest uppercase">
        Modelisation 3D
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-7 mt-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-16 bg-purple rounded-full p-2"
          aria-labelledby="3D"
        >
          <title id="svg1Title">3D</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
          />
        </svg>

        <select
          className="bg-white w-40 h-10 text-black rounded-md"
          onChange={handleTagChange}
          value={selectedTag || ""}
        >
          <option value="">Tous les tags</option>
          {tags.map(tag => (
            <option key={tag.id_tags} value={tag.id_tags}>{tag.nom}</option>
          ))}
        </select>
        <select className="bg-white w-40 h-10 text-black rounded-md" onChange={handlePriceChange}>
          <option value="10">- 10 euros</option>
          <option value="100">- 100 euros</option>
          <option value="1000">- 1000 euros</option>
        </select>
        <select className="bg-white w-40 h-10 text-black rounded-md">
          <option value="option1">Bien noté</option>
          <option value="option2">Meilleurs Ventes</option>
          <option value="option3">Caca</option>
        </select>
      </div>

      <div className="flex flex-wrap justify-center sm:gap-7">
        {filteredAssets.length === 0 ? (
          <div>Aucun asset trouvé</div>
        ) : (
          filteredAssets.map((asset) => (
            <Card
              key={asset.id_asset}
              lienImage={asset.image_couverture ?? ""}
              titre={asset.titre}
              prix={asset.prix}
              description={asset.description}
              id={asset.id_asset}
            />
          ))
        )}
      </div>
    </>
  );
}
