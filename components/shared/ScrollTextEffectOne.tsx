import { VelocityScrollOne } from "@/components/shared/effect/VelocityScrollOne";

interface ScrollTextEffectOneProps {
    text: string;
    size?: string;
  }
  


export default function ScrollTextEffectOne({ text, size }: ScrollTextEffectOneProps) {
  return (
    <>
      <div className="mt-10">
        <VelocityScrollOne text={text} default_velocity={1} className={`font-display text-center text-${size} font-bold tracking-widest text-white drop-shadow-sm dark:text-white title`} />
      </div>
    </>
  );
}
