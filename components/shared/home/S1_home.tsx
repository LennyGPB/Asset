"use client";

import Circles from "../Circles";
import ScrollTextEffect from "../ScrollTextEffect";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Meteors from "@/components/magicui/meteors";

export default function S1_home() {
  return (
    <>
      <section className="wrapper mb-4">
        <h1 className="text-white tracking-widest text-center text-5xl mt-16">
          ASSETS STORE
        </h1>

        <p className="text-white font-semibold text-xl tracking-[4px] p-3 rounded-lg mt-7 w-[1200px] mx-auto">
          Le marché des créateurs numériques, offrant une large gamme de
          scripts, assets, et ressources pour vos jeux vidéos, logiciels,
          projets...
        </p>

        <Circles />

        <div className="flex justify-center mt-10 mb-16">
          <ShimmerButton
            background="#FFFF"
            borderRadius="15px"
            shimmerSize="0.15em"
            shimmerColor="#8A0AF9"
            className="shadow-md shadow-white"
          >
            <span className="uppercase tracking-[4px] whitespace-pre-wrap text-center font-bold leading-none text-black text-xl">
              Parcourir tous les Assets
            </span>
          </ShimmerButton>
        </div>

        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-12 mb-10 text-white mx-auto animate-bounce"
        >
          <title id="svg1Title">Animation</title>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg> */}
      </section>
      <ScrollTextEffect />

      <Meteors number={30} />
    </>
  );
}
