'use client'

import UpdateHeader from "@/components/shared/updateAsset/updateHeader";
import { useState } from "react";

export default function UpdateAssetFilePage({ params }: { params: { id: string } }) {
    const id = Number.parseInt(params.id);
    const [file, setFile] = useState<File | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile); 
    };

    const updateAssetFile = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 

        if (!file) {
            console.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("assetUpdateFile", file); 

        try {
            const response = await fetch(`/api/assets/updateAsset/file/${id}`, {
                method: 'PUT',
                body: formData, 
            });

            if (!response.ok) {
                throw new Error('Failed to update asset file');
            }

            const data = await response.json();
            console.log('Update successful:', data);
        } catch (error) {
            console.error('Error updating asset file:', error);
        }
    };
    

    return (
        <>
            <UpdateHeader id={id} />

            <p className="text-center uppercase text-white text-2xl font-bold tracking-widest mt-8">Modifier le fichier de l'asset</p>

            <form onSubmit={updateAssetFile} className="flex flex-col gap-5 justify-center items-center mt-8">
                <input type="file" onChange={handleFileChange} name="assetUpdateFile" className="bg-black text-white h-10 w-96 rounded-lg border border-white px-2 tracking-widest placeholder:text-white" />
                <button type="submit" className="button text-white text-center uppercase p-2 w-64 rounded-lg font-bold tracking-widest border border-neutral-500 hover:scale-105 transition-all duration-300">Mettre à jour</button>
            </form>
        </>
    );
}