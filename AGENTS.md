<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# LowPDF project notes

Privacy-first client-side PDF compression tool. All processing happens in the browser — never introduce any server-side file handling, persistence, or analytics that would touch user files.

## Conventions

- **Package manager:** pnpm. Never use npm/yarn. Install with `pnpm add`.
- **Scripts:** `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`.
- **Directory layout:** App Router under `src/app`, shared components in `src/components`, engine code in `src/lib`, shadcn/ui components in `src/components/ui`.
- **Server/client boundary:** The compression engine (`src/lib/compress-pdf.ts`) uses browser APIs (canvas, `?url` worker import) and is only imported by `"use client"` components. Keep server components free of browser-only imports.
- **UI:** Tailwind CSS 4 + shadcn/ui (neutral palette). Keep the design minimal with generous whitespace. Prefer existing shadcn components over hand-rolled ones; add new ones via `pnpm dlx shadcn@latest add <name>`.
- **Compression engine** (`src/lib/compress-pdf.ts`): pdf.js renders pages to canvas → re-encoded as JPEG → pdf-lib reassembles. `GlobalWorkerOptions.workerSrc` is set via `new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).href`. The `?url` suffix does not work for `.mjs` in this Next.js/Turbopack version. The engine is imported dynamically (`await import("@/lib/compress-pdf")`) so pdf.js never evaluates on the server. If you change the pipeline, preserve: no uploads, progress callbacks, per-page `cleanup()`, canvas dimension cap, original page size preservation.

## Verification

Always run `pnpm lint` and `pnpm build` after changes. The build must stay static-friendly (deployable with zero env vars).
