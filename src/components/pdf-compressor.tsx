"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  Loader2,
  Lock,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type Status = "idle" | "ready" | "compressing" | "done" | "error";

interface Result {
  blob: Blob;
  size: number;
  pages: number;
}

const PRESETS = [
  { id: "compact", label: "Compact", hint: "Smallest file", level: 20 },
  { id: "balanced", label: "Balanced", hint: "Size + quality", level: 55 },
  { id: "quality", label: "Best quality", hint: "Minimal loss", level: 85 },
] as const;

type PresetId = (typeof PRESETS)[number]["id"];

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024)),
  );
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function PdfCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState(55);
  const [presetId, setPresetId] = useState<PresetId | null>("balanced");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const compression = useMemo(() => {
    if (!file || !result) return null;
    const saved = Math.max(0, Math.round((1 - result.size / file.size) * 100));
    return { saved, newSize: formatBytes(result.size), oldSize: formatBytes(file.size) };
  }, [file, result]);

  const acceptFile = useCallback((selected: File | null) => {
    if (!selected) return;
    if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
      setStatus("error");
      setError("That doesn't look like a PDF. Please drop a .pdf file.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setStatus("error");
      setError(
        `This PDF is ${formatBytes(selected.size)}. Files larger than ${formatBytes(MAX_FILE_SIZE)} aren't supported — processing happens in your browser, so the limit depends on your device's memory.`,
      );
      return;
    }
    setFile(selected);
    setResult(null);
    setError(null);
    setStatus("ready");
    setProgress(0);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      acceptFile(e.dataTransfer.files?.[0] ?? null);
    },
    [acceptFile],
  );

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current += 1;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) dragDepth.current = 0;
  };

  const handleCompress = useCallback(async () => {
    if (!file || status === "compressing") return;
    setStatus("compressing");
    setProgress(0);
    setProgressLabel("Preparing…");
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const { compressPdf } = await import("@/lib/compress-pdf");
      const { data, pages } = await compressPdf(buffer, level, (fraction, label) => {
        setProgress(Math.round(fraction * 100));
        setProgressLabel(label);
      });
      const copy = new Uint8Array(data.byteLength);
      copy.set(data);
      const blob = new Blob([copy], { type: "application/pdf" });
      setResult({ blob, size: blob.size, pages });
      setStatus("done");
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong while compressing. Try again.",
      );
      setStatus("error");
    }
  }, [file, level, status]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const baseName = (file?.name ?? "document.pdf").replace(/\.pdf$/i, "");
    const url = URL.createObjectURL(result.blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${baseName}-compressed.pdf`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [result, file]);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setStatus("idle");
    setProgress(0);
    setPresetId("balanced");
    setLevel(55);
    setShowAdvanced(false);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <Card className="w-full max-w-2xl border-border/60 bg-card shadow-sm sm:rounded-3xl">
      <CardContent className="p-6 sm:p-12">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => acceptFile(e.target.files?.[0] ?? null)}
        />

        {status === "idle" || status === "error" ? (
          <Dropzone
            error={status === "error" ? error : null}
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onBrowse={() => inputRef.current?.click()}
          />
        ) : null}

        {status === "ready" || status === "compressing" || status === "done" ? (
          <div className="space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
                  <FileText className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-medium">{file?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {file ? formatBytes(file.size) : ""}
                    {result ? ` · ${result.pages} pages` : ""}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={reset}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Remove file"
              >
                <X className="size-4" />
              </button>
            </div>

            {status === "ready" ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Compression</Label>
                  <div
                    role="radiogroup"
                    aria-label="Compression level"
                    className="grid grid-cols-3 gap-2"
                  >
                    {PRESETS.map((preset) => {
                      const active = presetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => {
                            setPresetId(preset.id);
                            setLevel(preset.level);
                          }}
                          className={`flex flex-col items-center gap-0.5 rounded-xl border px-3 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            active
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-background hover:border-foreground/40"
                          }`}
                        >
                          <span className="text-sm font-medium">{preset.label}</span>
                          <span
                            className={`text-xs ${
                              active ? "text-background/70" : "text-muted-foreground"
                            }`}
                          >
                            {preset.hint}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAdvanced((v) => !v)}
                    aria-expanded={showAdvanced}
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ChevronDown
                      className={`size-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                    />
                    More options
                  </button>

                  {showAdvanced ? (
                    <div className="space-y-3 pt-2">
                      <Slider
                        id="strength"
                        min={1}
                        max={100}
                        step={1}
                        value={[level]}
                        onValueChange={(value) => {
                          const next = Array.isArray(value) ? value[0] : value;
                          setLevel(next);
                          setPresetId(null);
                        }}
                        aria-label="Compression strength"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Smaller file</span>
                        <span>Better quality</span>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
                  <Lock className="size-4 shrink-0" />
                  Offline processing only — this PDF never leaves your device.
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleCompress}
                >
                  Compress PDF
                </Button>
              </div>
            ) : null}

            {status === "compressing" ? (
              <div className="space-y-3">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-foreground transition-[width] duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    {progressLabel}
                  </span>
                  <span className="font-mono tabular-nums">{progress}%</span>
                </div>
              </div>
            ) : null}

            {status === "done" && result && compression ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-2 py-2 text-center">
                  <CheckCircle2 className="size-8 text-emerald-500" />
                  <p className="text-lg font-semibold">
                    Reduced by {compression.saved}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {compression.oldSize} → <span className="font-medium text-foreground">{compression.newSize}</span>
                    {compression.saved === 0
                      ? " (already optimized — try maximum compression)"
                      : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button size="lg" className="w-full sm:flex-1" onClick={handleDownload}>
                    <Download className="size-4" />
                    Download compressed PDF
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={handleCompress}>
                    <ArrowLeft className="size-4" />
                    Re-compress
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function Dropzone({
  error,
  onDrop,
  onDragEnter,
  onDragLeave,
  onBrowse,
}: {
  error: string | null;
  onDrop: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onBrowse: () => void;
}) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onClick={onBrowse}
        className="group flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-16 text-center transition-colors hover:border-foreground/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-background">
          <UploadCloud className="size-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <p className="text-base font-medium lg:text-lg">
            Drop your PDF here, or <span className="underline underline-offset-4">browse</span>
          </p>
          <p className="text-sm text-muted-foreground lg:text-base">
            No sign-up · up to 100 MB · never uploaded, never leaves your device.
          </p>
        </div>
      </button>
      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}