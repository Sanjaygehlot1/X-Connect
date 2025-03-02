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
  const features = [
    {
      title: "Seamless Experience",
      description: "Enjoy an intuitive and user-friendly interface that makes connecting effortless."
    },
    {
      title: "Total Privacy",
      description: "Your identity stays hidden while you share your thoughts and ideas securely."
    },
    {
      title: "Real-Time Interaction",
      description: "Experience smooth, real-time messaging and stay connected with the community."
    },
    {
      title: "Community Driven",
      description: "Engage with a supportive community that values anonymity and free expression."
    }
  ];
  return (
    <main className="min-h-screen bg-background flex flex-col">
    <section className="container mx-auto px-6 py-16 text-center max-w-5xl">
      <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
        Connect Anonymously, Share Freely
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground mb-8">
        Express yourself and connect with others without ever revealing your identity.
      </p>
      <Link href="/signup">
        <Button variant="default" size="lg">Explore Now</Button>
      </Link>
    </section>

    <section className="bg-muted py-12 dark:bg-black">
      <div className="container mx-auto px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-6xl">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white dark:bg-black text-black dark:text-white rounded-lg shadow"
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">
              {feature.title}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  </main>
  )
}
