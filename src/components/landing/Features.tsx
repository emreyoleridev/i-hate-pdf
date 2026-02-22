"use client";

import { Shield, Zap, Sparkles, Smile, CloudOff, Infinity } from "lucide-react";


const features = [
    {
        title: "100% Privacy",
        description: "Your files never touch our servers. All processing happens locally in your browser.",
        icon: Shield,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        title: "Blazing Fast",
        description: "No upload or download queues. Experience instant PDF manipulation directly on your hardware.",
        icon: Zap,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10"
    },
    {
        title: "Completely Free",
        description: "No hidden fees, no subscriptions, no credit cards. All 22+ tools are free forever.",
        icon: Infinity,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        title: "No Registration",
        description: "Start working immediately. We don't require accounts, emails, or any personal data.",
        icon: Smile,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
    {
        title: "Works Offline",
        description: "Since it's client-side, you can use most of our tools even without an internet connection.",
        icon: CloudOff,
        color: "text-orange-500",
        bg: "bg-orange-500/10"
    },
    {
        title: "Premium Experience",
        description: "A clean, ad-free, and dark-themed interface designed for professional productivity.",
        icon: Sparkles,
        color: "text-red-500",
        bg: "bg-red-500/10"
    }
];

export function Features() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="w-full max-w-[1400px] mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-zinc-900 dark:text-white tracking-tight">
                        Why people choose <span className="text-red-500">I Hate PDF</span>
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                        We built the platform we wanted to use: fast, secure, and respectful of your time and data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all group"
                        >
                            <div className={`h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 border border-zinc-200 dark:border-white/5 group-hover:scale-110 transition-transform`}>
                                <feature.icon className={`h-7 w-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-600 dark:text-zinc-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
