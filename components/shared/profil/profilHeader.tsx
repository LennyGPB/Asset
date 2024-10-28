import Navbar from "@/components/shared/Navbar";
import ScrollTextEffectOne from "@/components/shared/ScrollTextEffectOne";
import Meteors from "@/components/magicui/meteors";
import Link from "next/link";

export default function ProfilHeader({ id }: { id: string }) {
    return (
        <>
            <Navbar />
            <ScrollTextEffectOne text={"Mon profil -"} size="3xl mt-7 sm:mt-0" />
            <Meteors number={30} />

            <div className="flex justify-center gap-5 mt-8">
                <Link  href={`/profil/${id}/post`} className="bg-white text-center text-lg p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Mes assets</Link>
                <Link  href={`/profil/${id}/buy`} className="bg-white text-center text-lg p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Mes achats</Link>

            </div>
        </>
    )
}