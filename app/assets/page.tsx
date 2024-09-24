import Image from "next/image";
import Circles from "../../components/shared/Circles";
import Navbar from "../../components/shared/Navbar";
import Card from "../../components/shared/Card";

export default function AssetsList() {
  return (
    <>
      <Navbar />
      <Circles />
      <div className="flex flex-wrap justify-center gap-10 mt-10">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </>
  );
}
