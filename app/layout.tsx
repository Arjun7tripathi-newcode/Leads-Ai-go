import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AgentationOverlay from "@/components/AgentationOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WorkflowAI — AI Automation That Actually Works",
  description:
    "Build workflows, generate leads, scrape data and automate operations from a single platform.",
  keywords: ["AI automation", "workflow automation", "AI tools", "enterprise AI", "AI platform"],
  openGraph: {
    title: "WorkflowAI — AI Automation That Actually Works",
    description:
      "Build workflows, generate leads, scrape data and automate operations from a single platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AgentationOverlay />
      </body>
    </html>
  );
}
