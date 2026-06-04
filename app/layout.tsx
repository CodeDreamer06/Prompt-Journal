import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Prompt Journal - Share Your LLM Conversations",
  description: "A beautiful blog for sharing LLM conversations with the world. Built with Next.js and Tailwind CSS.",
  keywords: ["LLM", "ChatGPT", "Claude", "Gemini", "GPT-4", "Perplexity", "Llama", "Mistral", "AI", "conversations", "blog"],
  authors: [{ name: "CodeDreamer06", url: "https://github.com/CodeDreamer06" }],
  openGraph: {
    title: "Prompt Journal",
    description: "Share your LLM conversations with the world",
    type: "website",
    siteName: "Prompt Journal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prompt Journal",
    description: "Share your LLM conversations with the world",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-paper text-ink`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
