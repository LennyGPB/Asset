"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Card({ lienImage, titre, prix, description, id, likes}: {lienImage: string; titre: string; prix: number; description: string; id: number; likes: number;}) {
  const [like, setLike] = useState(likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = async () => {
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: id }),
      });
  
      if(isLiked){
        setLike(likes);
        setIsLiked(false);
      }else
      {
        setLike(likes + 1);
        setIsLiked(true);
      }

      const data = await response.json();

      if (response.ok) {
        console.log(data.message); // Affiche le message de succès
        // Mettez à jour l'état des likes ici si nécessaire
      } else {
        console.error(data.message); // Affiche le message d'erreur
        // Gérer les erreurs ici (par exemple, afficher un message à l'utilisateur)
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  
  
  return (
    <>
      <article className="relative flex flex-col gap-3 w-[350px] h-[450px] mt-10 sm:mb-10 rounded-xl bg-neutral-900 border border-neutral-500">
        <div className="absolute -top-2 left-2 w-[350px] h-[450px] rounded-xl bg-neutral-900 border border-neutral-500 z-[-1]"></div>


      <button type="button" className="flex gap-1 absolute top-5 left-5 hover:scale-110 transition-all duration-500" onClick={handleLikeToggle}>
        <p className="flex items-center gap-1 text-sm tracking-widest bg-white px-2 rounded-lg font-bold border border-neutral-500 hover:bg-red-400 transition-all duration-500">
          {like}
          <svg width="800px" height="800px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-3">
            <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#000000"/>
          </svg>
        </p>
      </button>

      <button type="button" className="flex gap-1 absolute top-[17px] right-5 hover:scale-110 transition-all duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-7 bg-white rounded-full p-1 border border-black">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
      </button>
     

        {/*<button type="button" className="absolute top-5 right-5 bg-white p-1 rounded-md border border-neutral-500">
        <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4">
          <path d="M16.8203 2H7.18031C5.05031 2 3.32031 3.74 3.32031 5.86V19.95C3.32031 21.75 4.61031 22.51 6.19031 21.64L11.0703 18.93C11.5903 18.64 12.4303 18.64 12.9403 18.93L17.8203 21.64C19.4003 22.52 20.6903 21.76 20.6903 19.95V5.86C20.6803 3.74 18.9503 2 16.8203 2ZM15.0103 9.75C14.0403 10.1 13.0203 10.28 12.0003 10.28C10.9803 10.28 9.96031 10.1 8.99031 9.75C8.60031 9.61 8.40031 9.18 8.54031 8.79C8.69031 8.4 9.12031 8.2 9.51031 8.34C11.1203 8.92 12.8903 8.92 14.5003 8.34C14.8903 8.2 15.3203 8.4 15.4603 8.79C15.6003 9.18 15.4003 9.61 15.0103 9.75Z" fill="#292D32"/>
        </svg>
      </button> */}

      <Link href={`/asset/${id}`}>
        <div className="px-3">
          <Image src={lienImage} alt="Hxh" width={300} height={300} className="rounded-lg object-cover w-full h-52 mt-3 transition-all duration-500" />
        </div>

        <div className="flex justify-between text-white px-3 mt-3">
          <p className="text-md flex items-center bg-white text-black px-2 rounded-lg tracking-widest font-bold">{titre.length > 16 ? `${titre.slice(0, 19)}..` : titre}</p>
             <p className="text-xl  tracking-widest font-bold">{prix} $</p>
        </div>

        <p className="text-sm text-center mt-5 px-3 tracking-widest text-white">
          {description.length > 180 ? `${description.slice(0, 180)}...` : description}
        </p>

        <div className="flex gap-3 justify-center">
          <Link href={`/asset/${id}`} type="button" className="absolute bottom-[10px] text-center w-80 tracking-widest font-bold p-2 bg-white shadow-sm shadow-white rounded-lg  hover:scale-110 transition-all duration-500">
            VOIR L'ASSET
          </Link>
        </div>
        </Link>
        
      </article>
    </>
  );
}