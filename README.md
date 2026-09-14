# LowPDF

A privacy-first PDF compression tool. Drop a PDF, pick a compression strength, and download a smaller version — **100% client-side**. No uploads, no servers, no tracking. Your documents never leave your device.

Built with Next.js (App Router), Tailwind CSS, shadcn/ui, pdf.js, and pdf-lib.

## How compression works

Compression happens entirely in the browser (`src/lib/compress-pdf.ts`):

1. **pdf.js** parses the PDF and renders each page to a `<canvas>` at a scale derived from the chosen strength (lower strength = fewer pixels).
2. Each canvas is re-encoded as a **JPEG** image with a quality matching the strength.
3. **pdf-lib** embeds the JPEGs into a fresh PDF, preserving original page sizes.

Because there is no server side, there are no files to clean up and no per-use costs.

| Preset / slider value   | Pixel scale | JPEG quality |
| ----------------------- | ----------- | ------------ |
| Compact (20)            | 0.56×       | 0.43         |
| Balanced (55, default)  | 0.75×       | 0.66         |
| Best quality (85)       | 0.92×       | 0.85         |
| Custom slider (1–100)   | 0.45–1.0×   | 0.30–0.95    |

After uploading, the UI shows three quality presets — **Compact**, **Balanced**, and **Best quality** — so you get predictable quality without surprises. A **More options** toggle reveals the fine-grained slider (1–100) if you want manual control.

> **Tip for image-heavy PDFs (scans, screenshots, photos):** the results are dramatic.
> **Text-only PDFs** are usually already well-compressed; rasterizing them can occasionally produce a larger file — the UI shows the percentage saved so you can press **Re-compress** with max strength.

## Getting started

```bash
pnpm install
pnpm dev
# -> http://localhost:3000
```

## Scripts

| Command       | Description                  |
| ------------- | ---------------------------- |
| `pnpm dev`    | Start the dev server         |
| `pnpm build`  | Production build             |
| `pnpm start`  | Serve the production build   |
| `pnpm lint`   | Run ESLint                   |

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (metadata, header, footer)
│   └── page.tsx            # Landing page (hero, compressor, features)
├── components/
│   ├── pdf-compressor.tsx  # Client-side compressor UI (dropzone → result)
│   ├── site-header.tsx     # Minimal top bar
│   ├── site-footer.tsx     # Footer with creator links
│   └── ui/                 # shadcn/ui components
└── lib/
    └── compress-pdf.ts     # Compression engine (pdf.js + pdf-lib)
```

## Tech stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS 4** + **shadcn/ui**
- **pdf.js** — PDF parsing & page rasterization
- **pdf-lib** — new PDF assembly & JPEG embedding
- **lucide-react** — icons
- Package manager: **pnpm**

## Deployment

Fully static-friendly. Deploys to Vercel / Netlify / Cloudflare Pages as-is.

### Site URL (SEO / Open Graph)

One place controls the absolute base URL used for canonical, `og:url`, `og:image`,
and `twitter:image` tags: the `NEXT_PUBLIC_SITE_URL` env var (see `.env.example`).

- If set, it wins (don't include a trailing slash). Reads also fall back to `SITE_URL`.
- If unset, the Vercel production URL is used automatically on Vercel.
- Otherwise it falls back to `http://localhost:3000`.

Client-side consumers that need the URL should use `NEXT_PUBLIC_` — server-side
metadata resolves it through `src/lib/site.ts`.

## Author

Created by [Dhiraj Arya](https://dhirajarya.in) — self-taught full-stack developer.

- GitHub: [@dhirajaryaa](https://github.com/dhirajaryaa)
- X / Twitter: [@dhirajarya01](https://twitter.com/dhirajarya01)
- LinkedIn: [dhirajarya01](https://linkedin.com/in/dhirajarya01)
- YouTube: [@dhirajaryaa](https://youtube.com/@dhirajaryaa)
- Email: [dhirajarya.ptn@gmail.com](mailto:dhirajarya.ptn@gmail.com)