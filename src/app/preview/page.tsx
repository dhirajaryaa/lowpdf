"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileQuestion, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearPreview, loadPreview } from "@/lib/preview-store";
import type { PreviewData } from "@/lib/preview-store";

export default function PreviewPage() {
  const urlRef = useRef<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [data, setData] = useState<PreviewData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const preview = await loadPreview();
        if (cancelled) return;
        if (!preview) {
          setError(true);
          return;
        }
        const objectUrl = URL.createObjectURL(preview.blob);
        urlRef.current = objectUrl;
        setUrl(objectUrl);
        setData(preview);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const handleDownload = () => {
    if (!urlRef.current || !data) return;
    const anchor = document.createElement("a");
    anchor.href = urlRef.current;
    anchor.download = data.name;
    anchor.click();
  };

  const handleBack = () => {
    clearPreview();
  };

  return (
    <div className="flex min-h-[85svh] flex-1 flex-col sm:min-h-0">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-4 sm:px-8">
        <Link
          href="/"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="min-w-0 flex-1 truncate text-center text-sm font-medium">
          {data ? `Preview · ${data.name}` : "Preview"}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={!data}
          className="shrink-0"
        >
          <Download />
          Download
        </Button>
      </div>

      <main className="min-h-0 flex-1 overflow-hidden bg-muted/30">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading preview…
            </span>
          </div>
        ) : error || !data || !url ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <FileQuestion className="size-10 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-base font-medium">No PDF to preview</p>
              <p className="text-sm text-muted-foreground">
                Compress a PDF first, then open the preview from there.
              </p>
            </div>
            <Link
              href="/"
              className="text-sm font-medium underline underline-offset-4"
            >
              Go to LowPDF
            </Link>
          </div>
        ) : (
          <iframe
            src={url}
            title="Compressed PDF preview"
            className="min-h-svh w-full border-0"
          />
        )}
      </main>
    </div>
  );
}