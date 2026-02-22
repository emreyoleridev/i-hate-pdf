"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { Loader2, Download, CheckCircle2, FilePlus, X, Scale } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export function ComparePdf() {
    const toolData = getToolBySlug("compare-pdf");

    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "options" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [diffSummary, setDiffSummary] = useState<string | null>(null);

    const onDrop1 = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile1(acceptedFiles[0]);
            setStatus("options");
            setError(null);
        }
    }, []);

    const onDrop2 = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile2(acceptedFiles[0]);
            setStatus("options");
            setError(null);
        }
    }, []);

    const { getRootProps: getProps1, getInputProps: getInput1, isDragActive: active1 } = useDropzone({
        onDrop: onDrop1,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const { getRootProps: getProps2, getInputProps: getInput2, isDragActive: active2 } = useDropzone({
        onDrop: onDrop2,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const extractText = async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => 'str' in item ? item.str : "").join(" ") + "\n";
        }
        return text;
    };

    const handleCompare = async () => {
        if (!file1 || !file2) {
            setError("Please upload both PDF files to compare.");
            return;
        }

        setStatus("processing");
        setError(null);

        try {
            const text1 = await extractText(file1);
            const text2 = await extractText(file2);

            // Simple line-by-line comparison for the summary
            const lines1 = text1.split("\n");
            const lines2 = text2.split("\n");

            let additions = 0;
            let deletions = 0;

            // This is a naive diff, but works for a "browser-only" summary
            const set1 = new Set(lines1);
            const set2 = new Set(lines2);

            lines2.forEach(line => {
                if (line.trim() && !set1.has(line)) additions++;
            });
            lines1.forEach(line => {
                if (line.trim() && !set2.has(line)) deletions++;
            });

            const summary = `Comparison Report:\n\n` +
                `- File 1: ${file1.name} (${lines1.length} lines)\n` +
                `- File 2: ${file2.name} (${lines2.length} lines)\n\n` +
                `Potential Changes Detected:\n` +
                `- Approximately ${additions} new content segments found in File 2.\n` +
                `- Approximately ${deletions} segments from File 1 not found in File 2.\n\n` +
                `Note: This is a text-based comparison. Visual layout changes are not tracked.`;

            const blob = new Blob([summary], { type: "text/plain" });
            const url = URL.createObjectURL(blob);

            setDiffSummary(summary);
            setResultUrl(url);
            setStatus("done");
        } catch (err) {
            console.error("Failed to compare PDFs", err);
            setError("An error occurred during comparison. Ensure both files are valid PDFs.");
            setStatus("options");
        }
    };

    const handleReset = () => {
        setFile1(null);
        setFile2(null);
        setStatus("idle");
        setResultUrl(null);
        setDiffSummary(null);
        setError(null);
    };

    if (!toolData) {
        return notFound();
    }

    const Icon = toolData.icon;

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 relative min-h-[80vh] w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full text-center flex flex-col items-center max-w-5xl mx-auto">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mt-8">
                        <div {...getProps1()} className={`border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 ${active1 ? "border-red-500 bg-red-500/5 text-red-500" : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100/50 dark:hover:bg-white/50 dark:bg-zinc-800/50"}`}>
                            <input {...getInput1()} />
                            <FilePlus className="w-10 h-10 mb-4" />
                            <p className="font-bold">First PDF</p>
                            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">Original Version</p>
                        </div>
                        <div {...getProps2()} className={`border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 ${active2 ? "border-red-500 bg-red-500/5 text-red-500" : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100/50 dark:hover:bg-white/50 dark:bg-zinc-800/50"}`}>
                            <input {...getInput2()} />
                            <FilePlus className="w-10 h-10 mb-4" />
                            <p className="font-bold">Second PDF</p>
                            <p className="text-zinc-500 dark:text-zinc-500 text-sm mt-2">Updated Version</p>
                        </div>
                    </div>
                )}

                {status === "options" && (
                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                        <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col gap-4 text-left">
                            <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                <CheckCircle2 className={`w-5 h-5 ${file1 ? "text-green-500" : "text-zinc-600"}`} />
                                File 1: {file1?.name || "Missing"}
                            </h3>
                            {file1 ? (
                                <p className="text-zinc-500 dark:text-zinc-500 text-sm">{(file1.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                            ) : (
                                <div {...getProps1()} className="border-2 border-dashed border-zinc-700 rounded-xl p-4 text-center text-zinc-500 dark:text-zinc-500 hover:border-zinc-500 cursor-pointer">
                                    <input {...getInput1()} />
                                    Upload File 1
                                </div>
                            )}
                        </div>
                        <div className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col gap-4 text-left">
                            <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                <CheckCircle2 className={`w-5 h-5 ${file2 ? "text-green-500" : "text-zinc-600"}`} />
                                File 2: {file2?.name || "Missing"}
                            </h3>
                            {file2 ? (
                                <p className="text-zinc-500 dark:text-zinc-500 text-sm">{(file2.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                            ) : (
                                <div {...getProps2()} className="border-2 border-dashed border-zinc-700 rounded-xl p-4 text-center text-zinc-500 dark:text-zinc-500 hover:border-zinc-500 cursor-pointer">
                                    <input {...getInput2()} />
                                    Upload File 2
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-2 flex gap-4">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer">
                                Reset
                            </button>
                            <button
                                onClick={handleCompare}
                                disabled={!file1 || !file2}
                                className="flex-[2] px-8 py-4 rounded-xl bg-red-600 text-zinc-900 dark:text-white font-bold hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center gap-3 cursor-pointer"
                            >
                                <Scale className="w-6 h-6" />
                                Start Comparison
                            </button>
                        </div>
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl mt-12 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">Comparing Content...</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">Running client-side diffing algorithm.</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-3xl mt-12 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl text-left">
                        <div className="w-full flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-6">
                            <h3 className="text-3xl font-bold text-white">Comparison Results</h3>
                            <button onClick={handleReset} className="p-2 text-zinc-500 dark:text-zinc-500 hover:text-red-500 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="w-full bg-zinc-900/80 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 font-mono text-sm text-zinc-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto custom-scrollbar">
                            {diffSummary}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                New Comparison
                            </button>
                            <a
                                href={resultUrl}
                                download="comparison_report.txt"
                                className="flex-[2] px-8 py-4 rounded-xl bg-blue-600 text-zinc-900 dark:text-white font-bold hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-3"
                            >
                                <Download className="w-6 h-6" />
                                Download Full Report
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

