"use client";


import UpdateHeader from "@/components/shared/updateAsset/updateHeader";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";

export default function UpdateAsset({params}: {params: {id: string}}) {
  const id = Number.parseInt(params.id);

  return (
    <>
      
      <UpdateHeader id={id} />

    </>
  );
}
