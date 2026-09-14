import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).href;

export interface PdfPreviewPage {
  pageNumber: number;
  canvas: HTMLCanvasElement;
}

export interface PdfPreviewResult {
  pages: PdfPreviewPage[];
  totalPages: number;
}

export interface RenderPreviewOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxPages?: number;
}

export async function renderPdfPreview(
  data: ArrayBuffer | Uint8Array | Blob,
  { maxWidth = 180, maxHeight = 260, maxPages = 24 }: RenderPreviewOptions = {},
): Promise<PdfPreviewResult> {
  const source = data instanceof Blob ? await data.arrayBuffer() : data;

  let task: pdfjsLib.PDFDocumentLoadingTask | null = null;
  try {
    task = pdfjsLib.getDocument({ data: source });
    const pdf = await task.promise;
    const totalPages = pdf.numPages;
    const renderCount = Math.min(totalPages, maxPages);

    const pages: PdfPreviewPage[] = [];
    for (let i = 1; i <= renderCount; i++) {
      const page = await pdf.getPage(i);
      const baseViewport = page.getViewport({ scale: 1 });

      const scale = Math.min(
        maxWidth / baseViewport.width,
        maxHeight / baseViewport.height,
      );
      const viewport = page.getViewport({ scale });

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
      await page.cleanup();

      pages.push({ pageNumber: i, canvas });

      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    return { pages, totalPages };
  } finally {
    await task?.destroy();
  }
}