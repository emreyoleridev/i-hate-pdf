"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, Download } from "lucide-react";

const steps = [
    {
        title: "Select your PDF",
        description: "Drag and drop your files into our secure interface. No files are uploaded to any server.",
        icon: Upload,
        color: "bg-blue-500"
    },
    {
        title: "Process Locally",
        description: "Our high-performance engine manipulates your PDF directly in your browser using your device's power.",
        icon: Cpu,
        color: "bg-red-500"
    },
    {
        title: "Instant Download",
        description: "Get your processed files immediately. Since there's no upload/download lag, it's nearly instant.",
        icon: Download,
        color: "bg-green-500"
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-zinc-950/50 relative">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">
                        Three simple steps to <span className="text-red-500 text-glow">freedom</span>
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Processing PDFs shouldn't be a chore. We've simplified the workflow to its core.
                    </p>
                </div>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.2 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className={`h-20 w-20 rounded-full ${step.color} flex items-center justify-center text-white mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)] ring-8 ring-zinc-900`}>
                                    <step.icon className="h-10 w-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                <p className="text-zinc-500 max-w-xs leading-relaxed">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
