"use client";

import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { LucideIcon, Loader2, Download, CheckCircle2 } from "lucide-react";

interface ToolInterfaceProps {
    title: string;
    description: string;
    icon: LucideIcon;
    actionLabel: string;
    toolId: string;
}

export function ToolInterface({ title, description, icon: Icon, actionLabel, toolId }: ToolInterfaceProps) {
    const [fileStatus, setFileStatus] = useState<"idle" | "selected" | "processing" | "done">("idle");
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileSelect = () => {
        // Mock file selection
        setTimeout(() => {
            setFileName(`mock_file_for_${toolId}.pdf`);
            setFileStatus("selected");
        }, 500);
    };

    const handleProcess = () => {
        setFileStatus("processing");
        setTimeout(() => {
            setFileStatus("done");
        }, 2000);
    };

    const handleReset = () => {
        setFileStatus("idle");
        setFileName(null);
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative min-h-[80vh] w-full">
            {/* Dynamic Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full text-center flex flex-col items-center max-w-4xl mx-auto">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 shadow-xl mb-8">
                    <Icon className="h-8 w-8 text-red-500" strokeWidth={2} />
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                    {title}
                </h1>

                <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto mb-12">
                    {description}
                </p>

                {fileStatus === "idle" && (
                    <div onClick={handleFileSelect} className="w-full">
                        <FileUpload actionLabel={actionLabel} />
                    </div>
                )}

                {fileStatus === "selected" && (
                    <div className="w-full max-w-2xl mt-8 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="flex flex-col items-center gap-4 text-zinc-700 dark:text-zinc-300">
                            <Icon className="w-12 h-12 text-red-500" />
                            <span className="text-xl font-medium truncate max-w-[300px]">{fileName}</span>
                            <span className="text-sm text-zinc-600 dark:text-zinc-500">Ready for processing</span>
                        </div>

                        <div className="flex gap-4 w-full sm:w-auto">
                            <button onClick={handleReset} className="flex-1 sm:flex-none px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleProcess} className="flex-1 sm:flex-none px-8 py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-95 cursor-pointer">
                                Process File
                            </button>
                        </div>
                    </div>
                )}

                {fileStatus === "processing" && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">Processing...</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">Please wait while we perform the operation.</p>
                        <div className="w-64 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-red-500 animate-pulse rounded-full w-full"></div>
                        </div>
                    </div>
                )}

                {fileStatus === "done" && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">Task Complete!</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Your file has been processed successfully.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer">
                                Process Another
                            </button>
                            <button className="px-8 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] active:scale-95 flex items-center justify-center gap-3 cursor-pointer">
                                <Download className="w-6 h-6" />
                                Download Result
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
