import Image from "next/image";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export default function ScrollTextEffectProfil() {
  return (
    <>
      <div className="mt-10">
        <VelocityScroll
          text=" Mes Assets -"
          default_velocity={1}
          className="font-display text-center text-2xl font-bold tracking-widest text-white drop-shadow-sm dark:text-white title"
        />
      </div>
    </>
  );
}
