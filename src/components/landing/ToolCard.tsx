import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    accentColor?: string;
}

export function ToolCard({ title, description, icon: Icon, href, accentColor = "group-hover:text-red-500" }: ToolCardProps) {
    return (
        <Link href={href} className="group block h-full">
            <div className="relative h-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/40 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)] hover:border-red-500/30">
                {/* Glow effect on hover */}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-500/10 blur-[40px] transition-all duration-300 group-hover:bg-red-500/20" />

                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 transition-colors duration-300 group-hover:bg-red-500/10 group-hover:border-red-500/20">
                    <Icon className={`h-6 w-6 transition-colors duration-300 ${accentColor}`} />
                </div>

                <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{description}</p>
            </div>
        </Link>
    );
}
