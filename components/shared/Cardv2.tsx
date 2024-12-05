"use client";

import Image from "next/image";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useLikes } from "@/contexts/LikeContext";

export default function Cardv2({ lienImage, titre, prix, description, id, likes}: {lienImage: string; titre: string; prix: number; description: string; id: number; likes: number;}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { likes: globalLikes, toggleLike } = useLikes();
  const isLiked = globalLikes[id] || false;

  const handleLikeClick = async () => {
    toggleLike(id); // Bascule le like/unlike dans le contexte global
    
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: id }),
      });
  
      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/api/auth/signin";
      }
      
      if (!response.ok) {
        console.error(data.message); // Affiche le message d’erreur de l’API
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div
      onMouseMove={(e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }}
      className="group relative w-full max-w-[280px] overflow-hidden rounded-lg bg-gradient-to-t from-[#151515] to-[#0a0a0a] shadow-lg shadow-black/60"
    >
      <div className="absolute top-0 right-4 w-72 h-px bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent" />
  
      <motion.div
        className="absolute -inset-px pointer-events-none rounded-lg opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(180px circle at ${mouseX}px ${mouseY}px, rgba(51, 51, 51, 0.4), transparent 80%)
          `,
        }}
      />
  
      <div className="relative flex flex-col h-[360px] px-3 py-4 rounded-lg justify-between">
        {/* Contenu principal */}
        <div className="flex-grow space-y-2">
          <Image
            src={lienImage}
            alt="Product image"
            height={310}
            width={180}
            className="w-full h-48 rounded-lg object-cover opacity-75 transition duration-500 hover:opacity-100"
          />
          <div className="flex flex-row items-center justify-between pt-2">
            <h3 className="text-lg font-semibold text-neutral-200">{titre.length > 16 ? `${titre.slice(0, 19)}..` : titre}</h3>
            <p className="text-[12px] text-neutral-300 select-none">{prix}$</p>
          </div>
          <p className="pb-3 text-xs leading-[1.5] text-neutral-400">
            {description.length > 140 ? `${description.slice(0, 140)}...` : description}
          </p>
        </div>
  
        {/* Boutons en bas */}
        <div className="mt-3 flex justify-center gap-2">
          <Link
            href={`/asset/${id}`}
            className="inline-flex w-full items-center justify-center gap-1 rounded-md bg-white px-3 py-2 text-sm font-semibold text-black duration-300 hover:bg-white/70">
            Voir l'Asset
          </Link>
          <button
            type="button"
            onClick={handleLikeClick}
            className="inline-flex w-14 items-center justify-center gap-1 rounded-md bg-white px-1 text-sm font-semibold text-black duration-300 hover:bg-white/70">
            {isLiked ? likes + 1 : likes}
            <svg width="700px" height="700px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-3">
              <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#000000"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
  
}
