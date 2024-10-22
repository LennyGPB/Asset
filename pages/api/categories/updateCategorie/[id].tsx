import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const { nom } = req.body;
    
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Vous n\'êtes pas autorisé à modifier cette catégorie' });
    }

    const role = session.user.role;

    if (role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: "Invalid categorie ID" });
    }
    
    try {
        const categorie = await prisma.categorie.update({
            where: { id_categorie: Number(id) },
            data: { nom }
        });

        res.status(200).json({ categorie });    
    } catch (error) {
        console.error("Error updating categorie:", error);
        res.status(500).json({ error: "An error occurred while updating the categorie" });
    }
}