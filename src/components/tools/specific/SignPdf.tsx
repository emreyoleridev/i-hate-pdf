"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, CheckCircle2, FilePlus, X, PenTool, Image as ImageIcon } from "lucide-react";

export function SignPdf() {
    const toolData = getToolBySlug("sign-pdf");

    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [signFile, setSignFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "options" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    const onDropPdf = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setPdfFile(acceptedFiles[0]);
            setStatus("options");
            setError(null);
        }
    }, []);

    const onDropSign = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setSignFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps: getPdfProps, getInputProps: getPdfInput, isDragActive: isPdfActive } = useDropzone({
        onDrop: onDropPdf,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const { getRootProps: getSignProps, getInputProps: getSignInput, isDragActive: isSignActive } = useDropzone({
        onDrop: onDropSign,
        accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
        multiple: false
    });

    const handleSign = async () => {
        if (!pdfFile || !signFile) {
            setError("Please upload both a PDF and a signature image.");
            return;
        }

        setStatus("processing");
        setError(null);

        try {
            const pdfBytes = await pdfFile.arrayBuffer();
            const signBytes = await signFile.arrayBuffer();

            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            const lastPage = pages[pages.length - 1];

            let embeddedSign;
            if (signFile.type === "image/png") {
                embeddedSign = await pdfDoc.embedPng(signBytes);
            } else {
                embeddedSign = await pdfDoc.embedJpg(signBytes);
            }

            // Place signature at the bottom right of the last page by default
            const { width, height } = lastPage.getSize();
            const signWidth = 150;
            const signHeight = (embeddedSign.height / embeddedSign.width) * signWidth;

            lastPage.drawImage(embeddedSign, {
                x: width - signWidth - 50,
                y: 50,
                width: signWidth,
                height: signHeight,
            });

            const resultPdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(resultPdfBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setResultUrl(url);
            setStatus("done");
        } catch (err) {
            console.error("Failed to sign PDF", err);
            setError("An error occurred while signing the PDF. Ensure files are valid.");
            setStatus("options");
        }
    };

    const handleReset = () => {
        setPdfFile(null);
        setSignFile(null);
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
                        {...getPdfProps()}
                        className={`w-full max-w-2xl border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 ${isPdfActive ? "border-red-500 bg-red-500/5" : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100/50 dark:hover:bg-white/50 dark:bg-zinc-800/50"
                            }`}
                    >
                        <input {...getPdfInput()} />
                        <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                            <FilePlus className="w-10 h-10 text-red-500" />
                        </div>
                        <p className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                            {isPdfActive ? "Drop PDF here" : "Click or drag your PDF here"}
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-500">
                            Upload the PDF document you want to sign
                        </p>
                    </div>
                )}

                {status === "options" && pdfFile && (
                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col gap-6 text-left">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <FilePlus className="w-5 h-5 text-red-500" />
                                1. Document
                            </h3>
                            <div className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                                <div className="truncate">
                                    <p className="text-zinc-900 dark:text-white font-bold truncate">{pdfFile.name}</p>
                                    <p className="text-zinc-500 dark:text-zinc-500 text-sm">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button onClick={() => setPdfFile(null)} className="p-2 text-zinc-500 dark:text-zinc-500 hover:text-red-500 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col gap-6 text-left">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                <PenTool className="w-5 h-5 text-red-500" />
                                2. Signature Image
                            </h3>
                            {!signFile ? (
                                <div
                                    {...getSignProps()}
                                    className={`flex-1 border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 ${isSignActive ? "border-red-500 bg-red-500/5" : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100/50 dark:hover:bg-white/50 dark:bg-zinc-800/50"
                                        }`}
                                >
                                    <input {...getSignInput()} />
                                    <ImageIcon className="w-8 h-8 text-zinc-600 mb-2" />
                                    <p className="text-sm text-zinc-400 text-center font-medium">Upload PNG/JPG signature</p>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                                    <div className="truncate">
                                        <p className="text-zinc-900 dark:text-white font-bold truncate">{signFile.name}</p>
                                        <p className="text-zinc-500 dark:text-zinc-500 text-sm">Ready to place</p>
                                    </div>
                                    <button onClick={() => setSignFile(null)} className="p-2 text-zinc-500 dark:text-zinc-500 hover:text-red-500 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2 flex gap-4">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                Cancel
                            </button>
                            <button
                                onClick={handleSign}
                                disabled={!signFile}
                                className="flex-[2] px-8 py-4 rounded-xl bg-red-600 text-zinc-900 dark:text-white font-bold hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center gap-3"
                            >
                                <PenTool className="w-6 h-6" />
                                Sign and Download
                            </button>
                        </div>
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">Signing Document...</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">Applying signature to the last page securely.</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">PDF Signed!</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Your signed document is ready for download.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                Sign Another
                            </button>
                            <a
                                href={resultUrl}
                                download={`signed_${pdfFile?.name || "document.pdf"}`}
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

