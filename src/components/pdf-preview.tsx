"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Loader2 } from "lucide-react";
import type { PdfPreviewPage, PdfPreviewResult } from "@/lib/pdf-preview";

interface PdfPreviewProps {
  data: ArrayBuffer | Uint8Array | Blob;
}

export default function PdfPreview({ data }: PdfPreviewProps) {
  const canvasListRef = useRef<HTMLCanvasElement[]>([]);
  const [pages, setPages] = useState<PdfPreviewPage[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { renderPdfPreview } = await import("@/lib/pdf-preview");
        const result: PdfPreviewResult = await renderPdfPreview(data);
        if (cancelled) return;
        canvasListRef.current = result.pages.map((p) => p.canvas);
        setPages(result.pages);
        setTotalPages(result.totalPages);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("Couldn't render the preview.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      canvasListRef.current.forEach((canvas) => {
        canvas.width = 0;
        canvas.height = 0;
      });
      canvasListRef.current = [];
    };
  }, [data]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Eye className="size-4" />
          Preview
        </div>
        {!loading && !error && totalPages > 0 ? (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            {pages.length}/{totalPages} page{pages.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center rounded-xl border border-border/60 bg-muted/40">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Rendering preview…
          </span>
        </div>
      ) : error ? (
        <div className="flex h-32 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-center">
          <span className="max-w-sm text-sm text-muted-foreground">{error}</span>
        </div>
      ) : (
        <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {pages.map((page) => (
            <PreviewPage key={page.pageNumber} page={page} />
          ))}
        </div>
      )}
    </div>
  );
}

function PreviewPage({ page }: { page: PdfPreviewPage }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.append(page.canvas);
    return () => {
      page.canvas.remove();
    };
  }, [page]);

  return (
    <figure className="shrink-0 space-y-1.5">
      <div className="overflow-hidden rounded-lg border border-border/60 shadow-sm">
        <div ref={ref} className="m-1.5 overflow-hidden rounded-sm bg-white" />
      </div>
      <figcaption className="text-center text-xs text-muted-foreground">
        {page.pageNumber}
      </figcaption>
    </figure>
  );
}