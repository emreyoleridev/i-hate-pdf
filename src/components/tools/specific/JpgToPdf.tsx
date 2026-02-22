"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, CheckCircle2, FilePlus, X, Image as ImageIcon } from "lucide-react";

export function JpgToPdf() {
    const toolData = getToolBySlug("jpg-to-pdf");

    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<"idle" | "options" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFiles(prev => [...prev, ...acceptedFiles]);
            setStatus("options");
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        multiple: true
    });

    const removeFile = (index: number) => {
        setFiles(prev => {
            const newFiles = prev.filter((_, i) => i !== index);
            if (newFiles.length === 0) setStatus("idle");
            return newFiles;
        });
    };

    const handleConvert = async () => {
        if (files.length === 0) return;

        setStatus("processing");
        setError(null);

        try {
            const pdfDoc = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                let embeddedImage;

                if (file.type === "image/png") {
                    embeddedImage = await pdfDoc.embedPng(arrayBuffer);
                } else {
                    embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
                }

                const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width: embeddedImage.width,
                    height: embeddedImage.height,
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setStatus("done");
        } catch (err) {
            console.error("Failed to convert images to PDF", err);
            setError("An error occurred during conversion. Please ensure all files are valid JPG/PNG images.");
            setStatus("options");
        }
    };

    const handleReset = () => {
        setFiles([]);
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
                            {isDragActive ? "Drop images here" : "Click or drag your images here"}
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-500">
                            Upload JPG or PNG files to convert to PDF
                        </p>
                    </div>
                )}

                {status === "options" && files.length > 0 && (
                    <div className="w-full max-w-2xl p-8 md:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col gap-8">
                        <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-700">
                            <h3 className="text-zinc-900 dark:text-white font-bold text-lg">Selected Images ({files.length})</h3>
                            <button onClick={handleReset} className="p-2 text-zinc-500 dark:text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {files.map((file, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-900 group">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-zinc-700" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button onClick={(e) => { e.stopPropagation(); removeFile(idx); }} className="p-2 bg-red-500 rounded-full text-white hover:bg-red-400">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="absolute bottom-0 left-0 right-0 p-1 bg-black/60 text-[10px] text-white truncate text-center">{file.name}</p>
                                </div>
                            ))}
                            <div {...getRootProps()} className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-500 hover:border-zinc-500 hover:text-zinc-400 transition-all cursor-pointer">
                                <input {...getInputProps()} />
                                <FilePlus className="w-6 h-6 mb-1" />
                                <span className="text-[10px] font-bold">Add More</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleConvert}
                                className="flex-1 px-8 py-4 rounded-xl bg-red-600 text-zinc-900 dark:text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                            >
                                Convert to PDF
                            </button>
                        </div>
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">Creating PDF...</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">Processing images securely in your browser.</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">PDF Ready!</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Your images have been converted to a PDF document.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                Convert More
                            </button>
                            <a
                                href={resultUrl}
                                download="converted_images.pdf"
                                className="px-8 py-4 rounded-xl bg-green-600 text-zinc-900 dark:text-white font-bold hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center gap-3"
                            >
                                <Download className="w-6 h-6" />
                                Download PDF
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

