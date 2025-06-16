"use client"

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import { AuthProvider } from "@/context/auth.context";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname()
  const hideLayout = pathname.startsWith("/admin")
  const hideFooter = pathname.startsWith("/auth") || pathname.startsWith("/profile")

  return (
    <html lang="en">
      <body 
        className={`${poppins.variable} antialiased font-poppins`}
      >
        <AuthProvider>
          {!hideLayout && <Navbar />}
          {children}
          <Toaster position="top-right" reverseOrder={false} />
          {!hideLayout && !hideFooter && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}