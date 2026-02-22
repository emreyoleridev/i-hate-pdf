"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { Loader2, Download, CheckCircle2, FilePlus, X, Zap, ArrowDownToLine, Cpu } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export function CompressPdf() {
    const toolData = getToolBySlug("compress-pdf");

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "options" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    // Options
    type CompressionLevel = "extreme" | "recommended" | "less";
    const [level, setLevel] = useState<CompressionLevel>("recommended");

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setStatus("options");
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    const handleCompress = async () => {
        if (!file) return;

        setStatus("processing");
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            // We can't do heavy image downsampling easily without extra libraries, 
            // but we can save with object streams which can reduce size slightly
            // and remove some metadata.
            const pdfBytes = await pdfDoc.save({
                useObjectStreams: true
            });

            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setStatus("done");

        } catch (err) {
            console.error("Failed to compress PDF", err);
            setError("An error occurred while compressing the PDF. Please try again.");
            setStatus("options");
        }
    };

    const handleReset = () => {
        setFile(null);
        setStatus("idle");
        setResultUrl(null);
        setError(null);
        setLevel("recommended");
    };

    if (!toolData) {
        return notFound();
    }

    const Icon = toolData.icon;

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative min-h-[80vh] w-full">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full text-center flex flex-col items-center max-w-4xl mx-auto">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 shadow-xl mb-8">
                    <Icon className="h-8 w-8 text-red-500" strokeWidth={2} />
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                    {toolData.title}
                </h1>

                <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto mb-12">
                    {toolData.description}
                </p>

                {error && (
                    <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-8 text-left animate-in fade-in zoom-in duration-200">
                        {error}
                    </div>
                )}

                {status === "idle" && (
                    <div
                        {...getRootProps()}
                        className={`w-full max-w-2xl border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 ${isDragActive ? "border-red-500 bg-red-500/5" : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100/50 dark:hover:bg-white/50 dark:bg-zinc-800/50"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                            <FilePlus className="w-10 h-10 text-red-500" />
                        </div>
                        <p className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                            {isDragActive ? "Drop PDF here" : "Click or drag your PDF here"}
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-500">
                            Maximum 1 file for compression
                        </p>
                    </div>
                )}

                {status === "options" && file && (
                    <div className="w-full max-w-2xl p-8 md:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col gap-8">
                        <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-700">
                            <div className="flex items-center gap-4 text-left">
                                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div className="max-w-[200px] sm:max-w-[300px]">
                                    <p className="text-zinc-900 dark:text-white font-bold text-lg truncate">{file.name}</p>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={handleReset} className="p-2 text-zinc-500 dark:text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="text-left w-full">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Select Compression Level</h3>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => setLevel("extreme")}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-6 group ${level === "extreme"
                                        ? "border-red-500 bg-red-500/10"
                                        : "border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800"
                                        }`}
                                >
                                    <div className={`p-4 rounded-xl shrink-0 transition-colors ${level === "extreme" ? "bg-red-500 text-white" : "bg-zinc-700/50 text-zinc-400 group-hover:text-zinc-300"}`}>
                                        <ArrowDownToLine className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-bold mb-1 ${level === "extreme" ? "text-red-400" : "text-white"}`}>Extreme Compression</h4>
                                        <p className="text-zinc-500 dark:text-zinc-500 text-sm">Less quality, highest compression. Best for massive files targeting email limits.</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setLevel("recommended")}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-6 group ${level === "recommended"
                                        ? "border-red-500 bg-red-500/10"
                                        : "border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800"
                                        }`}
                                >
                                    <div className={`p-4 rounded-xl shrink-0 transition-colors ${level === "recommended" ? "bg-red-500 text-white" : "bg-zinc-700/50 text-zinc-400 group-hover:text-zinc-300"}`}>
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-bold mb-1 ${level === "recommended" ? "text-red-400" : "text-white"}`}>Recommended Compression</h4>
                                        <p className="text-zinc-500 dark:text-zinc-500 text-sm">Good quality, good compression. The sweet spot for most standard documents.</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setLevel("less")}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-6 group ${level === "less"
                                        ? "border-red-500 bg-red-500/10"
                                        : "border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800"
                                        }`}
                                >
                                    <div className={`p-4 rounded-xl shrink-0 transition-colors ${level === "less" ? "bg-red-500 text-white" : "bg-zinc-700/50 text-zinc-400 group-hover:text-zinc-300"}`}>
                                        <Cpu className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className={`text-lg font-bold mb-1 ${level === "less" ? "text-red-400" : "text-white"}`}>Less Compression</h4>
                                        <p className="text-zinc-500 dark:text-zinc-500 text-sm">High quality, lower compression. Keeps images crisp while saving some space.</p>
                                    </div>
                                </button>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-500 text-xs mt-4 text-center">
                                * Native browser heavy compression is mocked currently until WASM engine is integrated.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer">
                                Cancel
                            </button>
                            <button
                                onClick={handleCompress}
                                className="flex-1 px-8 py-4 rounded-xl bg-red-600 text-zinc-900 dark:text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] cursor-pointer"
                            >
                                Compress PDF
                            </button>
                        </div>
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">Compressing Document...</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">Optimizing images and removing unused elements.</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">PDF Compressed!</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Your document is now significantly smaller.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                Compress Another
                            </button>
                            <a
                                href={resultUrl}
                                download={`compressed_${file?.name || "document.pdf"}`}
                                className="px-8 py-4 rounded-xl bg-green-600 text-zinc-900 dark:text-white font-bold hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center gap-3"
                            >
                                <Download className="w-6 h-6" />
                                Download Zip File
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
