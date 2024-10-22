import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
      }

    if (session.user.role !== "admin") {
        return res.status(403).json({ error: "Forbidden" });
    }

    const { id } = req.query;
    
    try {
      const { nom } = req.body;
      await prisma.tags.update({
        where: { id_tags: Number(id) },
        data: { nom },
      });

      res.status(200).json({ message: "Tag updated successfully" });
    } catch (error) {
      console.error("Error updating tag:", error);
      res.status(500).json({ error: "Failed to update tag" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
