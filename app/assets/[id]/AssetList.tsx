"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/shared/Navbar";
import Card from "../../../components/shared/Card";
import Meteors from "@/components/magicui/meteors";
import ScrollTextEffectOne from "@/components/shared/ScrollTextEffectOne";
import Cardv2 from "@/components/shared/Cardv2";
import Footer from "@/components/shared/Footer";
import { useCategories } from "@/contexts/CategoriesContext";
import { getSession } from "next-auth/react";

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
  const [commandCategory, setCommandCategory] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const { categories } = useCategories();

  const [formCommande, setFormCommande] = useState({
    category: "",
    description: "",
  });
  
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormCommande({
      ...formCommande,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCommands = async () => { 
    try {
      const session = await getSession();
      if (!session) {
        window.location.href = "/api/auth/signin";
        return;
      }
      const id = session.user.id;
      
      const response = await fetch("/api/discord/createCommands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: formCommande.category,
          description: formCommande.description,
          channelName: `commande-${formCommande.category}`,
          userId: Number(id),
        }),
      });

      if (response.status === 401) {
        window.location.href = "/api/auth/signin";
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      console.log("Canal créé avec succès:", data.channelId);
    } catch (error) {
      console.error("Erreur lors de la création du canal Discord:", error);
    }
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
          className="hidden sm:block size-16 text-white opacity-70 rounded-full p-2 hover:opacity-100 hover:scale-105 transition-all duration-300"
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

       <button type="button" onClick={() => setIsOpen(true)} className="bg-white font-bold sm:w-56 h-10 rounded-md tracking-widest hover:scale-105 transition-all duration-300">Service personnalisé</button>

      </div>

      <div className="flex flex-wrap justify-center gap-5 sm:gap-10 mt-9 sm:mb-5">
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

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
          <div className="relative bg-white w-[600px] p-5 rounded-lg shadow-lg">

            <form onSubmit={handleCreateCommands} className="flex flex-col gap-2">

              <p className="text-xl tracking-widest font-bold text-center title">Commander un service personnalisé</p>

              <select value={formCommande.category} onChange={handleChange} className="bg-white tracking-widest w-36 mx-auto sm:w-72 h-10 mt-3 text-sm sm:text-base text-black font-bold border-2 border-black rounded-md focus:border-purple hover:scale-105 transition-all duration-300">
                      <option value="">Choisissez un domaine</option>
                      {categories.map(categorie => (
                        <option key={categorie.id_categorie} value={categorie.id_categorie}>{categorie.nom}</option>
                      ))}
              </select>

              <textarea placeholder="Décrivez votre demande" className="mx-auto mt-2 h-24 w-[430px] bg-white text-black p-2 rounded-lg border-2 border-black"></textarea>

              <button type="submit" className="mt-2 bg-black text-white font-bold tracking-widest w-72 h-12 mx-auto rounded-md hover:scale-105 transition-all duration-300">Confirmer votre demande</button>
              <p className="text-[10px] tracking-wider text-center">*Un canal privé sera crée sur le discord, un membre de l'équipe vous répondra dans les plus brefs délais.</p>
            </form>

            <button type="button" onClick={() => setIsOpen(false)} className="absolute top-[-12px] right-[-12px] text-black font-bold rounded-full text-2xl hover:scale-110 hover:rotate-180 transition duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8 text-white bg-black rounded-full">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            </button>
          </div>
        </div>
      )}
    </>
     
  );
}
