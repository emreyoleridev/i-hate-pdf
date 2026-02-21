"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { PDFDocument, rgb } from "pdf-lib";
import { Loader2, Download, CheckCircle2, FilePlus, X } from "lucide-react";

type Position = "bottom-left" | "bottom-center" | "bottom-right";

export function PageNumbers() {
    const toolData = getToolBySlug("page-numbers");

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "options" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    // Default to bottom center
    const [position, setPosition] = useState<Position>("bottom-center");

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setStatus("options");
            setError(null);
            setPosition("bottom-center");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    const handleAddNumbers = async () => {
        if (!file) return;

        setStatus("processing");
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const pages = pdfDoc.getPages();

            pages.forEach((page, index) => {
                const { width } = page.getSize();
                const text = `${index + 1}`;
                const fontSize = 12;

                // Calculate X position based on user selection
                // The approximate width of a character is fontSize * 0.5
                const textWidth = text.length * (fontSize * 0.5);

                let x = width / 2 - textWidth / 2; // Default bottom-center

                if (position === "bottom-left") {
                    x = 30; // 30 points from left edge
                } else if (position === "bottom-right") {
                    x = width - 30 - textWidth; // 30 points from right edge
                }

                // Y is bottom margin
                const y = 30;

                page.drawText(text, {
                    x,
                    y,
                    size: fontSize,
                    color: rgb(0, 0, 0),
                });
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            setResultUrl(url);
            setStatus("done");
        } catch (err) {
            console.error("Failed to add page numbers", err);
            setError("An error occurred while adding page numbers. Please try again.");
            setStatus("options");
        }
    };

    const handleReset = () => {
        setFile(null);
        setStatus("idle");
        setResultUrl(null);
        setError(null);
        setPosition("bottom-center");
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
                            Maximum 1 file
                        </p>
                    </div>
                )}

                {status === "options" && file && (
                    <div className="w-full max-w-2xl p-10 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col gap-8">
                        <div className="flex items-center justify-between pb-6 border-b border-zinc-700">
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

                        <div className="text-left w-full py-4">
                            <h3 className="text-xl font-bold text-white mb-6">Position</h3>

                            <div className="grid grid-cols-3 gap-4">
                                <button
                                    onClick={() => setPosition("bottom-left")}
                                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${position === "bottom-left"
                                        ? "border-red-500 bg-red-500/10"
                                        : "border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700"
                                        }`}
                                >
                                    <div className="w-16 h-20 border-2 border-dashed border-zinc-600 rounded flex items-end justify-start p-2">
                                        <div className={`w-3 h-3 rounded-sm ${position === "bottom-left" ? "bg-red-500" : "bg-zinc-500"}`} />
                                    </div>
                                    <span className={`font-medium ${position === "bottom-left" ? "text-red-400" : "text-zinc-400"}`}>Left</span>
                                </button>

                                <button
                                    onClick={() => setPosition("bottom-center")}
                                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${position === "bottom-center"
                                        ? "border-red-500 bg-red-500/10"
                                        : "border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700"
                                        }`}
                                >
                                    <div className="w-16 h-20 border-2 border-dashed border-zinc-600 rounded flex items-end justify-center p-2">
                                        <div className={`w-3 h-3 rounded-sm ${position === "bottom-center" ? "bg-red-500" : "bg-zinc-500"}`} />
                                    </div>
                                    <span className={`font-medium ${position === "bottom-center" ? "text-red-400" : "text-zinc-400"}`}>Center</span>
                                </button>

                                <button
                                    onClick={() => setPosition("bottom-right")}
                                    className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-4 ${position === "bottom-right"
                                        ? "border-red-500 bg-red-500/10"
                                        : "border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700"
                                        }`}
                                >
                                    <div className="w-16 h-20 border-2 border-dashed border-zinc-600 rounded flex items-end justify-end p-2">
                                        <div className={`w-3 h-3 rounded-sm ${position === "bottom-right" ? "bg-red-500" : "bg-zinc-500"}`} />
                                    </div>
                                    <span className={`font-medium ${position === "bottom-right" ? "text-red-400" : "text-zinc-400"}`}>Right</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-600 text-zinc-300 font-medium hover:bg-zinc-700/50 hover:text-white transition-all">
                                Cancel
                            </button>
                            <button onClick={handleAddNumbers} className="flex-1 px-8 py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                                Add Page Numbers
                            </button>
                        </div>
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-white mt-4">Adding Numbers...</h3>
                        <p className="text-zinc-400 text-lg">Applying changes securely in your browser.</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-white mb-3">Numbered Successfully!</h3>
                            <p className="text-zinc-400 text-lg">Your document has been updated.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-600 text-zinc-300 font-medium hover:bg-zinc-700/50 hover:text-white transition-all">
                                Number Another
                            </button>
                            <a
                                href={resultUrl}
                                download="numbered_pages.pdf"
                                className="px-8 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center gap-3"
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
