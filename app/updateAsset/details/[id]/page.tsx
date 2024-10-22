"use client";

import Navbar from "@/components/shared/Navbar";
import UpdateHeader from "@/components/shared/updateAsset/updateHeader";
import { Asset } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Categorie {
  id_categorie: number;
  nom: string;
}

interface Tags {
  id_tags: number;
  categorieId: number;
  nom: string;
}

export default function UpdateAssetDetails({params}: {params: {id: string}}) {
  const id = Number.parseInt(params.id);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { data: session } = useSession();

  type FormDataType = {
    titre: string;
    description: string;
    prix: number;
    slogan: string;
    userId: number;
  };

  const [formData, setFormData] = useState<FormDataType>({
    titre: "",
    description: "",
    prix: 0,
    slogan: "",
    userId: 0,
  });

  useEffect(() => {
    const fetchAsset = async () => {
      const response = await fetch(`/api/assets/asset/${id}`);
      const data = await response.json();
      const asset = data.asset;
      setAsset(asset);
      console.log(asset);
    };
    fetchAsset();
  }, [id]);

  useEffect(() => {
    if (asset) {
      setFormData({
        titre: asset.titre || "",
        description: asset.description || "",
        prix: Number(asset.prix) || 0,
        slogan: asset.slogan || "",
        userId: asset.userId || 0,
      });
      console.log(formData);
    }
  }, [asset]);


  useEffect(() => {
    if (session) {
      setFormData((prevData) => ({
        ...prevData,
        userId: Number.parseInt(session.user.id),
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target; // Extraire le nom et la valeur de l'élément
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, // Mettre à jour la propriété correspondante (tag1, tag2, etc.)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSubmit = {
      titre: formData.titre,
      description: formData.description,
      prix: formData.prix,
      slogan: formData.slogan,
      userId: formData.userId,
    };

    try {
      const response = await fetch(`/api/assets/updateAsset/details/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Ajout de l'en-tête Content-Type
        },
        body: JSON.stringify(formDataToSubmit),
      });

      const textResponse = await response.text();
      
      setIsSubmitted(true);
      if (!response.ok) {
        throw new Error(textResponse);
      }

      const result = JSON.parse(textResponse);
      console.log("Asset modifié avec succès !", result.asset);
    } catch (error) {
      console.error("Erreur lors de la modification de l'asset :", error);
    }
  };

  return (
    <>
      
      <UpdateHeader id={id} />
      <p className="text-center uppercase text-white text-2xl font-bold tracking-widest mt-8">Modifier les informations de l'asset</p>

      <form onSubmit={handleSubmit} method="PUT">
        <div className="mx-auto flex justify-center text-white  px-7 rounded-lg w-[900px] ">
          <div className="flex flex-col">
          <div className="flex gap-20 justify-between mt-5">
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                className="bg-black text-white h-10 w-80 rounded-lg border border-white px-2 tracking-widest placeholder:text-white"
                placeholder={formData.titre}
              />


              <input
                type="text"
                name="prix"
                value={formData.prix}
                onChange={handleChange}
                className="bg-black text-white h-10 w-24 rounded-lg border border-white px-2 tracking-widest placeholder:text-white"
                placeholder="Prix"
              />
            </div>

            <input
              type="text"
              name="slogan"
              value={formData.slogan}
              onChange={handleChange}
              className="bg-black text-white h-8 w-full mt-5 rounded-lg border border-white px-2 tracking-widest placeholder:text-white"
              placeholder="Slogan"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-black text-white h-40 w-full mt-5 tracking-wider rounded-lg border border-white px-2 placeholder:text-white"
              placeholder="Description détaillée du produit..."
            />

         
            <button type="submit" className="button text-white font-bold tracking-widest mx-auto h-10 w-60 mt-5 rounded-lg uppercase px-2 hover:scale-105 transition-all duration-500">Confirmer</button>
            {isSubmitted && <p className="bg-green-500 p-2 text-white font-bold  mx-auto h-10 w-80  mt-5 rounded-lg tracking-widest uppercase ">Asset modifié avec succès !</p>}
          </div>
        </div>
      </form>
    </>
  );
}
