import React from "react";
import { render, screen } from "@testing-library/react";
import ToolPage from "./page";
import { toolsData } from "@/config/tools";

// Mock next/navigation
jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

// We only need a flat array of all tools to test them sequentially
const allTools = toolsData.flatMap(group => group.items);

describe("Individual PDF Tool Pages", () => {
    allTools.forEach((tool) => {
        describe(`Tool: ${tool.title}`, () => {
            it(`renders the correct title, description, and action label for ${tool.id}`, async () => {
                // Render the dynamic page as if navigating to / [tool.id]
                const PageComponent = await ToolPage({ params: Promise.resolve({ tool: tool.id }) });
                render(PageComponent);

                // Check if the title is rendered
                expect(screen.getByRole("heading", { name: tool.title })).toBeInTheDocument();

                // Check if the description is rendered
                expect(screen.getByText(tool.description)).toBeInTheDocument();

                // Check if the FileUpload action label is rendered (only for mock tools)
                const implementedTools = [
                    "merge-pdf", "split-pdf", "rotate-pdf",
                    "organize-pdf", "page-numbers", "watermark",
                    "protect-pdf", "unlock-pdf", "redact-pdf",
                    "compress-pdf", "repair-pdf", "crop-pdf",
                    "pdf-to-word", "pdf-to-jpg", "scan-to-pdf",
                    "compare-pdf", "excel-to-pdf", "html-to-pdf",
                    "ppt-to-pdf", "word-to-pdf"
                ];
                if (!implementedTools.includes(tool.id)) {
                    expect(screen.getByRole("button", { name: tool.actionLabel })).toBeInTheDocument();
                }
            });
        });
    });
});
