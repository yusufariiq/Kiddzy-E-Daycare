import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";

const inter = Inter({
  weight: ['400', '900'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Kiddzy E-Daycare",
  description: "A platform designed for parents to discover and book childcare services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter} ${inter} antialiased`}
      >
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
