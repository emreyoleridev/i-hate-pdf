import React from "react";
import { MergePdf } from "./specific/MergePdf";
import { SplitPdf } from "./specific/SplitPdf";
import { OrganizePdf } from "./specific/OrganizePdf";
import { PageNumbers } from "./specific/PageNumbers";
import { CropPdf } from "./specific/CropPdf";
import { CompressPdf } from "./specific/CompressPdf";
import { RepairPdf } from "./specific/RepairPdf";
import { WordToPdf } from "./specific/WordToPdf";
import { PptToPdf } from "./specific/PptToPdf";
import { ExcelToPdf } from "./specific/ExcelToPdf";
import { JpgToPdf } from "./specific/JpgToPdf";
import { HtmlToPdf } from "./specific/HtmlToPdf";
import { ScanToPdf } from "./specific/ScanToPdf";
import { PdfToWord } from "./specific/PdfToWord";
import { PdfToJpg } from "./specific/PdfToJpg";
import { RotatePdf } from "./specific/RotatePdf";
import { Watermark } from "./specific/Watermark";
import { ProtectPdf } from "./specific/ProtectPdf";
import { UnlockPdf } from "./specific/UnlockPdf";
import { SignPdf } from "./specific/SignPdf";
import { RedactPdf } from "./specific/RedactPdf";
import { ComparePdf } from "./specific/ComparePdf";

export const ToolRegistry: Record<string, React.ReactNode> = {
    "merge-pdf": <MergePdf />,
    "split-pdf": <SplitPdf />,
    "organize-pdf": <OrganizePdf />,
    "page-numbers": <PageNumbers />,
    "crop-pdf": <CropPdf />,
    "compress-pdf": <CompressPdf />,
    "repair-pdf": <RepairPdf />,
    "word-to-pdf": <WordToPdf />,
    "ppt-to-pdf": <PptToPdf />,
    "excel-to-pdf": <ExcelToPdf />,
    "jpg-to-pdf": <JpgToPdf />,
    "html-to-pdf": <HtmlToPdf />,
    "scan-to-pdf": <ScanToPdf />,
    "pdf-to-word": <PdfToWord />,
    "pdf-to-jpg": <PdfToJpg />,
    "rotate-pdf": <RotatePdf />,
    "watermark": <Watermark />,
    "protect-pdf": <ProtectPdf />,
    "unlock-pdf": <UnlockPdf />,
    "sign-pdf": <SignPdf />,
    "redact-pdf": <RedactPdf />,
    "compare-pdf": <ComparePdf />,
};
