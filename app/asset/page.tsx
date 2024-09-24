import Image from "next/image";
import Navbar from "../../components/shared/Navbar";
import Card from "../../components/shared/Card";

export default function Asset() {
  return (
    <>
      <Navbar />

      <div className="relative flex justify-center mt-10 gap-5">
        <Image
          src="/medias/hxh_img.webp"
          alt="Hxh"
          width={300}
          height={300}
          className="rounded-lg object-cover w-[700px] border border-white h-96"
        />

        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <div className="bg-white rounded-md w-96 h-36">
              <p className="text-center text-2xl uppercase tracking-widest font-bold mt-2">
                Pack Models 3D
              </p>
              <p className="text-center text-sm tracking-wide mt-1 px-3">
                CREER VOTRE PROPRE CIRCUIT AVEC CE PACK PREFAITS POUR VOS BESOIN
                DE MIERDAS LA V
              </p>

              <div className=" flex justify-center ">
                <button
                  type="button"
                  className="absolute bottom-56 bg-purple p-2 rounded-lg text-white font-bold uppercase"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>

            <div className="flex w-96 bg-white mt-10 rounded-lg">
              <p className="p-2 tracking-wide">Hîden - 10 produits postés</p>
            </div>

            <div className="flex w-96 bg-white mt-3 rounded-lg">
              <p className="p-2 tracking-wide font-bold">159,98$</p>
            </div>

            <div className="flex mt-3 gap-2 ">
              <p className="p-1 w-20 bg-white rounded-lg tracking-wide font-bold text-center">
                1000
              </p>
              <p className="p-1 w-20 bg-white rounded-lg tracking-wide font-bold text-center">
                1000K
              </p>
            </div>

            <p className="rounded-lg mt-10 text-white uppercase tracking-wide font-bold">
              Post : 09/09/2004
            </p>
          </div>
        </div>
      </div>

      <h2 className="mt-10 font-bold text-white tracking-widest uppercase text-3xl ml-56">
        Description :
      </h2>

      <p className="text-white text-md px-56 my-3 font-bold">
        The Built-in Render Pipeline is Unity’s default render pipeline. It is a
        general-purpose render pipeline that has limited options for
        customization. The Universal Render Pipeline (URP) is a Scriptable
        Render Pipeline that is quick and easy to customize, and lets you create
        optimized graphics across a wide range of platforms. <br /> <br /> The
        High Definition Render Pipeline (HDRP) is a Scriptable Render Pipeline
        that lets you create cutting-edge, high-fidelity graphics on high-end
        platforms.This asset is the Unity version of the one sold on the Unreal
        Engine Market.This asset contains many cute animations of women. I
        created it little by little based on requests from everyone.We started
        with a goal of 100 animations and currently have 331 animations.We will
        continue to accept requests. However, there is a notice at the bottom of
        the description, so please take a look.
        <br /> <br /> 1.Walk, Run, Jump, Turn, Swimming, CrawlingThe purpose was
        to replace the animation of the third person template, but the following
        was added as requested.Backward, Left, Right, Pivot, Start, Stop,
        TurnSwimming is also added, although it does not have as much volume as
        dedicated assets.
      </p>
    </>
  );
}
