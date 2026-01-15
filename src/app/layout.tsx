import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WebsiteStructuredData, OrganizationStructuredData } from "@/components/StructuredData";
import ManifestoBanner from "@/components/ManifestoBanner";

export const metadata: Metadata = {
  title: "DEMISMATCH — Human Again. Then More Than Human.",
  description: "We evolved for a world that no longer exists. Depression, anxiety, addiction aren't malfunctions—they're your biology correctly signaling something is wrong with your environment, not you.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://demismatch.com"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DEMISMATCH",
  },
  openGraph: {
    title: "DEMISMATCH — Human Again. Then More Than Human.",
    description: "We evolved for a world that no longer exists. Depression, anxiety, addiction aren't malfunctions—they're your biology correctly signaling something is wrong with your environment, not you.",
    url: "https://demismatch.com",
    siteName: "DEMISMATCH",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DEMISMATCH — The framework for knowing whether technology exploits human nature or meets it.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DEMISMATCH — Human Again. Then More Than Human.",
    description: "We evolved for a world that no longer exists. The framework for knowing whether technology exploits human nature or meets it.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=Lora:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;900&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <WebsiteStructuredData />
        <OrganizationStructuredData />
        <ManifestoBanner />
        {children}
      </body>
    </html>
  );
}
