import Image from "next/image";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";

export default function ScrollTextEffect() {
  return (
    <>
      <div>
        <VelocityScroll
          text="- 3D - DESIGN - MUSIC  "
          default_velocity={1}
          className="font-display text-center text-4xl font-bold tracking-widest text-white drop-shadow-sm dark:text-white"
        />
      </div>
    </>
  );
}
