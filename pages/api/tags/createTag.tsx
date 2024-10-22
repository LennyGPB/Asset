import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
        const { nom, categorieId } = req.body;
        const tag = await prisma.tags.create({
            data: { nom, categorieId }
        });
        res.status(200).json(tag);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la création du tag" });
    }
  }
   
}