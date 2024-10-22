'use client'

import UpdateHeader from "@/components/shared/updateAsset/updateHeader";
import { useState } from "react";

export default function UpdateAssetCoverPage({ params }: { params: { id: string } }) {
    const id = Number.parseInt(params.id);
    const [cover, setCover] = useState<File | null>(null);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedCover = e.target.files?.[0] || null;
        setCover(selectedCover);
    };

    const updateAssetCover = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!cover) {
            console.error("No cover selected");
            return;
        }

        const formData = new FormData();
        formData.append("assetUpdateCover", cover);

        try {
            const response = await fetch(`/api/assets/updateAsset/cover/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update asset cover');
            }

            const data = await response.json();
        } catch (error) {
            console.error("Error updating asset cover:", error);
        }

    }

    return (
        <>
            <UpdateHeader id={id} />

            <p className="text-center uppercase text-white text-2xl font-bold tracking-widest mt-8">Modifier la cover de l'asset</p>

            <form onSubmit={updateAssetCover} className="flex flex-col gap-5 justify-center items-center mt-8">
                <input type="file" onChange={handleCoverChange} name="assetUpdateCover" className="bg-black text-white h-10 w-96 rounded-lg border border-white px-2 tracking-widest placeholder:text-white" />
                <button type="submit" className="button text-white text-center uppercase p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Mettre à jour</button>
            </form>
        </>
    )


}

