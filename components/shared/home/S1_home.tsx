"use client";

import Circles from "../Circles";
import ScrollTextEffect from "../ScrollTextEffect";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Meteors from "@/components/magicui/meteors";

export default function S1_home() {
  return (
    <>
      <section className="sm:mt-2 md:wrapper mb-4">
        <h1 className="mt-[120px] sm:mt-16 text-4xl md:text-5xl text-center text-white tracking-[10px] title">
          ASSETS STORE
        </h1>

        <p className="hidden sm:block sm:text-left md:w-[1200px] px-3 sm:mt-7 mx-auto text-lg md:text-base text-white tracking-[4px] font-semibold rounded-lg md:text-center">
          Le marché des créateurs numériques, offrant une large gamme de scripts, assets, et ressources pour vos jeux vidéos, logiciels, projets...
        </p>

        <p className="sm:hidden mt-10 px-3 mx-auto text-sm md:text-xl md:w-[1200px] text-center text-white tracking-[4px] font-semibold rounded-lg">
          Le marché des créateurs numériques (assets, scripts, ressources...)
        </p>

        <Circles />

        <div className="mt-10 mb-32 sm:mb-20 px-8 sm:px-0 flex justify-center">
          <a href="https://discord.gg/WdyfxACn3G" target="blank">
            <ShimmerButton
              background="#FFFF"
              borderRadius="15px"
              shimmerSize="0.15em"
              shimmerColor="#8A0AF9"
              className="shadow-md shadow-white hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <span className="text-sm sm:text-base text-center font-bold tracking-[4px] uppercase leading-none text-black whitespace-pre-wrap">
                Rejoindre le discord
              </span>
            </ShimmerButton>
          </a>
        </div>
      </section>
      <ScrollTextEffect />
      <Meteors number={30} />
    </>
  );
}
