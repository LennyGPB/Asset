"use client";

import Navbar from "@/components/shared/Navbar";
import { useRouter } from "next/router"; // Importer useRouter
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // État pour les messages d'erreur
  // const router = useRouter(); // Utilisation de useRouter pour la redirection

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false, // Désactiver la redirection automatique
      email: credentials.email,
      password: credentials.password,
    });

    if (res?.error) {
      // Si la connexion échoue, on affiche le message d'erreur
      setError("Identifiants incorrects. Veuillez réessayer.");
    } else {
      // Si la connexion réussit, on redirige vers la page d'accueil
      window.location.href = "/";
    }
  };

  return (
    <>
      <Navbar />
      <h1 className="text-white text-center text-4xl tracking-widest uppercase mt-10">
        Se Connecter
      </h1>

      <form action="POST" onSubmit={handleLogin}>
        <div className="flex flex-col items-center gap-5 w-96 h-60 mx-auto mt-5 bg-white rounded-md">
          <input
            type="text"
            placeholder="email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            className="bg-black text-white w-72 placeholder:text-white mt-5 p-1 rounded-sm"
          />

          <input
            type="password" // Assurez-vous que c'est bien "password" ici
            placeholder="Mot de passe"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="bg-black text-white w-72 placeholder:text-white p-1 rounded-sm"
          />

          <button type="submit">Se connecter</button>
          <button
            type="submit"
            className="bg-black text-white w-60 p-1 rounded-sm"
          >
            S'inscrire
          </button>
        </div>
      </form>

      {error && <div className="text-red-500 text-center mt-3">{error}</div>}

      <div className="flex justify-center gap-5 mt-5">
        <button
          type="button"
          onClick={() => signIn("google")}
          className="bg-white text-black font-bold uppercase tracking-wides w-44 p-1 rounded-md"
        >
          Google
        </button>
        <button
          type="button"
          onClick={() => signIn("discord")}
          className="bg-white text-black font-bold uppercase tracking-widest w-44 p-1 rounded-md"
        >
          DISCORD
        </button>
        <button
          type="button"
          onClick={() => signIn("github")}
          className="bg-white text-black font-bold uppercase tracking-widest w-44 p-1 rounded-md"
        >
          GITHUB
        </button>
      </div>
    </>
  );
}
