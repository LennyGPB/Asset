"use client";

import AdminHeader from "@/components/shared/admin/AdminHeader";
import { useEffect, useState } from "react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Array<{ id_categorie: string; nom: string }>>([]);
  const [tags, setTags] = useState<Array<{ id_tags: string; nom: string; categorieId: number }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour gérer l'ouverture de la modal
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false); // État pour gérer l'ouverture de la modal
  const [selectedCategory, setSelectedCategory] = useState<{ id_categorie: string; nom: string } | null>(null); // Catégorie sélectionnée
  const [selectedTags, setSelectedTags] = useState<Array<{ id_tags: string; nom: string; categorieId: number }>>([]);
  const [selectedIdTag, setSelectedIdTag] = useState<number | null>(null);
  const [formData, setFormData] = useState<{ id_categorie: number; nom: string } | null>(null); 
  const [formDataCreate, setFormDataCreate] = useState<{ nom: string } | null>(null); 
  const [formDataTag, setFormDataTag] = useState<{ nom: string; categorieId?: number } | null>(null); 
  const [isModalTagOpen, setIsModalTagOpen] = useState(false); // État pour gérer l'ouverture de la modal


  useEffect(() => {
    fetch("/api/categories/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    fetch("/api/tags/tags")
      .then((res) => res.json())
      .then((data) => setTags(data));
  }, []);

  const openModal = (category: { id_categorie: string; nom: string }) => {
    setSelectedCategory(category); // Met à jour la catégorie sélectionnée
    setIsModalOpen(true); // Ouvre la modal
    setSelectedTags(tags.filter(tag => tag.categorieId === Number(category.id_categorie)));
  };

  const openModalTag = (tag: { id_tag: number; }) => {
    setSelectedIdTag(tag.id_tag);
    console.log(selectedIdTag);
    setIsModalTagOpen(true); // Ouvre la modal
  };

  const handleUpdateCategorie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target; // Récupérer la valeur de l'input
    setFormData((prevFormData) => ({
      ...prevFormData,
      id_categorie: Number(selectedCategory?.id_categorie),
      nom: value,
    }));
  };

  const handleCreateCategorie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target; // Récupérer la valeur de l'input
    setFormDataCreate((prevFormData) => ({
      ...prevFormData,
      nom: value,
    }));
  };

  const handleCreateTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target; // Récupérer la valeur de l'input
    setFormDataTag((prevFormData) => ({
      ...prevFormData,
      nom: value,
      categorieId: Number(selectedCategory?.id_categorie),
    }));
  };

  const handleUpdateTag = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target; // Récupérer la valeur de l'input
    setFormDataTag((prevFormData) => ({
      ...prevFormData,
      nom: value,
    }));
  };

  const handleSubmitDeleteTag = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      const response = await fetch(`/api/tags/deleteTag`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_tags: selectedIdTag }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }

      const result = await response.json();
      console.log("Tag deleted successfully:", result);
      setIsModalTagOpen(false);
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  }
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;
    
    try {
        const response = await fetch(`/api/categories/updateCategorie/${formData.id_categorie}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom: formData.nom }),
      });

      if (!response.ok) {
        throw new Error("Failed to update categorie");
      }

      const result = await response.json();
      setIsModalOpen(false);
      console.log("Categorie updated successfully:", result);
    } catch (error) {
      console.error("Error updating categorie:", error);
    }
  };

  const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formDataCreate) return;
    
    try {
        const response = await fetch(`/api/categories/createCategorie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom: formDataCreate.nom }),
      });

      if (!response.ok) {
        throw new Error("Failed to create categorie");
      }

      const result = await response.json();
      console.log("Categorie created successfully:", result);
      setIsModalCreateOpen(false);
    } catch (error) {
      console.error("Error creating categorie:", error);
    }
  };

  const handleSubmitTag = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formDataTag) return;
    
    try {
        const response = await fetch(`/api/tags/createTag`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom: formDataTag.nom, categorieId: formDataTag.categorieId || selectedCategory?.id_categorie }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tag");
      }

      const result = await response.json();
      console.log("Tag created successfully:", result);
      setIsModalOpen(false);
      setFormDataTag(null);
    } catch (error) {
      console.error("Error creating tag:", error);
    }
  };

  const handleSubmitTagUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formDataTag) return;
    
    try {
          const response = await fetch(`/api/tags/updateTag/${selectedIdTag}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nom: formDataTag.nom }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tag");
      }

      const result = await response.json();
      setIsModalTagOpen(false);
      console.log("Tag updated successfully:", result);
    } catch (error) {
      console.error("Error updating tag:", error);
    }
  };
 

  return (
    <>
      <AdminHeader />

      <button onClick={() => setIsModalCreateOpen(true)} className="bg-white w-64 text-black p-2 rounded-lg text-center flex justify-center items-center mx-auto mt-8 tracking-widest font-bold hover:scale-105 transition-all duration-500">Créer une catégorie</button>


      <div className="flex justify-center flex-wrap gap-5 mt-8">
        {categories.map((category) => (
          <button
            key={category.id_categorie}
            type="button"
            onClick={() => openModal(category)} 
            className="w-56 border-2 border-gray-300 text-white uppercase p-2 rounded-lg text-center tracking-widest hover:bg-white hover:text-black transition-all duration-500">
            {category.nom}
          </button>
        ))}
      </div>

      {/* Modal - modification de la catégorie */} 
      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50  flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
          <div className="relative bg-white w-[600px] border-2 border-black flex flex-col items-center p-5 rounded-lg shadow-lg">
            <div className="flex gap-2">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Modifier la categorie"
                  value={formData?.nom || selectedCategory.nom}
                  onChange={handleUpdateCategorie}
                  className="h-8 w-72 bg-black text-white p-2 rounded-lg border-2 border-gray-300"
                />
                <button
                  type="submit"

                  className="button bg-blue-500 text-white p-2 w-72 rounded-lg text-center tracking-widest font-bold hover:scale-105 transition-all duration-500">
                  Modifier la catégorie
                </button>
              </div>
              </form>

              <form onSubmit={handleSubmitTag}>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Créer un nouveau tag"
                    value={formDataTag?.nom}
                    onChange={handleCreateTag}
                    className="h-8 w-72 bg-black text-white p-2 rounded-lg border-2 border-gray-300"
                  />
                  <button
                    type="submit"
                    className="button bg-blue-500 text-white p-2 w-72 rounded-lg text-center tracking-widest font-bold hover:scale-105 transition-all duration-500">
                    Créer le tag
                  </button>
                </div>
              </form>
            </div>
            
            <p className="text-center text-black text-lg mt-5 font-bold uppercase tracking-widest">Les tags liés :</p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              {selectedTags.map((tag) => (
                <button
                  key={tag.id_tags}
                  type="button"
                  onClick={() => openModalTag({ id_tag: Number(tag.id_tags) })}
                  className="bg-black text-white w-32 p-2 rounded-lg text-center tracking-widest font-bold hover:scale-105 transition-all duration-500">
                  {tag.nom}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)} // Ferme la modal
              className="absolute top-[-12px] right-[-12px] text-black font-bold rounded-full text-2xl hover:scale-110 hover:rotate-180 transition duration-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8 text-white bg-black rounded-full">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            </button>
          </div>
        </div>
      )}

       {/* Modal - Gestion des tags */} 
       {isModalTagOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
          <div className="relative bg-white w-80 p-5 rounded-lg shadow-lg">
            <form onSubmit={handleSubmitTagUpdate} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Modifier le tag"
                onChange={handleUpdateTag}
                className="h-8 w-72 bg-black text-white p-2 rounded-lg border-2 border-gray-300"
              />
              <button
                type="submit"
                className="button bg-blue-500 text-white p-2 w-72 rounded-lg text-center tracking-widest font-bold hover:scale-105 transition-all duration-500"
              >
                Confirmer la modification
              </button>
            </form>
            <form onSubmit={handleSubmitDeleteTag}>
              <button
                type="submit"
                className="bg-red-500 text-white p-2 w-72 mt-2 rounded-lg text-center tracking-widest font-bold hover:scale-105 transition-all duration-500"
              >
                Supprimer le tag
              </button>
            </form>
            <button
              type="button"
              onClick={() => setIsModalTagOpen(false)} // Ferme la modal
              className="absolute top-[-12px] right-[-12px] text-black font-bold rounded-full text-2xl hover:scale-110 hover:rotate-180 transition duration-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8 text-white bg-black rounded-full">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modal - création de la catégorie */} 
      {isModalCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
          <div className="relative bg-white w-80 p-5 rounded-lg shadow-lg">
            <form onSubmit={handleSubmitCreate} className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Créer une catégorie"
                value={formDataCreate?.nom}
                onChange={handleCreateCategorie}
                className="h-8 w-72 bg-black text-white p-2 rounded-lg border-2 border-gray-300"
              />
              <button
                type="submit"
                className="button bg-blue-500 text-white p-2 w-72 rounded-lg text-center tracking-widest font-bold hover:scale-105 transition-all duration-500"
              >
                Confirmer la création
              </button>
            </form>
            <button
              type="button"
              onClick={() => setIsModalCreateOpen(false)} // Ferme la modal
              className="absolute top-[-12px] right-[-12px] text-black font-bold rounded-full text-2xl"
            >
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
