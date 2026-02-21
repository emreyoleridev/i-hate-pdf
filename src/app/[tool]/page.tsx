import { notFound } from "next/navigation";
import { getToolBySlug } from "@/config/tools";
import { ToolRegistry } from "@/components/tools/ToolRegistry";
import { ToolInfoSection } from "@/components/tools/ToolInfoSection";

interface ToolPageProps {
    params: Promise<{
        tool: string;
    }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
    const resolvedParams = await params;
    const toolData = getToolBySlug(resolvedParams.tool);

    if (!toolData) {
        notFound();
    }

    const SpecificTool = ToolRegistry[resolvedParams.tool];

    if (!SpecificTool) {
        notFound();
    }

    return (
        <div className="w-full flex flex-col">
            {SpecificTool}
            <ToolInfoSection toolId={resolvedParams.tool} title={toolData.title} />
        </div>
    );
}
