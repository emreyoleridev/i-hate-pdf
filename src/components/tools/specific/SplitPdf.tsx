"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { PDFDocument, degrees } from "pdf-lib";
import { Loader2, Download, CheckCircle2, FilePlus, X, RotateCw, RotateCcw } from "lucide-react";
import JSZip from "jszip";

export function SplitPdf() {
    const toolData = getToolBySlug("split-pdf");

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "options" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isMultiple, setIsMultiple] = useState(false);

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

    const handleSplit = async () => {
        if (!file) return;

        setStatus("processing");
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const sourceDoc = await PDFDocument.load(arrayBuffer);
            const totalPages = sourceDoc.getPageCount();

            const zip = new JSZip();

            for (let i = 0; i < totalPages; i++) {
                const newPdf = await PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(sourceDoc, [i]);
                newPdf.addPage(copiedPage);

                const pdfBytes = await newPdf.save();
                zip.file(`split_page_${i + 1}.pdf`, pdfBytes);
            }

            const zipBlob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(zipBlob);

            setResultUrl(url);
            setIsMultiple(true);
            setStatus("done");
        } catch (err) {
            console.error("Failed to split PDF", err);
            setError("An error occurred while splitting the PDF. Please try again.");
            setStatus("options");
        }
    };

    const handleReset = () => {
        setFile(null);
        setStatus("idle");
        setResultUrl(null);
        setError(null);
    };

    if (!toolData) {
        return notFound();
    }

    const Icon = toolData.icon;

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative min-h-[80vh] w-full">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full text-center flex flex-col items-center max-w-4xl mx-auto">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-zinc-300 shadow-xl mb-8">
                    <Icon className="h-8 w-8 text-red-500" strokeWidth={2} />
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
                    {toolData.title}
                </h1>

                <p className="text-xl text-zinc-400 font-medium max-w-2xl mx-auto mb-12">
                    {toolData.description}
                </p>

                {error && (
                    <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-8 text-left">
                        {error}
                    </div>
                )}

                {status === "idle" && (
                    <div
                        {...getRootProps()}
                        className={`w-full max-w-2xl border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center bg-zinc-900/50 ${isDragActive ? "border-red-500 bg-red-500/5" : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50"
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                            <FilePlus className="w-10 h-10 text-red-500" />
                        </div>
                        <p className="text-xl font-bold text-white mb-2">
                            {isDragActive ? "Drop PDF here" : "Click or drag your PDF here"}
                        </p>
                        <p className="text-zinc-500">
                            Maximum 1 file for splitting
                        </p>
                    </div>
                )}

                {status === "options" && file && (
                    <div className="w-full max-w-2xl p-10 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm shadow-2xl">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-700">
                            <div className="flex items-center gap-4 text-left">
                                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-lg truncate max-w-[300px]">{file.name}</p>
                                    <p className="text-zinc-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={handleReset} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="text-left mb-8">
                            <h3 className="text-xl font-bold text-white mb-4">Split Mode</h3>
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 cursor-pointer ring-2 ring-red-500">
                                <div className="mt-1 flex-shrink-0">
                                    <div className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center bg-red-500">
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-white font-bold">Split into individual pages</p>
                                    <p className="text-zinc-400 text-sm">Every page will head into a separate PDF file. Downloaded as a ZIP.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-600 text-zinc-300 font-medium hover:bg-zinc-700/50 hover:text-white transition-all">
                                Cancel
                            </button>
                            <button onClick={handleSplit} className="flex-1 px-8 py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                                Split PDF
                            </button>
                        </div>
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-white mt-4">Splitting PDF...</h3>
                        <p className="text-zinc-400 text-lg">Separating pages securely in your browser.</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-white mb-3">PDF Split Successfully!</h3>
                            <p className="text-zinc-400 text-lg">Your document has been split into multiple files.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-600 text-zinc-300 font-medium hover:bg-zinc-700/50 hover:text-white transition-all">
                                Split Another
                            </button>
                            <a
                                href={resultUrl}
                                download={isMultiple ? "split_pdfs.zip" : "split.pdf"}
                                className="px-8 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center gap-3"
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
