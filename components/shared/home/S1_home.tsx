"use client";

import Circles from "../Circles";
import ScrollTextEffect from "../ScrollTextEffect";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Meteors from "@/components/magicui/meteors";

export default function S1_home() {
  return (
    <>
      <section className="md:wrapper mb-4 sm:mt-2">
        <h1 className="text-4xl md:text-5xl text-white tracking-[10px] text-center mt-10 sm:mt-24 title">
          ASSETS STORE
        </h1>

        <p className="text-center sm:block sm:text-left text-lg md:text-xl md:w-[1200px] mt-3 sm:mt-7 px-3 text-white tracking-[4px] font-semibold rounded-lg mx-auto">
          Le marché des créateurs numériques, offrant une large gamme de
          scripts, assets, et ressources pour vos jeux vidéos, logiciels,
          projets...
        </p>

        <Circles />

        <div className="flex justify-center mt-10 px-8 sm:px-0 sm:mt-10 mb-16">
          <ShimmerButton
            background="#FFFF"
            borderRadius="15px"
            shimmerSize="0.15em"
            shimmerColor="#8A0AF9"
            className="shadow-md shadow-white hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            <span className="uppercase tracking-[4px] whitespace-pre-wrap text-center font-bold leading-none text-black text-xl">
              Rejoindre le discord
            </span>
          </ShimmerButton>
        </div>
      </section>

      <ScrollTextEffect  />
      <Meteors number={30} />
    </>
  );
}
