"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { useCategories } from "@/contexts/CategoriesContext";


function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const id = session?.user.id;
  const { categories } = useCategories();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
 // const [categories, setCategories] = useState<Array<{ id_categorie: string; nom: string }>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalCategoryOpen, setIsModalCategoryOpen] = useState(false);
  const [isModalVendeurOpen, setIsModalVendeurOpen] = useState(false);
  const pathname = usePathname();
  

  // useEffect(() => {
  //   fetch("/api/categories/categories")
  //     .then((res) => res.json())
  //     .then((data) => setCategories(data));
  // }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      // Redirige vers la page de résultats avec le query
      router.push(`/assetSearch?query=${encodeURIComponent(searchQuery)}`);
    }
  };;

  const handleCreateChannel = async () => {
    const randomNum = getRandomInt(1, 1000); 
    try {
      const response = await fetch("/api/discord/createChannel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelName: `vendeur-${id}-${randomNum}`,
          userId: Number(id),
        }),
      });

      if (response.status === 401) {
        window.location.href = "/api/auth/signin";
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      console.log("Canal créé avec succès:", data.channelId);
    } catch (error) {
      console.error("Erreur lors de la création du canal Discord:", error);
    }
  };

  return (
    <>
      <nav className="z-50 mt-4 mx-3 sm:mx-14 flex flex-col text-white">
      <div className="relative flex justify-center sm:justify-between gap-3 sm:items-center">
        <Link href="/" className="flex items-center gap-5">
          <Image
            src="/medias/asset_logo4.png"
            alt="Logo"
            width={37}
            height={37}
            className="hidden sm:block"
          />
          <p className="hidden sm:block text-md tracking-widest text-white neon-effect">by InTheGleam</p>
        </Link>

        {/* Menu mobile */}
        <div className="fixed z-50 flex items-center justify-center gap-3 sm:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-9"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-expanded={isMobileMenuOpen}
          >
            <title>Menu icon</title>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"/>
          </svg>

          <form method="GET" onSubmit={handleSearch} className="lg:hidden">
            <button
              type="button"
              onClick={() => setIsModalCategoryOpen(true)}
              className="p-1 w-[265px] uppercase tracking-widest font-semibold text-white bg-black border border-neutral-500 rounded-md shadow-sm shadow-white/10 placeholder:text-neutral-500 focus:border-purple"
            >
              Consulter les Assets
            </button>
          </form>

          <Link href="/" aria-hidden="true" className="sm:hidden">
            <Image src="/medias/asset_logo4.png" alt="Profile picture" width={32} height={32} className="sm:hidden"/>
          </Link>
        </div>

        {/* Modal catégorie */}
        {isModalCategoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md" onClick={() => setIsModalCategoryOpen(false)}>
            <div className="flex flex-col items-center justify-center gap-5" onClick={(event) => event.stopPropagation()}>
              <p className="text-2xl font-bold tracking-widest uppercase rounded-md">Choisir une catégorie</p>
              {categories.map((category) => (
                <Link
                  key={category.id_categorie}
                  href={`/assets/${category.id_categorie}`}
                  className="w-52 p-2 text-lg font-bold text-center text-black uppercase bg-white tracking-widest rounded-md shadow-md shadow-white/20"
                >
                  {category.nom}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Menu latéral mobile */}
        <div className={`fixed top-0 left-0 h-screen w-full z-50 text-white ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="fixed top-0 left-0 h-screen w-[280px] bg-black/95 p-5" onClick={(event) => event.stopPropagation()}>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <Link href="/">
                  <Image
                    src="/medias/asset_logo4.png"
                    alt="Profile picture"
                    width={30}
                    height={30}
                  />
                </Link>
                <p className="ml-2 tracking-widest neon-effect">by InTheGleam</p>
              </div>

              {!session && (
                <a href="/login" className="p-1 mb-3 text-sm text-center uppercase tracking-wider rounded-md button">Se connecter</a>
              )}
              {session && (
                <button onClick={() => setIsModalVendeurOpen(true)} type="button" className="p-1 mb-3 text-sm text-center uppercase tracking-wider rounded-md button">
                  Devenir vendeur
                </button>
              )}

              <form method="GET" onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Recherche un Asset..."
                  className="w-full p-1 text-white bg-black border border-neutral-500 rounded-md placeholder:text-neutral-500 focus:border-purple"
                />
              </form>

              {session && (
                <div className="flex items-center gap-3 mt-5">
                  <Image
                    src={session?.user.image || ''}
                    alt="Profile picture"
                    width={50}
                    height={50}
                    className="w-10 h-10 rounded-full"
                  />
                  <p className="ml-2 tracking-widest">{session?.user.name}</p>
                </div>
              )}

              {session && (
                <div className="flex flex-col">
                  <Link href={`/profil/${session?.user.id}/post`} className="mt-5 font-semibold tracking-widest">Mon profil</Link>
                  <Link href={`/save/${session?.user.id}`} className="mt-3 font-semibold tracking-widest">Mes favoris</Link>
                  {session?.user.role === 'admin' && (
                    <Link href="/admin" className="mt-3 font-semibold tracking-widest">Administration</Link>
                  )}
                  {(session?.user.role === 'admin' || session?.user.role === 'seller') && (
                    <Link href="/formAsset" className="mt-3 w-48 text-center text-black font-bold bg-white rounded-md">Créer un Asset</Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    type="button"
                    className="mt-3 w-48 text-black font-bold bg-white rounded-md"
                  >
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input recherche */}
        <form
          method="GET"
          onSubmit={handleSearch}
          className="hidden justify-center lg:block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 sm:flex"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Recherchez un asset..."
            className="w-[270px] lg:w-[500px] p-1 mt-1 sm:mt-0 text-white bg-black border border-neutral-500 rounded-md placeholder:text-neutral-500 focus:border-purple"
          />
        </form>

        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={() => setIsModalVendeurOpen(true)}
            type="button"
            className="hidden 2xl:block px-3 p-1 text-md tracking-wider uppercase button rounded-md mr-4 hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Devenir vendeur
          </button>
          {session ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Image
                  src={session.user.image || ''}
                  alt="Profile picture"
                  width={50}
                  height={50}
                  className="w-10 h-10 border-2 border-white rounded-full sm:hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              </button>
              <p className="ml-2">{session.user.name}</p>
              <Link href={`/save/${session.user.id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="size-7 button p-1 rounded-full hover:scale-110 transition-transform duration-300 ease-in-out"
                >
                  <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                </svg>
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => signIn('discord')}
              className="p-1 w-40 text-center uppercase tracking-wider button rounded-md hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              Se connecter
            </button>
          )}
        </div>
      </div>

    {isDropdownOpen && (
      <div className="absolute top-14 right-0 mt-2 w-40 sm:w-48 mr-2 sm:mr-28 bg-white text-black rounded-lg shadow-lg z-50">
        <ul className="flex flex-col">
          <li className="p-2 hover:bg-gray-100">
            <a href={`/profil/${session?.user.id}/post`}>Mon profil</a>
          </li>
          {session?.user.role === 'admin' && (
            <li className="p-2 hover:bg-gray-100">
              <Link href="/admin">Administration</Link>
            </li>
          )}
          {(session?.user.role === 'admin' || session?.user.role === 'seller') && (
            <li className="p-2 hover:bg-gray-100">
              <Link href="/formAsset">Créer un Asset</Link>
            </li>
          )}
          <li className="p-2 hover:bg-gray-100">
            <button onClick={() => setIsModalVendeurOpen(true)} type="button">
              Devenir vendeur
            </button>
          </li>
          <li className="p-2 sm:hidden hover:bg-gray-100">
            <Link href={`/save/${session?.user.id}`}>Mes favoris</Link>
          </li>
          <hr className="border-gray-300" />
          <li className="p-2 hover:bg-gray-100">
            <button type="button" onClick={() => signOut()}>
              Se déconnecter
            </button>
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
          className={`text-lg uppercase tracking-wider hover:scale-110 transition-transform duration-300 ease-in-out ${
            pathname === `/assets/${category.id_categorie}`
              ? 'neon-effect'
              : 'text-gray-300'
          }`}
        >
          {category.nom}
        </Link>
      ))}
    </div>
  </nav>

    </>
  );
}
