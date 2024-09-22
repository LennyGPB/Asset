import Image from "next/image";
import Circles from "../components/Circles";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

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
