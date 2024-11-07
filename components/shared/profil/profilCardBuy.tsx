"use client";

import Image from "next/image";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import { useState } from "react";


export default function Cardv2({ lienImage, titre, prix, description, id, userId, likes}: {lienImage: string; titre: string; prix: number; description: string; id: number; userId: string; likes: number;}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const [loading, setLoading] = useState(false);


  async function handleDownload() {
    setLoading(true);
    try {
      const downloadUrl = await getDownloadLink(id, Number(userId));
      if (downloadUrl) {
        window.location.href = downloadUrl; 
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du lien de téléchargement :", error);
      alert("Erreur lors de la récupération du lien de téléchargement.");
    } finally {
      setLoading(false);
    }
  }

  async function getDownloadLink(assetId: number, userId: number) {
    const response = await fetch('/api/assets/downloadAsset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ assetId: assetId, userId: userId }),
    });
  
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du lien de téléchargement");
    }
  
    const data = await response.json();
    return data.downloadUrl;
  }
  

  return (
    <div
    onMouseMove={(e) => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    }}
    className="group relative max-w-[320px] w-full overflow-hidden rounded-xl bg-neutral-900"
  >
    <div className="absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent" />
    
    <motion.div
      className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
      style={{
        background: useMotionTemplate`
          radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(51, 51, 51, 0.4), transparent 80%)
        `,
      }}
    />
  
    <div className="relative flex flex-col h-[410px]  rounded-xl border border-white/30 px-4 py-5 justify-between">
      {/* Contenu principal */}
      <div className="flex-grow space-y-2">
        <Image
          src={lienImage}
          alt="Product image"
          height={350}
          width={208}
          className="rounded-xl h-52 w-full object-cover opacity-75 hover:opacity-100 transition duration-500"
        />
        <div className="flex flex-row items-center justify-between pt-2">
          <h3 className="text-xl font-semibold text-neutral-200">
            {titre.length > 16 ? `${titre.slice(0, 19)}..` : titre}
          </h3>
          <p className="text-[13px] text-neutral-300 select-none">{prix}$</p>
        </div>
        <p className="text-sm leading-[1.5] text-neutral-400 pb-3">
          {description.length > 180 ? `${description.slice(0, 180)}...` : description}
        </p>
      </div>
  
      {/* Boutons en bas */}
      <div className="flex justify-center gap-2 mt-4">
        <button type="button" onClick={handleDownload} className="inline-flex items-center justify-center gap-1 text-sm py-2 px-4 font-semibold bg-white text-black rounded-lg duration-300 hover:bg-white/70 w-full">
          {loading ? "Téléchargement..." : "Télécharger l'Asset"}
        </button>
        <button className="inline-flex items-center justify-center gap-1 text-sm px-1 font-semibold bg-white text-black rounded-lg duration-300 hover:bg-white/70 w-16">
          {likes}
          <svg
            width="800px"
            height="800px"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-3"
          >
            <path
              d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z"
              fill="#000000"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
  
  );
}
