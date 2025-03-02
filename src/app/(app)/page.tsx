import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "X Connect",
    description: "An anonymous messaging app",
    keywords: "anonymous messaging, privacy, chat",
    openGraph: {
      title: "X Connect",
      description: "Send and receive anonymous messages securely.",
      url: "https://xconnect.vercel.app",
      siteName: "X Connect",
      type: "website",
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
      other: [
        { rel: "manifest", url: "/site.webmanifest" },
      ],
    },
  };
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      

      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-extrabold mb-4">
          Connect Anonymously, Share Freely
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Express yourself and connect with others without ever revealing your identity.
        </p>
        <Link href="/signup">
          <Button variant="default" size="lg">
            Explore Now
          </Button>
        </Link>
      </section>

      <section className="bg-muted py-12 dark:bg-black">
        <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2">
          <div className="p-6 bg-white dark:bg-black text-black dark:text-white rounded-lg shadow">
            <h3 className="text-3xl  bg-white dark:bg-black text-black dark:text-white font-bold mb-2">Seamless Experience</h3>
            <p className="text-muted-foreground  bg-white dark:bg-black text-black dark:text-white">
              Enjoy an intuitive and user-friendly interface that makes connecting effortless.
            </p>
          </div>
          <div className="p-6  bg-white dark:bg-black text-black dark:text-white rounded-lg shadow">
            <h3 className="text-3xl  bg-white dark:bg-black text-black dark:text-white font-bold mb-2">Total Privacy</h3>
            <p className="text-muted-foreground  bg-white dark:bg-black text-black dark:text-white">
              Your identity stays hidden while you share your thoughts and ideas securely.
            </p>
          </div>
          <div className="p-6  bg-white dark:bg-black text-black dark:text-white rounded-lg shadow">
            <h3 className="text-3xl font-bold  bg-white dark:bg-black text-black dark:text-white mb-2">Real-Time Interaction</h3>
            <p className="text-muted-foreground  bg-white dark:bg-black text-black dark:text-white">
              Experience smooth, real-time messaging and stay connected with the community.
            </p>
          </div>
          <div className="p-6  bg-white dark:bg-black text-black dark:text-white rounded-lg shadow">
            <h3 className="text-3xl  bg-white dark:bg-black text-black dark:text-white font-bold mb-2">Community Driven</h3>
            <p className="text-muted-foreground  bg-white dark:bg-black text-black dark:text-white">
              Engage with a supportive community that values anonymity and free expression.
            </p>
          </div>
        </div>
      </section>

     
    </main>
  )
}
