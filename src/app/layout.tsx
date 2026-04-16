import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pl" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
