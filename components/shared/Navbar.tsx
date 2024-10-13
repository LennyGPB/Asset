"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function Navbar() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);


  return (
    <>
      <nav className="wrapper flex flex-col text-white">
        <div className="relative gap-5  justify-center sm:justify-between flex sm:items-center">
          <p className="hidden sm:block text-2xl">ASSETS LOGO</p>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-9 sm:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-expanded={isMobileMenuOpen}>
            <title>Menu icon</title>
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
          </svg>

        <div className={`fixed top-0 left-0 h-screen w-1/2 z-50 bg-blackA text-white transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
          
          <div className="flex flex-col p-5">
            {session ? (
              <div className="flex items-center gap-3">
                <Image
                  src={session.user.image}
                  alt="Profile picture"
                  width={50}
                  height={50}
                  className="rounded-full w-10 h-10"
                />
                <p className="ml-2">{session.user.name}</p>
              </div>
            ) : (
              <a href="/login" className="text-center p-1 tracking-wider uppercase rounded-md button"> Se connecter </a>
            )}
            <h2 className="text-xl font-bold mb-4 mt-4">Catégories</h2>
            {categories.map((category) => (
              <a href={`/assets/${category.id_categorie}`} key={category.id_categorie} type="button" className="mb-2">{category.nom}  </a>
            ))}                                              
            <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="mt-auto">Fermer</button>
          </div>
          
        </div>


          <input
            type="text"
            placeholder="Recherchez un produit..."
            className="p-1 w-[300px] sm:w-[500px] text-white bg-black border border-neutral-500 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2"
          />

          <div className="hidden sm:flex gap-3">
            {session ? (
              <button type="button" onClick={() => signOut()} className="text-center p-1 w-40 button rounded-md tracking-wider uppercase">
                Se déconnecter
              </button>
            ) : (
              <a href="/login" className="text-center p-1 w-36 button rounded-md tracking-wider uppercase">
                Se connecter
              </a>
            )}
            
          </div>
        </div>

        <div className="hidden sm:flex justify-center gap-10 mt-8">
          {categories.map((category) => (
            <a
              href={`/assets/${category.id_categorie}`}
              key={category.id_categorie}
              type="button"
              className="uppercase text-xl"
            >
              {category.nom}
            </a>
          ))}
          <button type="button" className="uppercase text-xl ml-10">
            Devenir vendeur
          </button>
        </div>
      </nav>
    </>
  );
}
