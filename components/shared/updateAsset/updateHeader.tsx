import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import Meteors from "@/components/magicui/meteors";
import { useSession } from "next-auth/react";
import ScrollTextEffectOne from "@/components/shared/ScrollTextEffectOne";

export default function UpdateHeader({ id }: { id: number }) {
const [isModalOpen, setIsModalOpen] = useState(false);
const session = useSession();

const role = session.data?.user.role;

  const openModal = () => {
    setIsModalOpen(true);
  }

  const handleDeleteAsset = () => {
    console.log("Asset supprimé");

    useEffect(() => {
      fetch(`/api/assets/delete/${id}`)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error deleting asset:', error));
    }, [id]);
  }
    
  return (
    <>
    <Navbar />
    <ScrollTextEffectOne text={"Modifier son asset -"} size="3xl" />

      <div className="flex justify-center gap-5 flex-wrap mt-8">
        <Link  href={`/updateAsset/details/${id}`} className="bg-white text-center p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Modifier les informations</Link>
        <Link  href={`/updateAsset/file/${id}`} className="bg-white text-center p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Remplacer le fichier</Link>
        <Link  href={`/updateAsset/cover/${id}`} className="bg-white text-center p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Modifier la cover</Link>
        <button type="button" onClick={openModal} className="bg-red-500 text-white text-center p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Supprimer l'asset</button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-50">
          <div className="relative flex flex-col gap-3 items-center justify-center bg-white w-96 p-5 rounded-lg shadow-lg">
            <p className="text-center text-2xl font-bold tracking-widest">Supprimer cet asset ?</p>
            {role === "admin" && (
              <button type="button" onClick={handleDeleteAsset} className="bg-red-500 text-white p-2 w-72 rounded-lg text-center tracking-widest font-bold hover:scale-105 transition-all duration-500">
                Confirmer la suppression
              </button>
            )}
             <button type="button" className="bg-red-500 text-white p-2 w-72 rounded-lg text-center tracking-widest font-bold hover:scale-105 transition-all duration-500">
               Demander la suppression
             </button>
           
              
              <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-[-12px] right-[-12px] text-black font-bold rounded-full text-2xl hover:scale-110 hover:rotate-180 transition duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-8 text-white bg-black rounded-full">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </button>
          </div>
        </div>
      )}
      <Meteors number={30} />

      </>
  );
}