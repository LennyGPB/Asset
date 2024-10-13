import Image from "next/image";
import Card from "../Card";

export default function S2_home() {
  return (
    <>
      <h1 className="text-white text-center text-4xl uppercase mt-20 mb-10 tracking-[4px]">
        Assets Populaire
      </h1>
      <div className="flex justify-center flex-wrap gap-2 sm:gap-10">
        <Card />
        <Card />
        <Card />
      </div>
    </>
  );
}
