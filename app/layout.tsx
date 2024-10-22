"use client";

import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

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
      <SessionProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${Venite.variable} antialiased`}
        >
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
