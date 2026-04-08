import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { baloo, dmSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "DetailX — Draw Once, Earn Forever",
  description:
    "The professional marketplace for architectural construction details. Browse, purchase, and download vetted building details from top architecture firms.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${baloo.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
