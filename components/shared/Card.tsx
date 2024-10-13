import Image from "next/image";

export default function Card({
  lienImage,
  titre,
  prix,
  description,
  id
}: {
  lienImage: string;
  titre: string;
  prix: number;
  description: string;
  id: number;
}) {
  return (
    <>
    <a href={`/asset/${id}`}>
      <article className="relative flex flex-col gap-3 w-[350px] h-[450px] mt-10 mb-10 rounded-xl bg-neutral-900 border border-neutral-500">
        <div className="absolute -top-2 left-2 w-[350px] h-[450px] rounded-xl bg-neutral-900 border border-neutral-500 z-[-1]"></div>

        <div className="px-3">
          <Image
            src={lienImage}
            alt="Hxh"
            width={300}
            height={300}
            className="rounded-lg object-cover w-full h-52  mt-3"
          />
        </div>

        <div className="flex justify-between text-white px-3">
          <p className="text-xl tracking-widest font-bold">{titre}</p>
          <p className="text-xl tracking-widest font-bold">{prix}</p>
        </div>

        <p className="text-sm  px-3 tracking-widest text-white">
          {description}
        </p>

        <div className="flex justify-center">
          <button
            type="button"
            className="absolute bottom-[10px] w-80 tracking-widest font-bold p-2 bg-white rounded-lg"
          >
            AJOUTER AU PANIER
          </button>
        </div>
      </article>
      </a>
    </>
  );
}
