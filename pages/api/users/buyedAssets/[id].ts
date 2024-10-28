import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.query;

    if (Number(session.user.id) !== Number(id)) {
        return res.status(403).json({ error: "Forbidden" });
    }

    try {
       
        const buyedAssets = await prisma.buy.findMany({
            where: {
                userId: Number(id),
            },
            include: {
                asset: {
                    include: {
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                },
            },
        });

        res.status(200).json(buyedAssets);

       
    } catch (error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}