// lib/auth.ts
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { User, Account, Profile, Session, AuthOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

// Étendre l'interface `Session` pour ajouter `id` dans `user`
declare module "next-auth" {
  interface User {
    role?: string; // Ajout du champ role à l'interface User
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async signIn({ user, account, profile }: { user: User | AdapterUser; account: Account | null; profile?: Profile }) {
      return true; // Autorise la connexion
    },
    async session({ session, user }: { session: Session; user: User | AdapterUser }) {
      if (session.user) {
        session.user.id = user.id.toString();
        session.user.role = user.role?.toString() || "user";
      }
      return session;
    },
  },
};
