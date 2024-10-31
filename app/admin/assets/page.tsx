"use client";

import AdminCard from "@/components/shared/admin/AdminCard";
import AdminHeader from "@/components/shared/admin/AdminHeader";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Asset {
  id_asset: number;
  image_couverture: string | null;
  file_url: string | null;
  titre: string;
  prix: number;
  description: string;
  likes: number;
  categorie: {
    id_categorie: number;
    nom: string;
  };
}

export default function Admin() {
  const [categories, setCategories] = useState<Array<{ id_categorie: string; nom: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]); // Pour les assets filtrés

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // Fetch all assets on mount
  useEffect(() => {
    fetch("/api/assets/assets")
      .then((res) => res.json())
      .then((data) => setAssets(data.assets || []));
  }, []);

  // Filtrer les assets en fonction de la catégorie sélectionnée
  useEffect(() => {
    if (selectedCategory) {
      const filtered = assets.filter(
        (asset) => asset.categorie.id_categorie === Number(selectedCategory)
      );
      setFilteredAssets(filtered);
    } else {
      setFilteredAssets(assets); // Si aucune catégorie n'est sélectionnée, on affiche tous les assets
    }
  }, [selectedCategory, assets]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <>
      <AdminHeader />
      <div className="flex flex-wrap justify-center gap-5 mt-8">
        <select
          className="bg-white tracking-widest w-52 h-11 text-black border-2 border-black rounded-lg focus:border-purple"
          onChange={handleCategoryChange}
        >
          <option value="">Catégories</option>
          {categories.map((categorie) => (
            <option key={categorie.id_categorie} value={categorie.id_categorie}>
              {categorie.nom}
            </option>
          ))}
        </select>
        <Link href="/formAsset" className="bg-white text-center p-2 border-2 w-56 rounded-lg tracking-widest border-neutral-500 hover:scale-105 transition-all duration-300">Ajouter un asset</Link>
      </div>

      <div className="flex justify-center flex-wrap gap-10 mt-8 sm:mb-10">
        {filteredAssets.length > 0 ? (
          filteredAssets.map((asset) => (
            <AdminCard
              key={asset.id_asset}
              id={asset.id_asset}
              titre={asset.titre}
              prix={asset.prix}
              description={asset.description}
              lienImage={asset.image_couverture || ""}
              likes={asset.likes}
            />
          ))
        ) : (
          <p>Aucun asset trouvé.</p>
        )}
      </div>
    </>
  );
}
