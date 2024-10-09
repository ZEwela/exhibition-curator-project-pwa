import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Exhibition Curator",
  description:
    "A viewer-driven virtual exhibition platform combining catalogs from museums and universities, built as a Progressive Web App using Next.js",
  manifest: "/manifest.json",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      url: "/web-app-manifest-192x192.png",
    },
    {
      rel: "icon",
      url: "/web-app-manifest-512x512.png",
      sizes: "512x512",
    },
    {
      rel: "icon",
      url: "/web-app-manifest-192x192.png",
      sizes: "192x192",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
