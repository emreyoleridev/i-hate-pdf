"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";
import { PDFDocument } from "pdf-lib";
import { Loader2, Download, CheckCircle2, FilePlus, X, Camera, Trash2, SwitchCamera, Image as ImageIcon } from "lucide-react";

export function ScanToPdf() {
    const toolData = getToolBySlug("scan-to-pdf");

    const [images, setImages] = useState<string[]>([]);
    const [status, setStatus] = useState<"idle" | "capturing" | "processing" | "done">("idle");
    const [error, setError] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [usingCamera, setUsingCamera] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImages(prev => [...prev, result]);
            };
            reader.readAsDataURL(file);
        });
        setStatus("idle");
        setError(null);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        multiple: true
    });

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setUsingCamera(true);
            setStatus("capturing");
            setError(null);
        } catch (err) {
            console.error("Camera access denied", err);
            setError("Could not access camera. Please check permissions or upload files instead.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setUsingCamera(false);
        if (status === "capturing") setStatus("idle");
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                setImages(prev => [...prev, dataUrl]);
            }
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleGeneratePdf = async () => {
        if (images.length === 0) return;

        setStatus("processing");
        setError(null);
        stopCamera();

        try {
            const pdfDoc = await PDFDocument.create();

            for (const imgDataUrl of images) {
                const base64Data = imgDataUrl.split(',')[1];
                const imgBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

                let embeddedImage;
                if (imgDataUrl.includes("image/png")) {
                    embeddedImage = await pdfDoc.embedPng(imgBytes);
                } else {
                    embeddedImage = await pdfDoc.embedJpg(imgBytes);
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
            const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);

            setResultUrl(url);
            setStatus("done");
        } catch (err) {
            console.error("Failed to generate PDF from images", err);
            setError("An error occurred while creating the PDF. Please try again.");
            setStatus("idle");
        }
    };

    const handleReset = () => {
        stopCamera();
        setImages([]);
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

                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
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
                    <div className="w-full max-w-2xl flex flex-col gap-8">
                        {images.length > 0 && (
                            <div className="bg-white/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-6 mb-4">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="text-zinc-900 dark:text-white font-bold text-lg">Captured Scans ({images.length})</h3>
                                    <button onClick={() => setImages([])} className="text-zinc-500 dark:text-zinc-500 hover:text-red-400 text-sm font-medium transition-colors">Clear All</button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[240px] overflow-y-auto px-2 custom-scrollbar">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-zinc-600 group">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-1.5 bg-black/60 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-[10px] font-bold text-white rounded">
                                                Page {idx + 1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                            <button
                                onClick={startCamera}
                                className="flex flex-col items-center justify-center gap-4 p-10 rounded-3xl border-2 border-dashed border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 transition-all group"
                            >
                                <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-white mb-1">Use Camera</p>
                                    <p className="text-zinc-500 dark:text-zinc-500 text-sm">Snap photos of documents</p>
                                </div>
                            </button>

                            <div
                                {...getRootProps()}
                                className={`flex flex-col items-center justify-center gap-4 p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer group ${isDragActive ? "border-red-500 bg-red-500/5" : "border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 hover:border-zinc-500 hover:bg-white/50 dark:bg-zinc-800/50"
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-white mb-1">Upload Images</p>
                                    <p className="text-zinc-500 dark:text-zinc-500 text-sm">Convert photos to PDF</p>
                                </div>
                            </div>
                        </div>

                        {images.length > 0 && (
                            <button
                                onClick={handleGeneratePdf}
                                className="w-full mt-4 px-8 py-5 rounded-2xl bg-red-600 text-white font-black text-xl hover:bg-red-500 transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] active:scale-[0.98]"
                            >
                                Create Scanned PDF ({images.length} pages)
                            </button>
                        )}
                    </div>
                )}

                {status === "capturing" && (
                    <div className="w-full max-w-2xl p-6 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-zinc-950 shadow-2xl overflow-hidden relative">
                        <div className="aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden relative mb-6">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover scale-x-[-1]"
                            />
                            <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 rounded-full flex items-center gap-2 animate-pulse">
                                <div className="w-2 h-2 bg-white rounded-full" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live View</span>
                            </div>
                        </div>

                        <canvas ref={canvasRef} className="hidden" />

                        <div className="flex items-center justify-center gap-6">
                            <button
                                onClick={stopCamera}
                                className="p-4 rounded-full bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            >
                                <X className="w-7 h-7" />
                            </button>

                            <button
                                onClick={capturePhoto}
                                className="h-20 w-20 rounded-full border-4 border-white bg-red-500 flex items-center justify-center group active:scale-90 transition-all ring-8 ring-red-500/20"
                            >
                                <div className="h-14 w-14 rounded-full border-2 border-white/50 group-hover:scale-95 transition-transform" />
                            </button>

                            <button className="p-4 rounded-full bg-zinc-800 text-zinc-400 pointer-events-none opacity-20">
                                <SwitchCamera className="w-7 h-7" />
                            </button>
                        </div>

                        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative h-16 w-12 shrink-0 rounded border border-zinc-600 overflow-hidden shadow-lg animate-in fade-in slide-in-from-right-4">
                                    <img src={img} className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="h-16 w-12 shrink-0 rounded border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-700">
                                <Camera className="w-4 h-4" />
                            </div>
                        </div>

                        {images.length > 0 && (
                            <button
                                onClick={() => setStatus("idle")}
                                className="w-full mt-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl transition-colors border border-zinc-200 dark:border-zinc-700"
                            >
                                Done Capturing
                            </button>
                        )}
                    </div>
                )}

                {status === "processing" && (
                    <div className="w-full max-w-2xl p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-6 shadow-2xl">
                        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">Generating PDF...</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-lg">Bundling images into a legal-standard document.</p>
                    </div>
                )}

                {status === "done" && resultUrl && (
                    <div className="w-full max-w-2xl mt-8 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm flex flex-col items-center gap-8 shadow-2xl">
                        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center mb-2 ring-4 ring-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">PDF Scanned!</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg">Your images have been successfully converted into a PDF.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
                            <button onClick={handleReset} className="px-6 py-4 rounded-xl border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100/50 dark:hover:bg-zinc-700/50 hover:text-zinc-900 dark:hover:text-white transition-all">
                                Scan Another
                            </button>
                            <a
                                href={resultUrl}
                                download="scanned_document.pdf"
                                className="px-8 py-4 rounded-xl bg-green-600 text-zinc-900 dark:text-white font-bold hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center gap-3"
                            >
                                <Download className="w-6 h-6" />
                                Download Scanned PDF
                            </a>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
