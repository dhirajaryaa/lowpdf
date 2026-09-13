import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LowPDF — Compress PDF files in your browser",
    template: "%s · LowPDF",
  },
  description:
    "Reduce PDF file size instantly, right in your browser. 100% client-side processing — your files never leave your device.",
  keywords: [
    "pdf compressor",
    "compress pdf",
    "reduce pdf size",
    "free pdf compression",
    "client-side pdf",
  ],
  openGraph: {
    title: "LowPDF — Compress PDF files in your browser",
    description:
      "Reduce PDF file size instantly, right in your browser. 100% client-side processing — your files never leave your device.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <SiteHeader />
          <main className="flex flex-1 flex-col">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}