"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";


export default function Navbar() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Array<{ id_categorie: string; nom: string }>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);


  return (
    <>
      <nav className="mt-4 mx-3 sm:mx-14 flex flex-col text-white">
        <div className="relative justify-center gap-3 sm:justify-between flex sm:items-center">
          <p className="hidden sm:block text-2xl">ASSETS LOGO</p>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-9 mt-1 sm:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-expanded={isMobileMenuOpen}>
          <title>Menu icon</title>
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>

        <div className={`fixed top-0 left-0 h-screen w-1/2 z-50 bg-blackA text-white transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>         
          <div className="flex flex-col p-5">
            {session ? (
              <div className="flex items-center gap-3">
                <Image  src={session.user.image || ""} alt="Profile picture" width={50} height={50} className="rounded-full w-10 h-10"/>              
                <p className="ml-2">{session.user.name}</p>
              </div>
            ) : (
              <a href="/login" className="text-center p-1 tracking-wider uppercase rounded-md button"> Se connecter </a>
            )}
            <h2 className="text-xl font-bold mb-4 mt-4">Catégories</h2>
            {categories.map((category) => (
              <a href={`/assets/${category.id_categorie}`} key={category.id_categorie} type="button" className="mb-2">{category.nom}  </a>
            ))}                                              
            <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 bg-white text-black rounded-md font-bold">Fermer</button>
          </div>
        </div>


          <input type="text" placeholder="Recherchez un asset..." className="p-1 w-[300px] sm:w-[500px] text-white bg-black border border-neutral-500 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 rounded-md placeholder:text-neutral-500"/>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} type="button" aria-hidden="true"  className="sm:hidden">
            <Image src={session?.user.image || ""} alt="Profile picture" width={50} height={50} className="sm:hidden rounded-full w-12 h-10"/>
          </button>

              
          <div className="hidden sm:flex gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <Image src={session.user.image || ""} alt="Profile picture" width={50} height={50} className="rounded-full w-10 h-10 border-2 border-white hover:scale-110 transition-transform duration-300 ease-in-out"/>
                </button>
                <p className="ml-2">{session.user.name}</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`size-7 transition-transform duration-300 ease-in-out ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
              </div>
            ) : (
              <button type="button" onClick={() => signIn("discord")} className="text-center p-1 w-72 button rounded-md tracking-wider uppercase">
                Se connecter via Discord
              </button>
            )}
            
          </div>
        </div>

        {isDropdownOpen && (
        <div className="absolute top-14 right-0 mr-2 sm:mr-28 mt-2 w-40 sm:w-48 bg-white text-black rounded-lg shadow-lg z-50">
          <ul className="flex flex-col">
            <li className="p-2 hover:bg-gray-100">
              <a href="/profile">Mon Profil</a>
            </li>
            <li className="sm:hidden p-2 hover:bg-gray-100">
              <a href="/profile">Mes favoris</a>
            </li>
            <hr className="border-gray-300" />
            <li className="p-2 hover:bg-gray-100">
              <button type="button" onClick={() => signOut()}>Se déconnecter</button>
            </li>
          </ul>
        </div>
      )}

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
