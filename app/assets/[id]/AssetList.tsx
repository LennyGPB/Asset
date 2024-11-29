"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/shared/Navbar";
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
  const [commandAccept, setCommandAccept] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { categories } = useCategories();

  const [formCommande, setFormCommande] = useState({
    categoryCommande: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget; 
    setFormCommande((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleCreateCommands = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    setIsLoaded(true); // Démarre le chargement
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
          categoryCommande: formCommande.categoryCommande,
          description: formCommande.description,
          channelName: `commande-${formCommande.categoryCommande}`,
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

      setCommandAccept(true); // Commande acceptée
      setFormCommande({ categoryCommande: "", description: "" });

    } catch (error) {
      console.error("Erreur lors de la création du canal Discord:", error);
    } finally {
      // Désactive le chargement une fois que commandAccept est vrai
      setIsLoaded(false);
    }
};

  return (
    <>
      <Navbar />

      <ScrollTextEffectOne text={categorie + " -"} size="3xl mt-7 sm:mt-0" />

      <div className="mt-7 sm:mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-7">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="hidden sm:block p-2 text-white opacity-70 rounded-full size-16 hover:opacity-100 hover:scale-105 transition-all duration-300"
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
        className="w-36 sm:w-48 h-10 text-sm sm:text-base text-black font-bold bg-white border-2 border-black rounded-md tracking-widest focus:border-purple hover:scale-105 transition-all duration-300"
        onChange={handleTagChange}
        value={selectedTag || ""}
      >
        <option value="">Les tags</option>
        {tags.map((tag) => (
          <option key={tag.id_tags} value={tag.id_tags}>
            {tag.nom}
          </option>
        ))}
      </select>

      <select
        className="w-36 sm:w-48 h-10 text-sm sm:text-base text-black font-bold bg-white border-2 border-black rounded-md tracking-widest focus:border-purple hover:scale-105 transition-all duration-300"
        onChange={handlePriceChange}
      >
        <option value="10">- 10 euros</option>
        <option value="100">- 100 euros</option>
        <option value="1000">- 1000 euros</option>
      </select>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-2 h-10 text-sm sm:text-md font-bold text-white border border-white rounded-md tracking-widest opacity-30 hover:scale-105 hover:bg-white hover:text-black transition-all duration-300"
        disabled
      >
        Effectuer une commande personnalisée
      </button>
    </div>

    <div className="mt-9 sm:mb-5 flex flex-wrap justify-center gap-5 sm:gap-10">
      {filteredAssets.length === 0 ? (
        <div className="mt-10 text-2xl text-center text-white tracking-widest">
          Aucun asset trouvé
        </div>
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
        <div className="relative w-[600px] p-5 bg-white rounded-lg shadow-lg">
          <form
            onSubmit={handleCreateCommands}
            className="flex flex-col gap-2"
          >
            <p className="text-xl font-bold text-center tracking-widest title">
              Commander un service personnalisé
            </p>

            <select
              name="categoryCommande"
              value={formCommande.categoryCommande}
              onChange={handleChange}
              className="mt-3 w-36 sm:w-72 h-10 mx-auto text-sm sm:text-base font-bold text-black bg-white border-2 border-black rounded-md tracking-widest focus:border-purple hover:scale-105 transition-all duration-300"
            >
              <option value="">Choisissez un domaine</option>
              {categories.map((categorie) => (
                <option key={categorie.id_categorie} value={categorie.nom}>
                  {categorie.nom}
                </option>
              ))}
            </select>

            <textarea
              name="description"
              value={formCommande.description}
              onChange={handleChange}
              placeholder="Décrivez votre demande"
              className="mt-2 h-24 w-[430px] mx-auto p-2 text-black bg-white border-2 border-black rounded-lg"
            />

            <button
              type="submit"
              className="mt-2 w-72 h-12 mx-auto font-bold text-white bg-black rounded-md tracking-widest hover:scale-105 transition-all duration-300"
            >
              Confirmer votre demande
            </button>

            {commandAccept && (
              <p className="text-center text-green-500">
                Votre demande a bien été envoyée sur le discord !
              </p>
            )}
            <p className="text-center text-[10px] tracking-wider">
              *Un canal privé sera créé sur le discord, un membre de l'équipe vous
              répondra dans les plus brefs délais.
            </p>
          </form>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setCommandAccept(false);
            }}
            className="absolute top-[-12px] right-[-12px] text-2xl font-bold text-black rounded-full hover:scale-110 hover:rotate-180 transition duration-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-8 text-white bg-black rounded-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>
      </div>
    )}

    </>
     
  );
}
