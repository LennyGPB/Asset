import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { pseudo, email, password } = req.body;

      if (!pseudo || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      // Vérifie si l'utilisateur existe déjà
      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ message: "Utilisateur déjà existant" });
      }

      // Hache le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crée un nouvel utilisateur
      const newUser = await prisma.user.create({
        data: {
          name: pseudo,
          email,
          password: hashedPassword,
        },
      });

      // TODO: Envoyer l'e-mail de vérification ici avec Nodemailer

      return res.status(201).json({ message: "Inscription réussie", newUser });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur", error });
  }
}
