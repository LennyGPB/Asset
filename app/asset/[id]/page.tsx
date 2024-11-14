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

        const mediaUrls = data.asset.medias.map((media: { media: { url: string } }) => media.media.url);
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

  // Tri des médias avec gestion des vidéos YouTube en premier
  const sortedMedias = [
    ...medias.filter((media) => typeof media === "string" && (media.includes("youtu.be") || media.includes("www.youtube.com"))),
    ...medias.filter((media) => typeof media === "string" && !media.includes("youtu.be")),
  ];

  // Fonction pour aller à l'image ou vidéo suivante
  const nextSlide = () => {
    setCurrentIndex((currentIndex) =>
      currentIndex === sortedMedias.length - 1 ? 0 : currentIndex + 1
    );
  };

  // Fonction pour aller à l'image ou vidéo précédente
  const prevSlide = () => {
    setCurrentIndex((currentIndex) =>
      currentIndex === 0 ? sortedMedias.length - 1 : currentIndex - 1
    );
  };

  // Vérifie si le média actuel est une vidéo YouTube
  const isYouTubeVideo =
  sortedMedias[currentIndex] &&
  (sortedMedias[currentIndex].includes("youtu.be") || sortedMedias[currentIndex].includes("www.youtube.com"));

  const iframeUrl = isYouTubeVideo
  ? sortedMedias[currentIndex]
      .replace("youtu.be/", "youtube.com/embed/")
      .replace("watch?v=", "embed/")
  : "";

  if (!asset) {
    return <div>Asset non trouvée</div>; 
  }

  const handleBuyAsset = async () => {
    if (!userId) {
      alert("User ID is missing. Please log in.");
      return;
    }
    const response = await fetch('https://asset-three.vercel.app/api/stripe/buyAsset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assetId: id, userId: userId }),
    });
  
    if (response.ok) {
      const data = await response.json();
      window.location.href = data.url;
    } else {
      console.error('Erreur lors de l’achat de l’asset');
    }
  };
  

  return (
    <>
      <Navbar />

      <div className="relative flex flex-wrap justify-center mt-10 gap-5 z-10">
        <div className="relative w-[345px] sm:w-[700px] h-96 rounded-lg border border-white overflow-hidden">
          {/* Vérifie s'il y a des médias à afficher */}
          {sortedMedias.length > 0 ? (
            <>
              {/* Bouton précédent */}
              <button
                type="button"
                className="absolute top-1/2 left-0 z-10 transform -translate-y-1/2 bg-white/30 text-white p-2 m-2 rounded-full"
                onClick={prevSlide}
              >
                &#10094;
              </button>

              {/* Affiche le média actuel : vidéo ou image */}
              {isYouTubeVideo ? (
                <iframe
                  src={iframeUrl}
                  title={`Video ${currentIndex + 1}`}
                  className="w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <Image
                  src={sortedMedias[currentIndex]}
                  alt={`Image ${currentIndex + 1}`}
                  width={700}
                  height={300}
                  className="rounded-lg object-cover w-full h-full"
                />
              )}

              {/* Bouton suivant */}
              <button
                type="button"
                className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2 bg-white/30 text-white p-2 m-2 rounded-full"
                onClick={nextSlide}
              >
                &#10095;
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white bg-gray-700">
              <p>Aucun média disponible</p>
            </div>
          )}
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
                  className="absolute bottom-40 sm:bottom-56 tracking-widest button p-2 rounded-lg text-white font-bold uppercase hover:scale-105 transition duration-300"
                >
                  Acheter cet asset
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
              <p className="flex p-1 pl-1 items-center gap-2 w-20 bg-white rounded-lg tracking-wide font-bold text-center">
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M19.5399 12.5799L12.4999 19.7499L5.42993 12.5499C3.83993 10.9399 3.84993 8.06994 5.44993 6.46994C7.04993 4.86994 9.65993 4.85994 11.2699 6.44994L11.3099 6.48994C11.7299 6.90994 12.0399 7.40994 12.2299 7.93994C12.4199 8.39994 12.4999 8.54994 12.4999 8.54994C12.4999 8.54994 12.5799 8.40994 12.7599 7.93994C12.9699 7.39994 13.2799 6.89994 13.7099 6.45994C15.3199 4.84994 17.9399 4.84994 19.5499 6.45994C21.1599 8.06994 21.1599 10.9499 19.5499 12.5599L19.5399 12.5799Z" fill="#121331" stroke="#121331" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {asset.likes}
              </p>

              <p className="flex p-1 pl-1 items-center gap-2 w-20 bg-white rounded-lg tracking-wide font-bold text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fill-rule="evenodd" d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V10.5Z" clip-rule="evenodd" />
              </svg>
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
      <Meteors number={30} className="z-0" />
    </>
  );
}
