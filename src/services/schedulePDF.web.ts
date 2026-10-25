
import * as pdfjsLib from "pdfjs-dist";

export type PDFExtractionResult = {
    text: string;
    pageCount: number;
};

type PositionedText = {
    text: string;
    x: number;
    y: number;
    width: number;
};

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "/pdf.worker.min.mjs";

/**
 * Reconstruct readable text from PDF items.
 *
 * Groups words by their vertical position,
 * then sorts them from left to right.
 *
 * Uses each item's actual width to determine
 * spacing between words and columns.
 */
function reconstructPageText(
    items: PositionedText[]
): string {
    const ROW_TOLERANCE = 3;
    const COLUMN_GAP = 24;

    const rows: PositionedText[][] = [];

    const sorted = [...items].sort(
        (a, b) => b.y - a.y || a.x - b.x
    );

    for (const item of sorted) {
        const existingRow = rows.find(
            (row) =>
                Math.abs(row[0].y - item.y) <=
                ROW_TOLERANCE
        );

        if (existingRow) {
            existingRow.push(item);
        } else {
            rows.push([item]);
        }
    }

    return rows
        .map((row) => {
            const ordered = [...row].sort(
                (a, b) => a.x - b.x
            );

            let result = "";
            let previousEnd: number | null = null;

            for (const item of ordered) {
                if (previousEnd !== null) {
                    const gap = item.x - previousEnd;

                    if (gap >= COLUMN_GAP) {
                        result += "    ";
                    } else if (gap > 2) {
                        result += " ";
                    }
                }

                result += item.text;

                // Use the END of the previous text item,
                // not its starting position.
                previousEnd = item.x + item.width;
            }

            return result.trim();
        })
        .filter(Boolean)
        .join("\n");
}

/**
 * Extract selectable text from a PDF.
 *
 * Returns:
 * - text: reconstructed PDF text
 * - pageCount: number of pages
 */
export async function extractSchedulePDF(
    file: File
): Promise<PDFExtractionResult> {
    if (!file) {
        throw new Error(
            "No PDF schedule was provided."
        );
    }

    const buffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
    }).promise;

    const pages: string[] = [];

    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();

        const items: PositionedText[] = [];

        for (const item of content.items) {
            if (!("str" in item)) {
                continue;
            }

            const value = item.str.trim();

            if (!value) {
                continue;
            }

            items.push({
                text: value,
                x: item.transform[4],
                y: item.transform[5],
                width: item.width,
            });
        }

        pages.push(
            reconstructPageText(items)
        );
    }

    const text = pages.join("\n\n").trim();

    if (!text) {
        throw new Error(
            "This PDF contains no selectable text. Try uploading a screenshot instead."
        );
    }

    return {
        text,
        pageCount: pdf.numPages,
    };
}
