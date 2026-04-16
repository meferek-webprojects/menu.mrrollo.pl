import type { Metadata } from "next";
import { Jost, Open_Sans, Caveat } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jost",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-caveat",
});

const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Menu | Mr. Rollo",
  description: "Naturalnie dla Ciebie – interaktywne menu Mr. Rollo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`h-full ${jost.variable} ${openSans.variable} ${caveat.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
