"use client";

import Image from "next/image";
import Navbar from "../../../components/shared/Navbar";
import Card from "../../../components/shared/Card";
import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Meteors from "@/components/magicui/meteors";
import { useSession } from "next-auth/react";
interface Asset {
  id: string;
  titre: string;
  slogan: string;
  prix: number;
  description: string;
  created_at: string;
  likes: number;
  nb_dl: number;
  categorie: { nom: string; };
  tags: { tag: { nom: string; }; }[];
  medias: Media[];
  user: { name: string; image: string; };
}

interface Media {
  url: string; 
}


export default function Asset() {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [asset, setAsset] = useState<Asset | null>(null);
  const [medias, setMedias] = useState<string[]>([]);
  const params = useParams();

  if (!params || !params.id) {
    return <div>Id is not defined</div>;
  }

  const { id } = params;

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await fetch(`/api/assets/asset/${id}`);

        if (!response.ok) {
          throw new Error(`Error fetching asset: ${response.statusText}`);
        }

        const data = await response.json();
        setAsset(data.asset);

        const mediaUrls = data.asset.medias.map((media: Media) => media.url);
        setMedias(mediaUrls);

      } catch (error) {
        console.error(error);
      }
    };

    fetchAsset();
  }, [id]);

  const dateAsset = asset ? new Date(asset.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fonction pour aller à l'image suivante
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === medias.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Fonction pour aller à l'image précédente
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? medias.length - 1 : prevIndex - 1
    );
  };

  if (!asset) {
    return <div>Asset non trouvée</div>; 
  }

  const handleBuyAsset = async () => {
    const response = await fetch('/api/stripe/buyAsset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assetId: asset.id, userId: userId }),
    });
  
    if (response.ok) {
      const data = await response.json();
      // Redirige vers l'URL de session Stripe Checkout
      window.location.href = data.url; 
    } else {
      console.error('Erreur lors de l’achat de l’asset');
    }
  };

  return (
    <>
      <Navbar />

    
      <div className="relative flex flex-wrap justify-center mt-10 gap-5">
        <div className="relative w-[345px] sm:w-[700px] h-96 rounded-lg border border-white overflow-hidden">
          {/* Bouton précédent */}
          <button
            type="button"
            className="absolute top-1/2 left-0 z-10 transform -translate-y-1/2 bg-white/30 text-white p-2 m-2 rounded-full"
            onClick={prevSlide}
          >
            &#10094;
          </button>

          {/* Image actuelle */}
          <Image
            src={medias[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            width={700}
            height={300}
            className="rounded-lg object-cover w-full h-full"
          />

          {/* Bouton suivant */}
          <button
            type="button"
            className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2 bg-white/30 text-white p-2 m-2 rounded-full"
            onClick={nextSlide}
          >
            &#10095;
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col ">
            <div className="bg-white rounded-md mx-auto w-[345px] sm:w-96 h-36 px-10">
              <p className="text-center text-2xl uppercase tracking-widest font-bold mt-2">
                {asset.titre}
              </p>
              <p className="text-center text-sm tracking-wide mt-1 px-3">
                {asset.slogan}
              </p>

              <div className=" flex justify-center ">
                <button
                  onClick={handleBuyAsset}
                  type="button"
                  className="absolute bottom-40 sm:bottom-56 tracking-widest button p-2 rounded-lg text-white font-bold uppercase"
                >
                  Acheter l'Asset
                </button>
              </div>
            </div>

            <div className="flex items-center mx-auto w-[345px] sm:w-96 bg-white mt-9 rounded-lg">
              <Image 
                src={asset.user.image} 
                alt={asset.user.name} 
                width={35} 
                height={35}
                className="rounded-full ml-1 w-8 h-8">
              </Image>
              <p className="p-2 tracking-wide">{asset.user.name}</p>
            </div>

            <div className="flex items-center mx-auto w-[345px] sm:w-96 bg-white mt-4 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-9 ml-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
              <p className="p-2 tracking-wide font-bold">{asset.prix}$</p>
            </div>

            <div className="flex mt-4 gap-2">
              <p className="flex justify-center gap-4 p-1 w-20 bg-white rounded-lg tracking-wide font-bold text-center">
                {asset.likes}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </p>
              <p className="p-1 w-20 bg-white rounded-lg tracking-wide font-bold text-center">
              {asset.nb_dl} 
              </p>
              <p className="sm:hidden rounded-lg mt-2 text-white uppercase tracking-wide font-bold">
                  Post : {asset.created_at}
              </p>
            </div>

            <p className="hidden sm:block rounded-lg sm:mt-10 text-white uppercase tracking-wide font-bold">
             Post : {asset.created_at}
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-center sm:text-left font-bold text-white tracking-widest uppercase text-3xl sm:ml-56">
        Description
      </h2>

      <p className="text-white text-center sm:text-left text-md px-4 sm:px-56 my-3 font-bold">
        {asset.description}
      </p>
      <Meteors number={30} />
    </>
  );
}
