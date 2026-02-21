"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "Is 'I Hate PDF' really free?",
        answer: "Yes, 100% free. No subscriptions, no limits, no catches. We believe basic PDF tools should be accessible to everyone without paywalls or invasive ads."
    },
    {
        question: "Are my files safe?",
        answer: "Your files never leave your device. Unlike other PDF converters that upload your data to their servers, all the processing happens right in your web browser. Your privacy is guaranteed by design."
    },
    {
        question: "Do I need to create an account?",
        answer: "Never. You can use all our tools anonymously. We don't collect your email address or any other personal information."
    },
    {
        question: "Which browsers are supported?",
        answer: "All modern browsers (Chrome, Firefox, Safari, Edge) on Desktop and Mobile are supported. Since we use modern web technologies, we recommend keeping your browser updated for the best performance."
    },
    {
        question: "Can I use 'I Hate PDF' offline?",
        answer: "Yes! Once the page is loaded, most of our tools (Merge, Split, Rotate, etc.) will work without an internet connection because all the logic is stored in your browser's memory."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">
                        Common Questions
                    </h2>
                    <p className="text-zinc-400 text-lg">
                        Everything you need to know about the most secure PDF platform.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden transition-all"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full p-6 text-left flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                            >
                                <span className="text-lg font-bold text-white">{faq.question}</span>
                                {openIndex === idx ? <ChevronUp className="text-red-500" /> : <ChevronDown className="text-zinc-500" />}
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-zinc-800/50 mt-2">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
