import Link from "next/link";
import { FileText, Github, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-black py-12">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-red-600 text-white">
                            <FileText size={14} strokeWidth={3} />
                        </div>
                        <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                            I <span className="text-red-600 dark:text-red-500">HATE</span> PDF
                        </span>
                    </Link>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px]">
                        The tool for people who absolutely despise dealing with poorly formatted PDF files. 100% Free & Secure.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <a href="#" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <Twitter size={18} />
                        </a>
                        <a href="https://github.com/emreyoleri" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                            <Github size={18} />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 uppercase tracking-wider">Features</h3>
                    <ul className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <li><Link href="/merge-pdf" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Merge PDF</Link></li>
                        <li><Link href="/split-pdf" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Split PDF</Link></li>
                        <li><Link href="/compress-pdf" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Compress PDF</Link></li>
                        <li><Link href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">View All Tools</Link></li>
                    </ul>
                </div>

                {/* Hidden but keeping layout structure grid to push elements to sides if needed, or just left blank */}
                <div></div>

            </div>
            <div className="container mx-auto px-4 mt-12 pt-8 border-t border-zinc-200 dark:border-white/5 text-center text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Built with ❤️ by **Emre Yoleri**
                <div className="mt-2">
                    <a href="https://github.com/emreyoleri" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-500 hover:underline">
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}
