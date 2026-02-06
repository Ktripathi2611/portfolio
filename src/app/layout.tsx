import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import BackToTop from "@/components/ui/BackToTop";
import AIOrb from "@/components/ai/AIOrb";
import BehaviorTrackingWrapper from "@/components/ai/BehaviorTrackingWrapper";
import ImmersiveWrapper from "@/components/immersive/ImmersiveWrapper";
import PerformanceDebugPanel from "@/components/debug/PerformanceDebugPanel";
import { getJsonLd } from "@/lib/jsonld";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kushaltripathi.vercel.app"),
  title: {
    default: "Kushal Tripathi | Python Developer & Backend Engineer in Mumbai",
    template: "%s | Kushal Tripathi",
  },
  description:
    "Experienced Python Developer and Backend Engineer based in Mumbai, India. Specializing in Django, REST APIs, and scalable backend solutions.",
  keywords: [
    "Python Developer",
    "Backend Engineer",
    "Django Developer",
    "REST API Developer",
    "Mumbai Developer",
    "Kushal Tripathi",
    "Full Stack Developer",
    "Web Developer India",
  ],
  authors: [{ name: "Kushal Tripathi", url: "https://kushaltripathi.vercel.app" }],
  creator: "Kushal Tripathi",
  publisher: "Kushal Tripathi",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://kushaltripathi.vercel.app",
    siteName: "Kushal Tripathi Portfolio",
    title: "Kushal Tripathi | Python Developer & Backend Engineer",
    description:
      "Experienced Python Developer and Backend Engineer based in Mumbai, India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kushal Tripathi - Python Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kushal Tripathi | Python Developer",
    description: "Backend Engineer specializing in Django & REST APIs",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://kushaltripathi.vercel.app",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getJsonLd()) }}
        />
      </head>
      <body>
        <ImmersiveWrapper>
          <BehaviorTrackingWrapper>
            <ScrollProgress />
            <Navbar />

            {/* Main content with navbar offset */}
            <main className="main-content">
              {children}
            </main>

            <Footer />
            <BackToTop />
            <AIOrb />
          </BehaviorTrackingWrapper>
          <PerformanceDebugPanel />
        </ImmersiveWrapper>
        <Analytics />
      </body>
    </html>
  );
}
