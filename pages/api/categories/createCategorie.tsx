import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextApiResponse } from "next";

import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (session.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  
  if (req.method === "POST") {
    try {
      const { nom } = req.body;

      const categorie = await prisma.categorie.create({
        data: {
          nom,
        },
    });

      res.status(200).json(categorie);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création de la catégorie" });
    }
  }
}
