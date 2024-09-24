import Image from "next/image";
import Circles from "../../components/shared/Circles";
import Navbar from "../../components/shared/Navbar";
import Card from "../../components/shared/Card";

export default function FormAsset() {
  return (
    <>
      <Navbar />
      <h1 className="text-white text-center text-4xl tracking-widest font-bold my-10 uppercase">
        Créer son asset
      </h1>

      <div className="mx-auto flex justify-center bg-white rounded-lg w-[900px]">
        <div className="flex flex-col">
          <div className="flex gap-20 justify-center mt-5">
            <input
              type="text"
              className="bg-black text-white h-8 w-80 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
              placeholder="Nom de l'Asset"
            />

            <select className="bg-black text-white h-8 w-40 rounded-lg border border-neutral-500 px-2 ">
              <option value="" disabled selected hidden>
                Catégorie
              </option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>

            <input
              type="text"
              className="bg-black text-white h-8 w-20 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
              placeholder="Prix"
            />
          </div>

          <input
            type="text"
            className="bg-black text-white h-8 w-full mt-5 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
            placeholder="Slogan"
          />

          <textarea
            className="bg-black text-white h-40 w-full mt-2 mb-5 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
            placeholder="Description détaillée du produit..."
          />
        </div>
      </div>

      <div className="mx-auto flex justify-center bg-white rounded-lg w-[900px] my-3">
        <div className="flex flex-col">
          <p className="font-bold tracking-widest">Choisissez jusqu'à 3 tags</p>

          <div className="flex justify-center gap-5 mt-3">
            <select className="bg-black text-white h-8 w-40 rounded-lg border border-neutral-500 px-2 ">
              <option value="" disabled selected hidden>
                Tags #1
              </option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>

            <select className="bg-black text-white h-8 w-40 rounded-lg border border-neutral-500 px-2 ">
              <option value="" disabled selected hidden>
                Tags #2
              </option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>

            <select className="bg-black text-white h-8 w-40 rounded-lg border border-neutral-500 px-2 ">
              <option value="" disabled selected hidden>
                Tags #3
              </option>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>

          <p className="font-bold tracking-widest mt-3">
            Importer votre image de couverture :
          </p>

          <div className="flex justify-center">
            <input
              type="file"
              className="bg-black text-white h-8 w-80 mt-5 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
            />
          </div>
          <p className="font-bold tracking-widest mt-3">
            Importer vos images :
          </p>

          <div className="flex justify-center gap-3 flex-wrap">
            <input
              type="file"
              className="bg-black text-white h-8 w-60 mt-5 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
            />

            <input
              type="file"
              className="bg-black text-white h-8 w-60 mt-5 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
            />

            <input
              type="file"
              className="bg-black text-white h-8 w-60 mt-5 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
            />

            <input
              type="file"
              className="bg-black text-white h-8 w-60 mt-5 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
            />

            <input
              type="file"
              className="bg-black text-white h-8 w-60 mt-5 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
            />

            <input
              type="file"
              className="bg-black text-white h-8 w-60 mt-5 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
            />
          </div>

          <p className="font-bold tracking-widest mt-3">
            Importer votre dossier :
          </p>

          <div className="flex justify-center">
            <input
              type="file"
              className="bg-black text-white h-8 w-80 mt-5 rounded-sm border border-neutral-500 px-2 placeholder:text-white"
            />
          </div>

          <button type="button">Confirmer</button>
        </div>
      </div>
    </>
  );
}
