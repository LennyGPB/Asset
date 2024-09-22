import Image from "next/image";

export default function Navbar() {
  return (
    <>
      <nav className="flex flex-col text-white mt-4 mx-5">
        <div className="relative justify-between flex items-center">
          <p className="text-2xl">ASSETS LOGO</p>

          <input
            type="text"
            placeholder="Recherchez un produit..."
            className="p-1 w-[500px] text-white bg-black border border-neutral-500 absolute left-1/2 transform -translate-x-1/2"
          />

          <div className="flex gap-3">
            <a
              href="/d"
              className="text-center p-1 w-36 bg-purple rounded-md tracking-wider uppercase"
            >
              Se connecter
            </a>
            <a
              href="/d"
              className="text-center p-1 w-36 bg-purple rounded-md tracking-wider uppercase"
            >
              S'inscrire
            </a>
          </div>
        </div>

        <div className="flex justify-center gap-10 mt-8">
          <button type="button" className="uppercase text-xl">
            Modelisation 3D
          </button>
          <button type="button" className="uppercase text-xl">
            Animation 3D
          </button>
          <button type="button" className="uppercase text-xl">
            Graphisme
          </button>
          <button type="button" className="uppercase text-xl">
            SONS
          </button>
          <button type="button" className="uppercase text-xl">
            SCRIPTS
          </button>
          <button type="button" className="uppercase text-xl">
            Autres
          </button>
          <button type="button" className="uppercase text-xl ml-10">
            Devenir vendeur
          </button>
        </div>
      </nav>
    </>
  );
}
