import { prisma } from "@/lib/prisma"; // Assure-toi que ce chemin est correct
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const role = session.user.role;

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { id } = req.query;

  // Vérifier que l'ID est bien présent et valide
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid asset ID" });
  }

  try {
    const asset = await prisma.asset.delete({
      where: {
        id_asset: Number(id),
      },
    });

    res.status(200).json({ asset });
  } catch (error) {
    console.error("Error deleting asset:", error);
    res.status(500).json({ error: "An error occurred while deleting the asset" });
  }
}
