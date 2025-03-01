import { Poppins } from "next/font/google";
import AuthProvider from "./context/Authprovider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/theme-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "X Connect",
  description: "An anonymous messaging app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
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
