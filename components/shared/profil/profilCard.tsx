"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProfilCard({ lienImage, titre, prix, description, id, likes}: {lienImage: string; titre: string; prix: number; description: string; id: number; likes: number;}) {


  return (
    <>
      <article className="relative flex flex-col gap-3 w-[350px] h-[450px] mt-10 sm:mb-10 rounded-xl bg-neutral-900 border border-neutral-500">
        <div className="absolute -top-2 left-2 w-[350px] h-[450px] rounded-xl bg-neutral-900 border border-neutral-500 z-[-1]"></div>


      <div className="flex gap-1 absolute top-5 left-5 hover:scale-110 transition-all duration-500">
        <p className="flex items-center gap-1 text-sm tracking-widest bg-white px-2 rounded-lg font-bold border border-neutral-500 hover:bg-red-400 transition-all duration-500">
          {likes}
          <svg width="800px" height="800px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-3">
            <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#000000"/>
          </svg>
        </p>
      </div>

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
          <Link
            href={`/updateAsset/${id}`}
            type="button"
            className="absolute bottom-[10px] text-center w-80 tracking-widest font-bold p-2 bg-white rounded-lg hover:scale-110 transition-all duration-500"
          >
            Modifier l'asset
          </Link>
        </div>
        </Link>
      </article>
    </>
  );
}
