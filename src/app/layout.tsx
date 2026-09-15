import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MessageCircleMore } from "lucide-react";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Démo Étapes",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-background flex flex-col items-center">
        <main className="w-full max-w-2xl flex flex-col">{children}</main>
        <footer className="fixed bottom-1/12 right-1/12">
          <Link
            href=""
            title="contact"
            className="cursor-pointer hover:text-level-helpful-text"
          >
            <MessageCircleMore />
          </Link>
        </footer>
      </body>
    </html>
  );
}
