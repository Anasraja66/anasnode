import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AnaOS } from "@/lib/anaos-config";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "Anaos — One Prompt. Your Entire Business, Automated.",
  description: "Describe your business in one line. Anaos builds your WhatsApp bot, CRM, content agent, and automations — instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
      </head>
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: 'var(--font-inter), sans-serif' }} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <div className="fixed bottom-2 right-2 text-xs text-zinc-500 opacity-50 pointer-events-none z-50 font-mono">
          {AnaOS.name} {AnaOS.version} (Build {AnaOS.build})
        </div>
      </body>
    </html>
  );
}
