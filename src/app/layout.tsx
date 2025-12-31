import type { Metadata, Viewport } from "next";
import "./globals.css";
import { WebsiteStructuredData, OrganizationStructuredData } from "@/components/StructuredData";
import ManifestoBanner from "@/components/ManifestoBanner";

export const metadata: Metadata = {
  title: "DEMISMATCH",
  description: "Find the perfect evolutionary mismatch image to respond to any content",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DEMISMATCH",
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
