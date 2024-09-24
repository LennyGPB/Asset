import Image from "next/image";
import Navbar from "../components/shared/Navbar";
import S1_home from "../components/shared/home/S1_home";
import S2_home from "../components/shared/home/S2_home";

export default function Home() {
  return (
    <>
      <Navbar />
      <S1_home />
      <S2_home />
    </>
  );
}
