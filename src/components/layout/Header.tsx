"use client";

import Link from "next/link";
import { Menu, X, FileText } from "lucide-react";
import { useState } from "react";

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        <FileText size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                        I <span className="text-red-600 dark:text-red-500">HATE</span> PDF
                    </span>
                </Link>
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        All Tools
                    </Link>
                    <Link href="/compress-pdf" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        Compress
                    </Link>
                    <Link href="/merge-pdf" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        Merge
                    </Link>
                    <Link href="/split-pdf" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                        Split
                    </Link>
                </nav>
                <div className="md:hidden flex items-center gap-4">
                    <button
                        className="text-zinc-900 dark:text-white p-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/10 py-4 px-4 flex flex-col gap-4 shadow-2xl">
                    <Link href="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        All Tools
                    </Link>
                    <Link href="/compress-pdf" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        Compress
                    </Link>
                    <Link href="/merge-pdf" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        Merge
                    </Link>
                    <Link href="/split-pdf" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                        Split
                    </Link>
                </div>
            )}
        </header>
    );
}
