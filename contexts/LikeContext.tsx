import { createContext, useContext, useState, ReactNode } from 'react';

// Type pour le contexte Likes
type LikesContextType = {
  likes: Record<number, boolean>; // Un objet où chaque ID d’asset a un statut de like
  toggleLike: (assetId: number) => void; // Fonction pour basculer le statut du like
};

// Créer le contexte des likes
const LikesContext = createContext<LikesContextType | undefined>(undefined); 

export const LikesProvider = ({ children }: { children: ReactNode }) => {
  const [likes, setLikes] = useState<Record<number, boolean>>({});

  // Fonction pour inverser le statut de like pour un asset
  const toggleLike = (assetId: number) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [assetId]: !prevLikes[assetId], // Inverse le statut de like pour l’ID de l’asset
    }));
  };

  return (
    <LikesContext.Provider value={{ likes, toggleLike }}>
      {children}
    </LikesContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte des likes
export const useLikes = () => {
  const context = useContext(LikesContext);
  if (!context) throw new Error('useLikes must be used within LikesProvider');
  return context;
};
