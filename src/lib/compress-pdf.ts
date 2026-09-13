import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).href;

export interface CompressResult {
  data: Uint8Array;
  pages: number;
}

export interface CompressOptions {
  /** 0 = maximum compression, 100 = best visual quality */
  level: number;
}

const MAX_DIMENSION = 2200;
const MIN_SCALE = 0.45;
const MIN_JPEG_QUALITY = 0.3;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export async function compressPdf(
  input: ArrayBuffer,
  level: number,
  onProgress: (fraction: number, label: string) => void,
): Promise<CompressResult> {
  const strength = clamp(level, 0, 100) / 100;

  // A higher strength level keeps more pixels (scale) and less JPEG loss.
  const scale = MIN_SCALE + strength * (1 - MIN_SCALE);
  const jpegQuality = MIN_JPEG_QUALITY + strength * (0.95 - MIN_JPEG_QUALITY);

  const getDocumentTask = pdfjsLib.getDocument({
    data: input,
    useSystemFonts: true,
  });
  const pdf = await getDocumentTask.promise;

  const pageCount = pdf.numPages;
  const outPdf = await PDFDocument.create();
  outPdf.setProducer("LowPDF");
  outPdf.setCreator("LowPDF");
  outPdf.setCreationDate(new Date());

  try {
    for (let i = 1; i <= pageCount; i++) {
      onProgress((i - 1) / pageCount, `Page ${i - 1} of ${pageCount}`);

      const page = await pdf.getPage(i);
      const baseViewport = page.getViewport({ scale: 1 });

      const largestSide = Math.max(baseViewport.width, baseViewport.height);
      const pageScale =
        largestSide * scale > MAX_DIMENSION
          ? MAX_DIMENSION / largestSide
          : scale;

      const viewport = page.getViewport({ scale: pageScale });

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) {
        throw new Error("Canvas 2D context is unavailable in this browser.");
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvas, canvasContext: ctx, viewport }).promise;

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) =>
            b
              ? resolve(b)
              : reject(new Error("Failed to encode this page as an image.")),
          "image/jpeg",
          jpegQuality,
        );
      });

      const imageBytes = new Uint8Array(await blob.arrayBuffer());
      const image = await outPdf.embedJpg(imageBytes);

      const [width, height] = [baseViewport.width, baseViewport.height];
      const outPage = outPdf.addPage([width, height]);
      outPage.drawImage(image, { x: 0, y: 0, width, height });

      page.cleanup();
    }
  } finally {
    await getDocumentTask.destroy();
  }

  const data = await outPdf.save();
  return { data, pages: pageCount };
}