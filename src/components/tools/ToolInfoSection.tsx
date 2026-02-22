"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap, Info } from "lucide-react";

interface ToolInfoSectionProps {
    toolId: string;
    title: string;
}

const toolContent: Record<string, {
    howTo: string[];
    features: string[];
    useCases: string[];
}> = {
    "merge-pdf": {
        howTo: [
            "Upload multiple PDF files from your computer.",
            "Drag and drop to reorder the files if needed.",
            "Click the 'Merge PDF' button to combine them.",
            "Download your new unified document instantly."
        ],
        features: [
            "Maintain original file quality",
            "No file size limits",
            "Secure local merging",
            "Works on all devices"
        ],
        useCases: [
            "Combining monthly reports into one year-end document",
            "Merging scanned pages into a single file",
            "Organizing project documentation for submission"
        ]
    },
    // Adding fallbacks for others
    "default": {
        howTo: [
            "Select the PDF file you wish to process.",
            "Wait for the tool to analyze the document structure.",
            "Apply your desired changes or settings.",
            "Download the processed result to your device."
        ],
        features: [
            "Zero privacy risk - files stay on your machine",
            "High-speed processing using client-side power",
            "No account or registration required",
            "Universal browser compatibility"
        ],
        useCases: [
            "Handling sensitive business documents safely",
            "Quick PDF edits on the go without heavy software",
            "Personal document management and optimization"
        ]
    }
};

export function ToolInfoSection({ toolId, title }: ToolInfoSectionProps) {
    const content = toolContent[toolId] || toolContent["default"];

    return (
        <div className="w-full max-w-5xl mx-auto py-24 px-4 border-t border-zinc-200 dark:border-zinc-900 mt-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                {/* How to use */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3 text-red-500">
                        <Info className="w-6 h-6" />
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-wider">How to {title}</h3>
                    </div>
                    <ul className="space-y-4">
                        {content.howTo.map((step, i) => (
                            <li key={i} className="flex gap-4">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center text-xs font-bold border border-zinc-300 dark:border-zinc-700">
                                    {i + 1}
                                </span>
                                <span className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{step}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3 text-green-500">
                        <ShieldCheck className="w-6 h-6" />
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Pro Features</h3>
                    </div>
                    <ul className="space-y-4">
                        {content.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500/50 mt-0.5" />
                                <span className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Use Cases */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3 text-blue-500">
                        <Zap className="w-6 h-6" />
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Common Uses</h3>
                    </div>
                    <ul className="space-y-4">
                        {content.useCases.map((useCase, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-2 flex-shrink-0" />
                                <span className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{useCase}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            </div>

            {/* Bottom informational banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-20 p-8 rounded-3xl border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center"
            >
                <ShieldCheck className="w-12 h-12 text-red-500 mb-4" />
                <h4 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">100% Secure & Client-Side</h4>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                    We value your privacy. Unlike other online tools, <span className="text-zinc-900 dark:text-white font-bold">I Hate PDF</span> doesn't upload your private documents to any server. All processing happens locally within your browser using your computer's resources.
                </p>
            </motion.div>
        </div>
    );
}
