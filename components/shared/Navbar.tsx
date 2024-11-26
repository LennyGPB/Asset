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
      <nav className="mt-4 mx-3 sm:mx-14 flex flex-col text-white z-50">
        <div className="relative justify-center gap-3 sm:justify-between flex sm:items-center">
          <Link href="/" className="flex items-center gap-5">
            <Image src="/medias/asset_logo4.png" alt="Logo" width={37} height={37} className="hidden sm:block"/>
            <p className="hidden sm:block text-md tracking-widest text-white neon-effect">by InTheGleam</p>
          </Link>
          

         {/* Menu mobile ------------------------------------------------------------------- */}
            <div className="flex justify-center items-center gap-3 fixed sm:hidden z-50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-9" onClick={() => setIsMobileMenuOpen(true)} aria-expanded={isMobileMenuOpen}>
                  <title>Menu icon</title>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>

                {/* <form method="GET" onSubmit={handleSearch} className="sm:hidden sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 ">
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Recherchez un asset..." className="p-1 w-[265px] sm:w-[500px] text-white bg-black border border-neutral-500 rounded-md placeholder:text-neutral-500 focus:border-purple" name="query"/>
                </form> */}

                <form method="GET" onSubmit={handleSearch} className="lg:hidden">
                  <button type="button" onClick={() => setIsModalCategoryOpen(true)} className="p-1 w-[265px] text-white bg-black border border-neutral-500 rounded-md uppercase tracking-widest font-semibold shadow-sm shadow-white/10 placeholder:text-neutral-500 focus:border-purple" name="query">Consulter les Assets</button>
                </form>
                
                
                  <Link href="/" aria-hidden="true" className="sm:hidden">
                    <Image src="/medias/asset_logo4.png" alt="Profile picture" width={32} height={32} className="sm:hidden"/>
                  </Link>
            </div>

                {/* MODAL CATEGORIE ------------------------------------------------------------------- */}
                {isModalCategoryOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50"
                  onClick={() => setIsModalCategoryOpen(false)} // Ferme le modal si on clique en dehors
                >
                  <div
                    className="flex flex-col justify-center items-center gap-5"
                    onClick={(event) => event.stopPropagation()} // Empêche la propagation du clic
                  >
                    <p className="font-bold text-2xl tracking-widest rounded-md uppercase">
                      Choisir une catégorie
                    </p>
                    {categories.map((category) => (
                      <Link
                        key={category.id_categorie}
                        href={`/assets/${category.id_categorie}`}
                        className="bg-white text-lg text-black tracking-widest shadow-md shadow-white/20 font-bold rounded-md text-center p-2 w-52 uppercase"
                      >
                        {category.nom}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* MENU LATERAL MOBILE ------------------------------------------------------------------- */}
              <div className={`fixed top-0 left-0 h-screen w-full z-50  text-white ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`} onClick={() => setIsMobileMenuOpen(false)}>
                <div className="fixed top-0 left-0 h-screen w-[280px] bg-black/95 p-5" onClick={(event) => event.stopPropagation()}>
                  <div className="flex flex-col">

                      <div className="flex items-center gap-3 mb-5">
                        <Image src="/medias/asset_logo4.png" alt="Profile picture" width={30} height={30}/>                                                                                               
                        <p className="ml-2 neon-effect tracking-widest">by InTheGleam</p>
                      </div>

                      {!session && (
                        <a href="/login" className="text-center p-1 mb-3 text-sm tracking-wider uppercase rounded-md button">Se connecter</a>       
                      )}
                     {session && (
                        <button onClick={() => setIsModalVendeurOpen(true)}  type="button" className="text-center text-sm p-1 mb-3 tracking-wider uppercase rounded-md button">Devenir vendeur</button> 
                      )}

                    <form method="GET" onSubmit={handleSearch} className=" ">
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Recherche un Asset..." className="p-1 w-full  text-white bg-black border border-neutral-500 rounded-md placeholder:text-neutral-500 focus:border-purple" name="query"/>
                    </form>

                    {session && (
                      <div className="flex items-center gap-3 mt-5">  
                        <Image
                          src={session?.user.image || ''}
                          alt="Profile picture"
                          width={50}
                          height={50}
                          className="rounded-full w-10 h-10"
                        />
                        <p className="ml-2 tracking-widest">{session?.user.name}</p>
                      </div>
                      )}
                    
                    {session && (
                      <div className="flex flex-col">                     
                        <Link href={`/profil/${session?.user.id}/post`} className="mt-5 tracking-widest font-semibold">Mon profil</Link>
                        <Link href={`/save/${session?.user.id}`} className="mt-3 tracking-widest font-semibold">Mes favoris</Link>
                        {session?.user.role === 'admin' && (
                          <Link href="/admin" className="mt-3 tracking-widest font-semibold">Administration</Link>
                        )}
                        {(session?.user.role === 'admin' || session?.user.role === 'seller') && (
                          <Link href="/formAsset" className="mt-3 tracking-widest text-black text-center bg-white w-48 rounded-md font-bold">Créer un Asset</Link>
                        )}
                        <button onClick={() => signOut()} type="button" className="mt-3 tracking-widest text-black w-48 rounded-md font-bold bg-white">Se déconnecter</button>
                        {/* <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 bg-white text-black rounded-md font-bold">Fermer</button>  */}
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* MENU VENDEUR ------------------------------------------------------------------- */}
            {isModalVendeurOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50" onClick={() => setIsModalVendeurOpen(false)}>
                  <div className="flex flex-col justify-center items-center gap-2" onClick={(event) => event.stopPropagation()}>
                    <p className="hidden sm:block font-bold sm:text-2xl tracking-widest rounded-md uppercase">Vous souhaitez devenir vendeur ?</p>
                    <p className="sm:hidden font-bold text-2xl tracking-widest rounded-md uppercase">devenir vendeur ?</p>
                    <p className="font-bold text-center text-sm tracking-widest rounded-md uppercase">Un ticket sera automatiquement ouvert sur le discord.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                    <button type="button" onClick={() => setIsModalVendeurOpen(false)} className="bg-white/70 text-black rounded-md font-bold p-2 w-52 uppercase mt-2 sm:mt-4 hover:scale-105 transition duration-500">Annuler</button>
                    <button type="button" onClick={handleCreateChannel} className="bg-white text-black rounded-md font-bold p-2 w-52 uppercase sm:mt-4 hover:scale-105 transition duration-500">Devenir vendeur</button>
                    </div>
                  </div>
                </div>
                )}

          <form method="GET" onSubmit={handleSearch} className="hidden sm:flex justify-center lg:block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 ">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Recherchez un asset..." className="p-1 w-[270px] lg:w-[500px] mt-1 sm:mt-0 text-white bg-black border border-neutral-500 rounded-md placeholder:text-neutral-500 focus:border-purple" name="query"/>
          </form>

          <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => setIsModalVendeurOpen(true)} type="button" className="hidden 2xl:block uppercase button rounded-md px-3 p-1 tracking-wider text-md mr-4 hover:scale-105 transition-transform duration-300 ease-in-out">
            Devenir vendeur
          </button>
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
              <button onClick={() => setIsModalVendeurOpen(true)} type="button" >Devenir vendeur</button>
            </li>
            <li className="sm:hidden p-2 hover:bg-gray-100">
              <Link href={`/save/${session?.user.id}`}>Mes favoris</Link>
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
              className={`uppercase text-lg hover:scale-110 transition-transform duration-300 ease-in-out ${pathname === `/assets/${category.id_categorie}` ? 'neon-effect' : 'text-gray-300'}`}
            >
              {category.nom}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
