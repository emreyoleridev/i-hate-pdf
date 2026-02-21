import {
    FilePlus2, FileMinus2, FileArchive, RotateCw, LayoutGrid, Hash,
    Crop, Droplet, Lock, Unlock, Wrench, GitCompare,
    FileText, Image as ImageIcon, Presentation, FileSpreadsheet,
    Globe, PenTool, Eraser, ScanSearch,
    LucideIcon
} from "lucide-react";

export interface ToolDefinition {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    actionLabel: string;
}

export interface ToolGroup {
    category: string;
    description: string;
    items: ToolDefinition[];
}

export const toolsData: ToolGroup[] = [
    {
        category: "Organize PDF",
        description: "Arrange, combine, and trim your documents exactly how you need them. Perfect for managing multi-page reports.",
        items: [
            { id: "merge-pdf", title: "Merge PDF", description: "Combine multiple PDFs into one unified document.", icon: FilePlus2, href: "/merge-pdf", actionLabel: "Select PDF files" },
            { id: "split-pdf", title: "Split PDF", description: "Extract pages or separate one PDF into many.", icon: FileMinus2, href: "/split-pdf", actionLabel: "Select PDF file" },
            { id: "organize-pdf", title: "Organize PDF", description: "Sort, add and delete PDF pages.", icon: LayoutGrid, href: "/organize-pdf", actionLabel: "Select PDF file" },
            { id: "page-numbers", title: "Page Numbers", description: "Add page numbers into PDFs with ease.", icon: Hash, href: "/page-numbers", actionLabel: "Select PDF file" },
            { id: "crop-pdf", title: "Crop PDF", description: "Trim PDF margins, change PDF page size.", icon: Crop, href: "/crop-pdf", actionLabel: "Select PDF file" },
        ]
    },
    {
        category: "Optimize PDF",
        description: "Reduce file sizes and fix corrupted documents without compromising quality. Fast and efficient optimization.",
        items: [
            { id: "compress-pdf", title: "Compress PDF", description: "Reduce file size while saving visual quality.", icon: FileArchive, href: "/compress-pdf", actionLabel: "Select PDF file" },
            { id: "repair-pdf", title: "Repair PDF", description: "Repair a damaged PDF and recover data from corrupt PDF.", icon: Wrench, href: "/repair-pdf", actionLabel: "Select PDF file" },
        ]
    },
    {
        category: "Convert to PDF",
        description: "Transform your documents and images into high-quality PDFs. Supports Word, Excel, PPT, and web pages.",
        items: [
            { id: "word-to-pdf", title: "Word to PDF", description: "Make DOC and DOCX files easy to read by converting them to PDF.", icon: FileText, href: "/word-to-pdf", actionLabel: "Select WORD files" },
            { id: "ppt-to-pdf", title: "PPT to PDF", description: "Make PPT and PPTX slideshows easy to view by converting them to PDF.", icon: Presentation, href: "/ppt-to-pdf", actionLabel: "Select POWERPOINT files" },
            { id: "excel-to-pdf", title: "Excel to PDF", description: "Make EXCEL spreadsheets easy to read by converting them to PDF.", icon: FileSpreadsheet, href: "/excel-to-pdf", actionLabel: "Select EXCEL files" },
            { id: "jpg-to-pdf", title: "JPG to PDF", description: "Convert JPG images to PDF in seconds.", icon: ImageIcon, href: "/jpg-to-pdf", actionLabel: "Select JPG images" },
            { id: "html-to-pdf", title: "HTML to PDF", description: "Convert webpages in HTML to PDF.", icon: Globe, href: "/html-to-pdf", actionLabel: "Add HTML files" },
            { id: "scan-to-pdf", title: "Scan to PDF", description: "Capture document scans and turn them into PDFs.", icon: ScanSearch, href: "/scan-to-pdf", actionLabel: "Upload Scans" },
        ]
    },
    {
        category: "Convert from PDF",
        description: "Extract content from your PDFs back into editable formats or high-resolution images.",
        items: [
            { id: "pdf-to-word", title: "PDF to Word", description: "Easily convert your PDF files into easy to edit DOC and DOCX documents.", icon: FileText, href: "/pdf-to-word", actionLabel: "Select PDF file" },
            { id: "pdf-to-jpg", title: "PDF to JPG", description: "Convert each PDF page into a JPG or extract all images contained in a PDF.", icon: ImageIcon, href: "/pdf-to-jpg", actionLabel: "Select PDF file" },
        ]
    },
    {
        category: "Edit & Security",
        description: "Protect sensitive data, sign documents, and remove information permanently with our secure editor.",
        items: [
            { id: "rotate-pdf", title: "Rotate PDF", description: "Rotate your PDFs the way you need them.", icon: RotateCw, href: "/rotate-pdf", actionLabel: "Select PDF file" },
            { id: "watermark", title: "Watermark", description: "Stamp an image or text over your PDF in seconds.", icon: Droplet, href: "/watermark", actionLabel: "Select PDF file" },
            { id: "protect-pdf", title: "Protect PDF", description: "Encrypt your PDF with a password.", icon: Lock, href: "/protect-pdf", actionLabel: "Select PDF file" },
            { id: "unlock-pdf", title: "Unlock PDF", description: "Remove PDF password security.", icon: Unlock, href: "/unlock-pdf", actionLabel: "Select target PDF" },
            { id: "sign-pdf", title: "Sign PDF", description: "Add a signature to your PDF document.", icon: PenTool, href: "/sign-pdf", actionLabel: "Select PDF file" },
            { id: "redact-pdf", title: "Redact PDF", description: "Permanently remove sensitive information from PDFs.", icon: Eraser, href: "/redact-pdf", actionLabel: "Select PDF file" },
            { id: "compare-pdf", title: "Compare PDF", description: "Compare two PDF documents to spot differences.", icon: GitCompare, href: "/compare-pdf", actionLabel: "Select PDF files" },
        ]
    },
];

export const getToolBySlug = (slug: string): ToolDefinition | undefined => {
    for (const group of toolsData) {
        const tool = group.items.find((item) => item.id === slug);
        if (tool) return tool;
    }
    return undefined;
};
