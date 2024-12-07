"use client";

import Image from "next/image";
import Navbar from "../../../components/shared/Navbar";
import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Meteors from "@/components/magicui/meteors";
import { useSession } from "next-auth/react";
import Footer from "@/components/shared/Footer";

interface Asset {
  id: string;
  titre: string;
  slogan: string;
  prix: number;
  description: string;
  created_at: Date;
  updated_at: Date;
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
  const [buyLoading, setBuyLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState("Acheter cet asset");
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

  const options: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };
  const postDate = new Intl.DateTimeFormat("fr-FR", options).format(asset?.created_at);
  const updateDate = new Intl.DateTimeFormat("fr-FR", options).format(asset?.updated_at);
  
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
      window.location.href = "/api/auth/signin";
    }

    setBuyLoading(true);

    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/buyAsset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assetId: id, userId: userId }),
      });
    
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else if (response.status === 401) {
        window.location.href = "/api/auth/signin";
      }
      else{
        console.error('Erreur lors de l’achat de l’asset');
      }
    } catch (error) {
      console.error(error);
    }
    finally {
      setBuyLoading(false);
      setMessageLoading("Redirection en cours...");
      setTimeout(() => setMessageLoading("Acheter cet asset"), 10000);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="relative flex flex-wrap justify-center mt-16 sm:mt-10 gap-5 z-10">
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
                {asset.titre.length > 19 ? `${asset.titre.slice(0, 19)}...` : asset.titre}
              </p>
                <p className="text-center sm:w-80 text-sm tracking-wide mt-2 px-3 break-words"> 
                  {asset.slogan.length > 110 ? `${asset.slogan.slice(0, 110)}...` : asset.slogan}  
                </p>

              <div className=" flex justify-center ">
                <button
                  onClick={handleBuyAsset}
                  type="button"
                  className="absolute bottom-[203px] sm:bottom-56 tracking-widest button p-2 rounded-lg text-white font-bold uppercase hover:scale-105 transition duration-300"
                >
                   {messageLoading}
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-9 ml-1">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.902 7.098a3.75 3.75 0 0 1 3.903-.884.75.75 0 1 0 .498-1.415A5.25 5.25 0 0 0 8.005 9.75H7.5a.75.75 0 0 0 0 1.5h.054a5.281 5.281 0 0 0 0 1.5H7.5a.75.75 0 0 0 0 1.5h.505a5.25 5.25 0 0 0 6.494 2.701.75.75 0 1 0-.498-1.415 3.75 3.75 0 0 1-4.252-1.286h3.001a.75.75 0 0 0 0-1.5H9.075a3.77 3.77 0 0 1 0-1.5h3.675a.75.75 0 0 0 0-1.5h-3c.105-.14.221-.274.348-.402Z" clip-rule="evenodd" />
            </svg>
              <p className="p-2 tracking-wide font-bold">{asset.prix} €</p>
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
              
            
            </div>

            <p className="hidden sm:block rounded-lg sm:mt-10 text-white uppercase tracking-wide">
             <span className="font-bold">Post :</span> {postDate} - - <span className="font-bold">Update :</span> {updateDate}
            </p>
            <p className="sm:hidden rounded-lg mt-4 text-white uppercase tracking-wide">
            <span className="font-bold">Post :</span> {postDate} - - <span className="font-bold">Update :</span> {updateDate}
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
      <Meteors number={30}  />
    </>
  );
}
