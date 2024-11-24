"use client";

import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { LikesProvider } from "@/contexts/LikeContext";
import Footer from "@/components/shared/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const Venite = localFont({
  src: "./fonts/VeniteAdoremus-rgRBA.ttf",
  variable: "--font-venite",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link rel="icon" href="/medias/asset_logo4.png" />
        <title>Assets - Store</title>
      </head>
  <SessionProvider>
    <LikesProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${Venite.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Contenu principal */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </LikesProvider>
  </SessionProvider>
</html>

  );
}
