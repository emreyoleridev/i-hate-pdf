"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, CheckCircle2, FilePlus, X, GripVertical } from "lucide-react";

export function MergePdf() {
    const toolData = getToolBySlug("merge-pdf");
    
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
        setStatus("idle");
        setError(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        }
    });

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === files.length - 1) return;

        setFiles(prev => {
            const newFiles = [...prev];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
            return newFiles;
        });
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError("Please upload at least 2 PDF files to merge.");
            return;
        }

        setStatus("processing");
        setError(null);

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setMergedPdfUrl(url);
            setStatus("done");
        } catch (err) {
            console.error("Failed to merge PDFs", err);
            setError("An error occurred while merging the PDFs. Please try again.");
            setStatus("idle");
        }
    };

    const handleReset = () => {
        setFiles([]);
        setStatus("idle");
        setMergedPdfUrl(null);
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
                    <div className="w-full max-w-2xl flex flex-col gap-6">
                        <div 
                            {...getRootProps()} 
                            className={`border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center bg-zinc-900/50 ${
                                isDragActive ? "border-red-500 bg-red-500/5" : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/50"
                            }`}
                        >
                            <input {...getInputProps()} />
                            <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                                <FilePlus className="w-10 h-10 text-red-500" />
                            </div>
                            <p className="text-xl font-bold text-white mb-2">
                                {isDragActive ? "Drop PDFs here" : "Click or drag PDFs here"}
                            </p>
                            <p className="text-zinc-500">
                                Select at least 2 files
                            </p>
                        </div>

                        {files.length > 0 && (
                            <div className="flex flex-col gap-3 text-left w-full mt-4">
                                <h3 className="text-lg font-bold text-white flex justify-between items-center">
                                    Selected Files ({files.length})
                                    <button 
                                        onClick={handleMerge}
                                        disabled={files.length < 2}
                                        className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
                                    >
                                        Merge PDFs
                                    </button>
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {files.map((file, i) => (
                                        <div key={`${file.name}-${i}`} className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 p-3 rounded-xl group transition-all hover:bg-zinc-800">
                                            <div className="flex flex-col gap-1 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => moveFile(i, 'up')} disabled={i === 0} className="text-zinc-500 hover:text-white disabled:opacity-30">▲</button>
                                                <button onClick={() => moveFile(i, 'down')} disabled={i === files.length - 1} className="text-zinc-500 hover:text-white disabled:opacity-30">▼</button>
                                            </div>
                                            <GripVertical className="w-5 h-5 text-zinc-500 cursor-grab active:cursor-grabbing" />
                                            <span className="text-zinc-300 font-medium flex-1 truncate">{file.name}</span>
                                            <span className="text-zinc-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            <button onClick={() => removeFile(i)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-white mt-4">Merging PDFs...</h3>
                        <p className="text-zinc-400 text-lg">Combining {files.length} files securely in your browser.</p>
                    </div>
                )}

                {status === "done" && mergedPdfUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-white mb-3">PDFs Merged Successfully!</h3>
                            <p className="text-zinc-400 text-lg">Your files have been combined into a single document.</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-600 text-zinc-300 font-medium hover:bg-zinc-700/50 hover:text-white transition-all">
                                Merge More
                            </button>
                            <a 
                                href={mergedPdfUrl}
                                download="merged.pdf"
                                className="px-8 py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center gap-3"
                            >
                                <Download className="w-6 h-6" />
                                Download Merged PDF
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
