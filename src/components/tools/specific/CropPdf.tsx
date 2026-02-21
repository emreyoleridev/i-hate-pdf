"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, CheckCircle2, FilePlus, X, Crop as CropIcon } from "lucide-react";

export function CropPdf() {
    const toolData = getToolBySlug("crop-pdf");

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "options" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    // Margins to crop (in points)
    const [marginTop, setMarginTop] = useState(50);
    const [marginBottom, setMarginBottom] = useState(50);
    const [marginLeft, setMarginLeft] = useState(50);
    const [marginRight, setMarginRight] = useState(50);

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

    const handleCrop = async () => {
        if (!file) return;

        setStatus("processing");
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);

            const pages = pdfDoc.getPages();

            pages.forEach((page) => {
                const { width, height } = page.getSize();

                // Calculate the new visible bounding box based on user margins.
                // Origin (0,0) is bottom-left for PDF format natively.
                const newX = marginLeft;
                const newY = marginBottom;
                const newWidth = width - marginLeft - marginRight;
                const newHeight = height - marginTop - marginBottom;

                // Ensure we don't crop negatively or create an invalid box
                if (newWidth > 0 && newHeight > 0) {
                    page.setCropBox(newX, newY, newWidth, newHeight);
                }
            });

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.buffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            setResultUrl(url);
            setStatus("done");
        } catch (err) {
            console.error("Failed to crop PDF", err);
            setError("An error occurred while cropping the PDF. Ensure margins are valid and within page bounds.");
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
                    <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-8 text-left animate-in fade-in zoom-in duration-200">
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
                            Upload a file to trim margins
                        </p>
                    </div>
                )}

                {status === "options" && file && (
                    <div className="w-full max-w-2xl p-8 md:p-10 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col gap-8">
                        <div className="flex items-center justify-between pb-6 border-b border-zinc-700">
                            <div className="flex items-center gap-4 text-left">
                                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div className="max-w-[200px] sm:max-w-[300px]">
                                    <p className="text-white font-bold text-lg truncate">{file.name}</p>
                                    <p className="text-zinc-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button onClick={handleReset} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="text-left w-full bg-zinc-900/50 p-6 rounded-2xl border border-zinc-700">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <CropIcon className="w-5 h-5 text-red-500" />
                                Remove Margins (Points)
                            </h3>
                            <p className="text-zinc-400 text-sm mb-6 border-l-2 border-red-500/50 pl-3">
                                Adjust the values below to slice off the outer edges of the document across all pages.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-400">Crop Top</label>
                                    <input
                                        type="number"
                                        value={marginTop}
                                        onChange={(e) => setMarginTop(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-400">Crop Bottom</label>
                                    <input
                                        type="number"
                                        value={marginBottom}
                                        onChange={(e) => setMarginBottom(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-400">Crop Left</label>
                                    <input
                                        type="number"
                                        value={marginLeft}
                                        onChange={(e) => setMarginLeft(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-zinc-400">Crop Right</label>
                                    <input
                                        type="number"
                                        value={marginRight}
                                        onChange={(e) => setMarginRight(Number(e.target.value))}
                                        className="w-full bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-2">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-600 text-zinc-300 font-medium hover:bg-zinc-700/50 hover:text-white transition-all cursor-pointer">
                                Cancel
                            </button>
                            <button
                                onClick={handleCrop}
                                className="flex-1 px-8 py-4 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] cursor-pointer"
                            >
                                Crop Document
                            </button>
                        </div>
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-white mt-4">Cropping PDF...</h3>
                        <p className="text-zinc-400 text-lg">Adjusting media box systematically.</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-white mb-3">PDF Cropped!</h3>
                            <p className="text-zinc-400 text-lg">Your margins have been trimmed.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-600 text-zinc-300 font-medium hover:bg-zinc-700/50 hover:text-white transition-all">
                                Crop Another
                            </button>
                            <a
                                href={resultUrl}
                                download={`cropped_${file?.name || "document.pdf"}`}
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
