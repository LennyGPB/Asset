"use client";

import Navbar from "../../components/shared/Navbar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Meteors from "@/components/magicui/meteors";
import ScrollTextEffectOne from "@/components/shared/ScrollTextEffectOne";
import Footer from "@/components/shared/Footer";

interface Categorie {
  id_categorie: number;
  nom: string;
}

interface Tags {
  id_tags: number;
  categorieId: number;
  nom: string;
}

export default function FormAsset() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [tags, setTags] = useState<Tags[]>([]);
  const [tagsFilter, setTagsFilter] = useState<Tags[]>([]);
  const { data: session } = useSession();

  type FormDataType = {
    titre: string;
    description: string;
    prix: string;
    slogan: string;
    categorieId: string;
    tagIds: string[];
    userId: number;
    urlYoutube: string;
    coverImage: File | null;
    assetFile: File | null;
    additionalFiles: File[];
  };

  const [formData, setFormData] = useState<FormDataType>({
    titre: "",
    description: "",
    prix: "",
    slogan: "",
    categorieId: "",
    tagIds: ["", "", ""],
    urlYoutube: "",
    userId: session ? Number.parseInt(session.user.id) : 0,
    coverImage: null,
    assetFile: null,
    additionalFiles: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetch("/api/categories/categories"),
          fetch("/api/tags/tags"),
        ]);

        const categoriesData = await categoriesResponse.json();
        const tagsData = await tagsResponse.json();

        setCategories(categoriesData);
        setTags(tagsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (session) {
      setFormData((prevData) => ({
        ...prevData,
        userId: Number.parseInt(session.user.id),
      }));
    }
  }, [session]);

  useEffect(() => {
    if (formData.categorieId) {
      const filterTags = tags.filter(
        (tag) => Number(tag.categorieId) === parseInt(formData.categorieId)
      );
      setTagsFilter(filterTags);
    }
  }, [formData.categorieId, tags]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target; 
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value, 
    }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; // Récupérer les fichiers sélectionnés

    if (files && files.length > 0) {
      const selectedFile = files[0];
      // Vérifiez si le fichier est déjà enregistré
      if (formData.coverImage !== selectedFile) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          coverImage: selectedFile, // Utiliser le premier fichier pour coverImage
        }));
      }
    }
  };

  const handleAdditionalFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files; // Récupérer les fichiers sélectionnés

    if (files) {
      const newFiles = Array.from(files); // Convertir la FileList en tableau
      setFormData((prevFormData) => ({
        ...prevFormData,
        additionalFiles: prevFormData.additionalFiles
          .concat(newFiles)
          .slice(0, 5), // Limiter à 5 fichiers
      }));
    }
  };

  const handleTagChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const value = e.target.value;

    setFormData((prevFormData) => {
      const updatedTagIDs = [...prevFormData.tagIds]; // Créer une copie du tableau
      updatedTagIDs[index] = value; // Mettre à jour l'ID du tag sélectionné à l'index correct

      return {
        ...prevFormData,
        tagIds: updatedTagIDs,
      };
    });
  };

  const handleAssetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Récupérer le premier fichier sélectionné
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        assetFile: file, // Mettre à jour l'objet avec le fichier
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData(e.currentTarget);
    console.log("formDataToSend", formDataToSend);

    // Ajoutez manuellement les fichiers au FormData
    if (formData.coverImage) {
      formDataToSend.delete("coverImage"); // S'assurer qu'il n'y a pas de doublon
      formDataToSend.append("coverImage", formData.coverImage);
    }

    if (formData.assetFile) {
      formDataToSend.delete("assetFile");
      formDataToSend.append("assetFile", formData.assetFile);
    }

    if (formData.additionalFiles && formData.additionalFiles.length > 0) {
      formDataToSend.delete("additionalFiles");
      for (const file of formData.additionalFiles) {
        formDataToSend.append("additionalFiles", file); // Ajoute chaque fichier au FormData
      }
    }
    const tagIdsString = formData.tagIds.join(",");
    formDataToSend.append("tagIds", tagIdsString);

    formDataToSend.append("userId", formData.userId.toString());

    try {
      const response = await fetch("/api/assets/createAsset", {
        method: "POST",
        body: formDataToSend,
      });

      const textResponse = await response.text();
      console.log(textResponse);

      if (!response.ok) {
        throw new Error(textResponse);
      }

      const result = JSON.parse(textResponse);
      console.log("Asset créé avec succès !", result.asset);
    } catch (error) {
      console.error("Erreur lors de la création de l'asset :", error);
    }
  };



  return (
    <>
      <Navbar />
      <ScrollTextEffectOne text={"Créer son Asset - "} size="3xl mt-7 sm:mt-0" />

      <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data">
        <div className="mx-auto flex justify-center text-white p-7 rounded-lg sm:w-[900px] ">
            <div className="flex flex-col sm:items-stretch items-center">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-20 justify-between mt-5">
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                className="bg-black text-white h-10 w-80 rounded-md px-2 placeholder:text-white"
                placeholder="Nom de l'Asset"
              />

              
              <div className="flex sm:flex-row sm:gap-20 gap-2">
                <select name="categorieId" value={formData.categorieId} onChange={handleChange} className="bg-black text-white h-10 w-[227px] sm:w-60 rounded-md px-2">
                  <option value="" disabled hidden> Catégorie </option>
                  {categories.map((category) => (
                    <option
                      key={category.id_categorie}
                      value={category.id_categorie}
                    >
                      {category.nom}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  className="bg-black text-white h-10 w-24 rounded-md  px-2 placeholder:text-white"
                  placeholder="Prix"
                />
              </div>
            </div>

            <input
              type="text"
              name="slogan"
              value={formData.slogan}
              onChange={handleChange}
              className="bg-black text-white h-8 w-full mt-5 rounded-md  px-2 placeholder:text-white"
              placeholder="Slogan"
            />

            <input
              type="text"
              name="urlYoutube"
              value={formData.urlYoutube}
              onChange={handleChange}
              className="bg-black text-white h-8 w-full mt-5 rounded-md  px-2 placeholder:text-white"
              placeholder="URL Youtube (facultatif)"
            />

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-black text-white h-40 w-full mt-5 rounded-md px-2 placeholder:text-white"
              placeholder="Description détaillée du produit..."
            />

            <p className="font-bold text-lg tracking-widest mt-5">
              Choisissez jusqu'à 3 tags
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-3">
              <select
                value={formData.tagIds[0]}
                onChange={(e) => handleTagChange(e, 0)}
                className="bg-black text-white h-10 w-40 rounded-md  px-2"
              >
                <option value="" disabled hidden>
                  Tag #1
                </option>
                {tagsFilter.map((tag) => (
                  <option key={tag.id_tags} value={tag.id_tags}>
                    {tag.nom}
                  </option>
                ))}
              </select>

              <select
                value={formData.tagIds[1]}
                onChange={(e) => handleTagChange(e, 1)}
                className="bg-black text-white h-10 w-40 rounded-md  px-2"
              >
                <option value="" disabled hidden>
                  Tag #2
                </option>
                {tagsFilter.map((tag) => (
                  <option key={tag.id_tags} value={tag.id_tags}>
                    {tag.nom}
                  </option>
                ))}
              </select>

              <select
                value={formData.tagIds[2]}
                onChange={(e) => handleTagChange(e, 2)}
                className="bg-black text-white h-10 w-40 rounded-md  px-2"
              >
                <option value="" disabled hidden>
                  Tag #3
                </option>
                {tagsFilter.map((tag) => (
                  <option key={tag.id_tags} value={tag.id_tags}>
                    {tag.nom}
                  </option>
                ))}
              </select>
            </div>

            <p className="font-bold text-center sm:text-left text-lg tracking-widest mt-5">Importer votre image de couverture :</p>
            <div className="flex justify-center">
              <input name="coverImage" type="file" onChange={handleCoverImageChange} className="bg-black text-white h-10 w-96 mt-3 rounded-md  px-2" />
            </div>

            <p className="font-bold text-lg tracking-widest mt-5">Importer vos images :</p>
            <div className="flex justify-center gap-2 flex-wrap">
              <input
                name="additionalFiles"
                onChange={(e) => handleAdditionalFilesChange(e)}
                type="file"
                className="bg-black text-white h-10 w-60 mt-3 rounded-md px-2 placeholder:text-white"
              />

              <input
                name="additionalFiles"
                onChange={(e) => handleAdditionalFilesChange(e)}
                type="file"
                className="bg-black text-white h-10 w-60 mt-3 rounded-md  px-2 placeholder:text-white"
              />

              <input
                name="additionalFiles"
                onChange={(e) => handleAdditionalFilesChange(e)}
                type="file"
                className="bg-black text-white h-10 w-60 mt-3 rounded-md  px-2 placeholder:text-white"
              />

              <input
                name="additionalFiles"
                onChange={(e) => handleAdditionalFilesChange(e)}
                type="file"
                className="bg-black text-white h-10 w-60 mt-3 rounded-md  px-2 placeholder:text-white"
              />

              <input
                name="additionalFiles"
                onChange={(e) => handleAdditionalFilesChange(e)}
                type="file"
                className="bg-black text-white h-10 w-60 mt-3 rounded-md  px-2 placeholder:text-white"
              />

              <input
                name="additionalFiles"
                onChange={(e) => handleAdditionalFilesChange(e)}
                type="file"
                className="bg-black text-white h-10 w-60 mt-3 rounded-md  px-2 placeholder:text-white"
              />
            </div>

            <p className="font-bold text-lg tracking-widest mt-5">Importer votre dossier :</p>

            <div className="flex justify-center">
              <input
                name="assetFile"
                onChange={handleAssetFileChange}
                type="file"
                className="bg-black text-white h-10 rounded-md w-96 mt-3   px-2 placeholder:text-white"
              />
            </div>
            <button type="submit" className="button text-white font-bold tracking-widest mx-auto h-10 w-60 mt-5 rounded-lg uppercase px-2 hover:scale-105 transition-all duration-500">Confirmer</button>
          </div>
        </div>

        <div className="mx-auto flex justify-center bg-white rounded-lg w-[900px] my-3">
          <div className="flex flex-col">
          </div>
        </div>
      </form>
      <Meteors number={70} />
    </>
  );
}
