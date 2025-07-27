import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prompt Journal - Share Your LLM Conversations",
  description: "A beautiful blog for sharing LLM conversations with the world. Built with Next.js and Tailwind CSS.",
  keywords: ["LLM", "ChatGPT", "Claude", "Gemini", "AI", "conversations", "blog"],
  authors: [{ name: "CodeDreamer06", url: "https://github.com/CodeDreamer06" }],
  openGraph: {
    title: "Prompt Journal",
    description: "Share your LLM conversations with the world",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
