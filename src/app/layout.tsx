import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoB-Roll Studio | Video VanzaLabs",
  description: "AI-powered Cadence-Aware B-Roll Video Timeline Generator. Automatically syncs dynamic stock & GenAI footage to author voiceover.",
  keywords: ["AI video editor", "B-Roll generator", "VanzaLabs", "Premiere XML export", "FCPXML", "TikTok Shorts AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#090b10] text-slate-100 min-h-screen selection:bg-accent-cyan selection:text-black">
        {children}
      </body>
    </html>
  );
}
