'use client'
import { Poppins } from "next/font/google";
import AuthProvider from "./context/Authprovider";
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";
import "./globals.css";
import { Providers } from "@/components/theme-provider";
import { useEffect,useState } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);
  return (
    <html lang="en" className={poppins.variable}>
       <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon"  sizes="32x32" href="/icon.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        <meta name="apple-mobile-web-app-title" content="X Connect" />
        <meta name="application-name" content="X Connect" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <AuthProvider>
        <Providers>
      <body
        className="font-poppins"
      >
        {children}
        <Toaster/>
       
      </body>
      </Providers>
      </AuthProvider>
    </html>
  );
}
