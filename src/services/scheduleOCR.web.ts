
import { createWorker } from "tesseract.js";

// The information returned after reading an image.
export type OCRResult = {
    text: string;
    confidence: number;
    lines: string[];
};

/**
 * Reads text from a school schedule image.
 *
 * Supported:
 * - PNG
 * - JPG / JPEG
 * - WEBP
 *
 * PDF support will be added separately.
 *
 * OCR happens locally in the browser.
 */
export async function extractScheduleText(
    file: File
): Promise<OCRResult> {
    if (!file) {
        throw new Error("No schedule image was provided.");
    }

    const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
        throw new Error(
            "Please upload a PNG, JPG, or WEBP image. PDF support is coming next."
        );
    }

    // Start the OCR engine using English.
    const worker = await createWorker("eng");

    try {
        // Read the actual text from the uploaded image.
        const result = await worker.recognize(file);

        const text = result.data.text.trim();

        if (!text) {
            throw new Error(
                "We couldn't detect any text. Try a clearer screenshot."
            );
        }

        // Split the recognized text into individual lines.
        const lines = text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        return {
            text,
            confidence: result.data.confidence,
            lines,
        };
    } finally {
        // Always release OCR resources.
        await worker.terminate();
    }
}
