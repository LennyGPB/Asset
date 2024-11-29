"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Cardv2 from "@/components/shared/Cardv2";
import Navbar from '@/components/shared/Navbar';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') ?? ''; // Récupère le query de l'URL
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      if (query) {
        try {
          const res = await fetch(`/api/assets/searchAsset?query=${query}`);
          const data = await res.json();
          setAssets(data);
        } catch (error) {
          console.error('Erreur lors de la récupération des assets', error);
        }
        setLoading(false);
      }
    };

    fetchAssets();
  }, [query]);

  if (loading) {
    return <div>Chargement des résultats...</div>;
  }

  return (
    <>
      <Navbar />
      <h2 className="title tracking-[8px] text-white text-center p-1 sm:p-0 text-3xl sm:text-4xl mt-20 sm:mt-10 uppercase">
        Résultat de la recherche 
      </h2>
      <div className="flex flex-wrap justify-center mt-7 sm:gap-7">
        {assets.length === 0 ? (
          <div><p className='text-white/50 mt-3 title text-center tracking-widest'>Aucun asset trouvé pour la recherche "{query}"</p></div>
        ) : (
          assets.map((asset) => (
            <Cardv2
              key={asset.id_asset}
              lienImage={asset.image_couverture ?? ''}
              titre={asset.titre}
              prix={asset.prix}
              description={asset.description}
              likes={asset.likes}
              id={asset.id_asset}
            />
          ))
        )}
      </div>
    </>
  );
}

export default function SearchResults() {
  return (
    <Suspense fallback={<div>Chargement en cours...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
