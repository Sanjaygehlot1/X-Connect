import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer";

export const metadata = {
  title: 'X Connect',
  description: 'An anonymous messaging app',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
      <Footer/>
    </div>
  )
}
