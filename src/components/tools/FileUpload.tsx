"use client";

import { UploadCloud } from "lucide-react";

interface FileUploadProps {
    actionLabel: string;
}

export function FileUpload({ actionLabel }: FileUploadProps) {
    return (
        <div className="w-full max-w-4xl mx-auto mt-12">
            <div className="relative group rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all p-12 md:p-24 flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer shadow-sm">
                {/* Glow behind */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-colors" />

                <div className="relative z-10 flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-red-600/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-red-600/20 transition-all">
                        <UploadCloud size={48} className="text-red-500" strokeWidth={1.5} />
                    </div>

                    <button className="px-10 py-5 bg-red-600 text-white text-xl font-bold rounded-2xl hover:bg-red-500 transition-all shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)] hover:scale-105 active:scale-95 mb-6">
                        {actionLabel}
                    </button>

                    <p className="text-zinc-500 text-sm font-medium">
                        or drop files here
                    </p>
                </div>
            </div>
        </div>
    );
}
