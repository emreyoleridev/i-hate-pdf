import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { ThemeProvider } from "../components/theme-provider";
import { ThemeToggle } from "../components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "I Hate PDF | Fast & Free PDF Tools",
  description: "The fastest, most reliable PDF tools on the web. Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white antialiased min-h-screen flex flex-col transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
