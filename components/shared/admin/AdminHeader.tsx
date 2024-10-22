import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import { useState } from "react";

export default function Admin() {

  return (
    <>
      <Navbar />
      <h2 className="text-white text-center text-4xl mt-10 tracking-[10px] uppercase title">Adminstration</h2>

      <div className="flex justify-center gap-5 flex-wrap mt-8">
        <Link  href="/admin/assets" className="bg-white text-center p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Gestion des assets</Link>
        <Link  href="/admin/categories" className="bg-white text-center p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Gestion des catégories</Link>
        <Link  href="/admin/users" className="bg-white text-center p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Gestion des utilisateurs</Link>
      </div>
    </>
  );
}