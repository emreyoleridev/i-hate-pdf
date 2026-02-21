"use client";

import { ToolInterface } from "../ToolInterface";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function ComparePdf() {
    const toolData = getToolBySlug("compare-pdf");
    
    if (!toolData) {
        return notFound();
    }

    return (
        <ToolInterface 
            title={toolData.title}
            description={toolData.description}
            icon={toolData.icon}
            actionLabel={toolData.actionLabel}
            toolId={toolData.id}
        />
    );
}
