const fs = require('fs');
const path = require('path');

const tools = [
    "merge-pdf", "split-pdf", "organize-pdf", "page-numbers", "crop-pdf",
    "compress-pdf", "repair-pdf",
    "word-to-pdf", "ppt-to-pdf", "excel-to-pdf", "jpg-to-pdf", "html-to-pdf", "scan-to-pdf",
    "pdf-to-word", "pdf-to-jpg",
    "rotate-pdf", "watermark", "protect-pdf", "unlock-pdf", "sign-pdf", "redact-pdf", "compare-pdf"
];

function toPascalCase(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

const dir = path.join(__dirname, 'src/components/tools/specific');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

tools.forEach(tool => {
    const componentName = toPascalCase(tool);
    const code = `"use client";

import { ToolInterface } from "../ToolInterface";
import { getToolBySlug } from "@/config/tools";
import { notFound } from "next/navigation";

export function ${componentName}() {
    const toolData = getToolBySlug("${tool}");
    
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
`;
    fs.writeFileSync(path.join(dir, `${componentName}.tsx`), code);
});

const registryImports = tools.map(tool => `import { ${toPascalCase(tool)} } from "./specific/${toPascalCase(tool)}";`).join('\n');
const registryMap = tools.map(tool => `    "${tool}": <${toPascalCase(tool)} />,`).join('\n');

const registryCode = `import React from "react";
${registryImports}

export const ToolRegistry: Record<string, React.ReactNode> = {
${registryMap}
};
`;

fs.writeFileSync(path.join(__dirname, 'src/components/tools/ToolRegistry.tsx'), registryCode);
console.log("Generated 22 tool components and ToolRegistry.tsx");
