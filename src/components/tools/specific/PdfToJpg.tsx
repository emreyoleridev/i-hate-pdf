"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { Loader2, Download, CheckCircle2, FilePlus, X, Image as ImageIcon } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";

// Set up worker
// Set up worker - Use unpkg for version 5.x compatibility and ensure .mjs extension
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export function PdfToJpg() {
    const toolData = getToolBySlug("pdf-to-jpg");

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "options" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    // Options
    type QualityLevel = "standard" | "high";
    const [quality, setQuality] = useState<QualityLevel>("standard");

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

    const handleConvert = async () => {
        if (!file) return;

        setStatus("processing");
        setError(null);
        setProgress(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;

            const zip = new JSZip();
            const totalPages = pdf.numPages;
            const scale = quality === "high" ? 2.0 : 1.0;

            for (let i = 1; i <= totalPages; i++) {
                setProgress(Math.round(((i - 1) / totalPages) * 100));

                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                if (!context) throw new Error("Could not create canvas context");

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                } as any).promise;

                const blob = await new Promise<Blob | null>((resolve) =>
                    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9)
                );

                if (blob) {
                    zip.file(`page_${i}.jpg`, blob);
                }
            }

            setProgress(100);
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(zipBlob);
            setResultUrl(url);
            setStatus("done");

        } catch (err: any) {
            console.error("Failed to convert PDF to JPG", err);
            let userError = "An error occurred during rasterization.";
            if (err.name === "PasswordException") {
                userError = "This PDF is password protected. Please unlock it first.";
            } else if (err.name === "InvalidPDFException") {
                userError = "The file appears to be a corrupted or invalid PDF.";
            } else {
                userError = "Failed to process PDF. Technical error: " + (err.message || "Unknown").substring(0, 100);
            }
            setError(userError);
            setStatus("options");
        }
    };

    const handleReset = () => {
        setFile(null);
        setStatus("idle");
        setResultUrl(null);
        setError(null);
        setQuality("standard");
        setProgress(0);
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
                            Upload a PDF to rasterize into images
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
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Image Quality (DPI)</h3>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => setQuality("standard")}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between group ${quality === "standard"
                                        ? "border-red-500 bg-red-500/10"
                                        : "border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800"
                                        }`}
                                >
                                    <div>
                                        <h4 className={`text-lg font-bold mb-1 ${quality === "standard" ? "text-red-400" : "text-white"}`}>Standard Quality (150 DPI)</h4>
                                        <p className="text-zinc-500 dark:text-zinc-500 text-sm">Good for screens and casual sharing. Smaller file sizes.</p>
                                    </div>
                                    <div className={`p-4 rounded-xl shrink-0 transition-colors ${quality === "standard" ? "bg-red-500 text-white" : "bg-zinc-700/50 text-zinc-400 group-hover:text-zinc-300"}`}>
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                </button>

                                <button
                                    onClick={() => setQuality("high")}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between group ${quality === "high"
                                        ? "border-red-500 bg-red-500/10"
                                        : "border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800"
                                        }`}
                                >
                                    <div>
                                        <h4 className={`text-lg font-bold mb-1 ${quality === "high" ? "text-red-400" : "text-white"}`}>High Quality (300 DPI)</h4>
                                        <p className="text-zinc-500 dark:text-zinc-500 text-sm">Best for printing. Larger file sizes and slower rendering.</p>
                                    </div>
                                    <div className={`p-4 rounded-xl shrink-0 transition-colors ${quality === "high" ? "bg-red-500 text-white" : "bg-zinc-700/50 text-zinc-400 group-hover:text-zinc-300"}`}>
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer">
                                Cancel
                            </button>
                            <button
                                onClick={handleConvert}
                                className="flex-1 px-8 py-4 rounded-xl bg-red-600 text-zinc-900 dark:text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] cursor-pointer"
                            >
                                Extract JPGs
                            </button>
                        </div>
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">Rasterizing Pages...</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">Drawing PDF content onto image canvases iteratively.</p>
                        <div className="w-full bg-zinc-700 rounded-full h-2.5 mt-4">
                            <div className="bg-yellow-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-yellow-500 font-bold">{progress}%</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2 ring-4 ring-yellow-500/20">
                            <CheckCircle2 className="w-12 h-12 text-yellow-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">Images Extracted!</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Your pages have been saved as high-quality JPGs.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                Extract Another
                            </button>
                            <a
                                href={resultUrl}
                                download={`${file?.name.replace('.pdf', '') || "images"}_jpgs.zip`}
                                className="px-8 py-4 rounded-xl bg-yellow-600 text-zinc-900 dark:text-white font-bold hover:bg-yellow-500 transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] flex items-center justify-center gap-3"
                            >
                                <Download className="w-6 h-6" />
                                Download ZIP File
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

