"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { Loader2, Download, CheckCircle2, FilePlus, X, Globe } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function HtmlToPdf() {
    const toolData = getToolBySlug("html-to-pdf");

    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "options" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setStatus("options");
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/html': ['.html', '.htm'] },
        multiple: false
    });

    const handleConvert = async () => {
        if (!file || !containerRef.current) return;

        setStatus("processing");
        setError(null);

        try {
            const htmlContent = await file.text();

            // Create a temporary iframe to render the HTML safely
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.top = '-10000px';
            iframe.style.left = '-10000px';
            iframe.style.width = '800px'; // Standard width
            document.body.appendChild(iframe);

            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!doc) throw new Error("Could not access iframe document");

            doc.open();
            doc.write(htmlContent);
            doc.close();

            // Wait for resources (images, etc) to load
            await new Promise(resolve => setTimeout(resolve, 1000));

            const canvas = await html2canvas(doc.body, {
                useCORS: true,
                scale: 2,
                logging: false,
                width: 800
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            const pdfBlob = pdf.output('blob');
            const url = URL.createObjectURL(pdfBlob);

            document.body.removeChild(iframe);
            setResultUrl(url);
            setStatus("done");
        } catch (err) {
            console.error("Failed to convert HTML to PDF", err);
            setError("Conversion failed. Ensure the HTML file is valid and doesn't have blocked external resources.");
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

            <div ref={containerRef} className="hidden" />

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
                        className={`w-full max-w-2xl border-2 border-dashed rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 ${isDragActive ? "border-red-500 bg-red-500/5" : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-100/50 dark:hover:bg-white/50 dark:bg-zinc-800/50"}`}
                    >
                        <input {...getInputProps()} />
                        <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                            <FilePlus className="w-10 h-10 text-red-500" />
                        </div>
                        <p className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                            {isDragActive ? "Drop HTML here" : "Click or drag your HTML file here"}
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-500">
                            Upload a standard .html file to convert
                        </p>
                    </div>
                )}

                {status === "options" && file && (
                    <div className="w-full max-w-2xl p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm shadow-2xl flex flex-col gap-8">
                        <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-700">
                            <div className="flex items-center gap-4 text-left">
                                <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                                    <Icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-zinc-900 dark:text-white font-bold text-lg truncate max-w-[250px]">{file.name}</p>
                                    <p className="text-zinc-600 dark:text-zinc-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            </div>
                            <button onClick={handleReset} className="p-2 text-zinc-500 dark:text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="text-left w-full bg-zinc-50/50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 flex items-center gap-3">
                                <Globe className="w-5 h-5 text-blue-400" />
                                Web-to-PDF Engine
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                                We will render your HTML in a secure virtual container and capture it as a high-fidelity PDF document.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={handleReset} className="flex-1 px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer">
                                Cancel
                            </button>
                            <button
                                onClick={handleConvert}
                                className="flex-1 px-8 py-4 rounded-xl bg-red-600 text-zinc-900 dark:text-white font-bold hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] cursor-pointer"
                            >
                                Generate PDF
                            </button>
                        </div>
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">Rendering...</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">Capturing HTML viewport securely.</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">PDF Ready!</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">The HTML has been successfully converted.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                Try Another
                            </button>
                            <a
                                href={resultUrl}
                                download="web_page.pdf"
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
