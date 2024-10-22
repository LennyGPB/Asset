import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    try {
      const { id_tags } = req.body;
      await prisma.tags.delete({
        where: { id_tags: id_tags },
      });
      res.status(200).json({ message: "Tag deleted successfully" });
    } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ error: "Failed to delete tag" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
