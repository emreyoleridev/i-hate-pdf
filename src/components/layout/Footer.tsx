import { Github, Coffee } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-black py-12">
            <div className="container mx-auto px-4 flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-medium">
                    <span>Built with ❤️ by</span>
                    <span className="text-zinc-900 dark:text-white font-bold">Emre Yoleri</span>
                </div>

                <div className="flex items-center gap-4 flex-wrap justify-center">
                    <a
                        href="https://github.com/emreyoleridev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 transition-all group shadow-sm"
                    >
                        <Github size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">GitHub</span>
                    </a>

                    <a
                        href="https://buymeacoffee.com/emreyoleridev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-all group shadow-sm"
                    >
                        <Coffee size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Buy Me a Coffee</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
