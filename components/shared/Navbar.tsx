"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Array<{ id_categorie: string; nom: string }>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  

  useEffect(() => {
    fetch("/api/categories/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      // Redirige vers la page de résultats avec le query
      router.push(`/assetSearch?query=${encodeURIComponent(searchQuery)}`);
    }
  };;
  

  return (
    <>
      <nav className="mt-4 mx-3 sm:mx-14 flex flex-col text-white z-50">
        <div className="relative justify-center gap-3 sm:justify-between flex sm:items-center">
          <Link href="/" className="flex items-center gap-7">
            <Image src="/medias/logo_asset_temporaire.png" alt="Logo" width={50} height={50} className="hidden sm:block"/>
            <p className="hidden sm:block text-2xl tracking-widest">ASSETS STORE</p>
          </Link>
          

        {/* Menu mobile ------------------------------------------------------------------- */}
          <div className="flex justify-center items-center gap-3 fixed sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-9" onClick={() => setIsMobileMenuOpen(true)} aria-expanded={isMobileMenuOpen}>
                <title>Menu icon</title>
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
              </svg>

              <form method="GET" onSubmit={handleSearch} className="sm:hidden sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 ">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Recherchez un asset..." className="p-1 w-[265px] sm:w-[500px] text-white bg-black border border-neutral-500 rounded-md placeholder:text-neutral-500 focus:border-purple" name="query"/>
              </form>
              
              {session ? (
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} type="button" aria-hidden="true" className="sm:hidden">
                <Image src={session?.user.image || ""} alt="Profile picture" width={50} height={50} className="sm:hidden rounded-full w-14 h-10"/>
                </button>
              ) : (
                <button type="button" onClick={() => signIn("discord")} aria-hidden="true" className="sm:hidden">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-9">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                </button>
              )}
          </div>

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


          <form method="GET" onSubmit={handleSearch} className="hidden sm:block sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 ">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Recherchez un asset..." className="p-1 w-[265px] sm:w-[500px] mt-1 sm:mt-0 text-white bg-black border border-neutral-500 rounded-md placeholder:text-neutral-500 focus:border-purple" name="query"/>
          </form>

          <div className="hidden sm:flex items-center gap-3">
          <a href="/profile" className="hidden sm:block uppercase button rounded-md px-3 p-1 tracking-wider text-md mr-5 hover:scale-105 transition-transform duration-300 ease-in-out">
            Devenir vendeur
          </a>
            {session ? (
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <Image src={session.user.image || ""} alt="Profile picture" width={50} height={50} className="rounded-full w-10 h-10 border-2 border-white sm:hover:scale-110 transition-transform duration-300 ease-in-out"/>
                </button>
                <p className="ml-2">{session.user.name}</p>
                <Link href={`/save/${session.user.id}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="size-7 button p-1 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
                </Link>
              </div>
            ) : (
              <button type="button" onClick={() => signIn("discord")} className="text-center p-1 w-40 button rounded-md tracking-wider uppercase hover:scale-105 transition-transform duration-300 ease-in-out">
                Se connecter
              </button>
            )}
            
          </div>
        </div>

        {isDropdownOpen && (
        <div className="absolute top-14 right-0 mr-2 sm:mr-28 mt-2 w-40 sm:w-48 bg-white text-black rounded-lg shadow-lg z-50">
          <ul className="flex flex-col">
            <li className="p-2 hover:bg-gray-100">
              <a href={`/profil/${session?.user.id}/post`}>Mes Assets</a>
            </li>
            {session?.user.role === 'admin' && (
              <li className="p-2 hover:bg-gray-100">
                <Link href="/admin">Administration</Link>
              </li>
            )}
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
            <Link
              href={`/assets/${category.id_categorie}`}
              key={category.id_categorie}
              type="button"
              className="uppercase text-xl hover:scale-110  transition-transform duration-300 ease-in-out"
            >
              {category.nom}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
