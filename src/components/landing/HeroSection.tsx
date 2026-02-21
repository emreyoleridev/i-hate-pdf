"use client";

import { motion } from "framer-motion";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 flex items-center justify-center min-h-[60vh]">
            {/* Background accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-red-900/10 dark:bg-red-900/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 text-sm mb-8 font-medium backdrop-blur-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        100% Free & Secure. All processing happens on your device.
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white mb-6 leading-[1.1]"
                    >
                        We <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">FIX</span> what you <span className="line-through decoration-red-600/50 decoration-8">HATE</span> about PDFs
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 mb-10 max-w-2xl font-medium"
                    >
                        The ultimate online tool to merge, split, compress, and convert PDFs.
                        All the tools you need, completely free, with zero uploaded files to protect your privacy.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
