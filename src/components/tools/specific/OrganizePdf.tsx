"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, CheckCircle2, FilePlus, X, GripVertical, Trash2 } from "lucide-react";

export function OrganizePdf() {
    const toolData = getToolBySlug("organize-pdf");

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "options" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    // Track the order and existence of pages. By default: [0, 1, 2, ... totalPages-1]
    const [pagesState, setPagesState] = useState<{ id: number; originalIndex: number }[]>([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const uploadedFile = acceptedFiles[0];
            setFile(uploadedFile);
            setStatus("options");
            setError(null);

            try {
                // Peek at the PDF to get page count
                const arrayBuffer = await uploadedFile.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                const count = pdfDoc.getPageCount();

                // Initialize pages array
                const initialPages = Array.from({ length: count }, (_, i) => ({
                    id: Date.now() + i,
                    originalIndex: i
                }));
                setPagesState(initialPages);
            } catch (err) {
                console.error("Failed to read PDF pages", err);
                setError("Could not read the PDF file. It might be corrupted or password-protected.");
                setFile(null);
                setStatus("idle");
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false
    });

    const movePage = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === pagesState.length - 1) return;

        setPagesState(prev => {
            const newPages = [...prev];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newPages[index], newPages[targetIndex]] = [newPages[targetIndex], newPages[index]];
            return newPages;
        });
    };

    const deletePage = (index: number) => {
        setPagesState(prev => prev.filter((_, i) => i !== index));
    };

    const handleOrganize = async () => {
        if (!file || pagesState.length === 0) {
            setError("Document must have at least one page.");
            return;
        }

        setStatus("processing");
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const sourceDoc = await PDFDocument.load(arrayBuffer);

            const newPdf = await PDFDocument.create();

            // Collect the exact original indices requested by the user
            const targetIndices = pagesState.map(p => p.originalIndex);

            // Copy exactly those pages in the specified order
            const copiedPages = await newPdf.copyPages(sourceDoc, targetIndices);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            setResultUrl(url);
            setStatus("done");
        } catch (err) {
            console.error("Failed to organize PDF", err);
            setError("An error occurred while organizing the PDF. Please try again.");
            setStatus("options");
        }
    };

    const handleReset = () => {
        setFile(null);
        setStatus("idle");
        setResultUrl(null);
        setError(null);
        setPagesState([]);
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
                    <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-8 text-left">
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
                            Maximum 1 file
                        </p>
                    </div>
                )}

                {status === "options" && file && (
                    <div className="w-full max-w-2xl p-8 md:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-700 mb-8">
                            <div className="flex items-center gap-4 text-left overflow-hidden mr-4">
                                <div className="p-3 bg-red-500/10 rounded-xl text-red-500 shrink-0">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-zinc-900 dark:text-white font-bold text-lg truncate w-full">{file.name}</p>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB • {pagesState.length} pages</p>
                                </div>
                            </div>
                            <button onClick={handleReset} className="p-2 shrink-0 text-zinc-500 dark:text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="text-left mb-8 flex-1">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">Organize Pages</h3>
                                <p className="text-sm text-zinc-400">{pagesState.length} active pages</p>
                            </div>

                            {pagesState.length === 0 ? (
                                <div className="py-12 text-center border-2 border-dashed border-red-500/30 rounded-2xl bg-red-500/5 text-red-400">
                                    You deleted all pages! Reset to start over.
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {pagesState.map((page, index) => (
                                        <div key={page.id} className="bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 flex flex-col gap-3 group hover:border-zinc-500 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-300">New Page {index + 1}</span>
                                                <button onClick={() => deletePage(index)} className="text-zinc-600 hover:text-red-500 bg-zinc-800 hover:bg-red-500/10 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="flex-1 flex flex-col items-center justify-center py-6 bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                                <span className="text-2xl font-black text-white opacity-20 group-hover:opacity-50 transition-opacity">
                                                    {page.originalIndex + 1}
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-2 mt-auto">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); movePage(index, 'up'); }}
                                                    disabled={index === 0}
                                                    className="flex-1 py-1.5 bg-zinc-800 rounded text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-800 disabled:cursor-not-allowed text-xs font-bold"
                                                >
                                                    ◄
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); movePage(index, 'down'); }}
                                                    disabled={index === pagesState.length - 1}
                                                    className="flex-1 py-1.5 bg-zinc-800 rounded text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-800 disabled:cursor-not-allowed text-xs font-bold"
                                                >
                                                    ►
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleOrganize}
                                disabled={pagesState.length === 0}
                                className="flex-1 px-8 py-4 rounded-xl bg-red-600 text-zinc-900 dark:text-white font-bold hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
                            >
                                Generate PDF
                            </button>
                        </div>
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">Organizing PDF...</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">Applying changes securely in your browser.</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">PDF Organized!</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Your document has been successfully updated.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                Organize Another
                            </button>
                            <a
                                href={resultUrl}
                                download="organized.pdf"
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
