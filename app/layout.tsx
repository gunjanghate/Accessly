import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Web3Provider } from "@/context/Web3Context";
import { Analytics } from "@vercel/analytics/next"
const geistSans = Montserrat({
  variable: "--font-monsterrat",
  subsets: ["latin"],
});

const geistMono = Montserrat({
  variable: "--font-monsterrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Accessly – Decentralized Event Ticketing",
  description: "Mint, manage, and verify event tickets on-chain using Accessly – a blockchain-powered ticketing platform ensuring transparency and security.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100`}
      >
        <Web3Provider>
          <Header />
          {children}
          <Footer />
          <Analytics />
        </Web3Provider>
      </body>
    </html>
  );
}
