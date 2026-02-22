"use client";

import Link from "next/link";
import { FileText, Github } from "lucide-react";

export function Header() {

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
            <div className="w-full max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                        <FileText size={18} strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white uppercase">
                        I <span className="text-red-600 dark:text-red-500">HATE</span> PDF
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/emreyoleridev/i-hate-pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-500 transition-all hover:scale-110"
                        title="View on GitHub"
                    >
                        <Github className="w-5 h-5" />

                    </a>
                </div>
            </div>
        </header>
    );
}
