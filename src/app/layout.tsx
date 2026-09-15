import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { MessageCircleMore } from "lucide-react";

import { Button } from "@/components/ui/button";

import "./globals.css";

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
      <body className="bg-background flex min-h-full flex-col items-center font-sans">
        <main className="flex w-full max-w-2xl flex-col">{children}</main>
        <footer className="my-4 w-full max-w-2xl">
          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLScOsLgjGb0QD1r621ZM4k7vkjsRDu8dpeFQcJyX77DF72s1tw/viewform?usp=publish-editor"
            title="Feeback"
            target="_blank"
            className="mb-8 w-full"
          >
            <Button
              variant="ghost"
              size="lg"

              className="hover:text-level-helpful-text 2xs:py-8 h-fit w-full cursor-pointer py-2 whitespace-normal"
            >
              <MessageCircleMore className="size-5" />
            </Button>
          </Link>
        </footer>
      </body>
    </html>
  );
}
