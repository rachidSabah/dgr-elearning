import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegister } from "@/components/elearning/sw-register";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DGR eLearning | Dangerous Goods Regulations - Cabin Crew Training",
  description:
    "Comprehensive interactive eLearning platform for Dangerous Goods Regulations (DGR) cabin crew training. Based on ICAO Technical Instructions and IATA DGR Edition 2024.",
  keywords: [
    "Dangerous Goods Regulations",
    "DGR",
    "Cabin Crew Training",
    "ICAO",
    "IATA",
    "Aviation Training",
    "Dangerous Goods",
    "Aviation Safety",
    "eLearning",
  ],
  authors: [{ name: "Aviation Training Authority" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DGR eLearning",
  },
  openGraph: {
    title: "DGR eLearning | Dangerous Goods Regulations Training",
    description:
      "Interactive cabin crew training platform for Dangerous Goods Regulations based on ICAO Technical Instructions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DGR eLearning Platform",
    description: "Comprehensive Dangerous Goods Regulations training for cabin crew",
  },
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        {children}
        <Toaster />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
