import { ToolCard } from "./ToolCard";
import { toolsData } from "@/config/tools";

export function ToolGrid() {
    return (
        <section className="py-20 px-4 container mx-auto">
            <div className="flex flex-col gap-24">
                {toolsData.map((group, groupIdx) => (
                    <div key={groupIdx} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2 border-b border-zinc-200 dark:border-white/10 pb-6">
                            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">
                                {group.category}
                            </h2>
                            <p className="text-zinc-500 font-medium max-w-2xl">
                                {group.description}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {group.items.map((tool) => (
                                <ToolCard
                                    key={tool.id}
                                    title={tool.title}
                                    description={tool.description}
                                    icon={tool.icon}
                                    href={tool.href}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
