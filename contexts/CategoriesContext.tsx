import React, { createContext, useContext, useState, useEffect } from 'react';

// Type des catégories
type Category = {
  id_categorie: string;
  nom: string;
};

// Type du contexte
type CategoriesContextType = {
  categories: Category[];
};

// Création du contexte
const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
});

// Fournisseur de contexte pour les catégories
export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Récupère les catégories depuis l'API
    fetch("/api/categories/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};

// Hook pour utiliser le contexte dans d'autres composants
export const useCategories = () => {
  return useContext(CategoriesContext);
};
