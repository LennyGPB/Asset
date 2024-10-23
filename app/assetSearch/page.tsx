"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Card from '@/components/shared/Card';
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
          const res = await fetch(`/api/searchAsset?query=${query}`);
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
      <h2 className="text-white text-center text-4xl mt-10 tracking-widest uppercase">
        Résultat de la recherche 
      </h2>
      <div className="flex flex-wrap justify-center sm:gap-7">
        {assets.length === 0 ? (
          <div>Aucun asset trouvé pour la recherche "{query}"</div>
        ) : (
          assets.map((asset) => (
            <Card
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
