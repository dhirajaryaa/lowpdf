import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import Logo from "@/components/logo";
import Container from "@/components/container";

export default function SiteHeader() {
  return (
    <header>
      <Container className="items-center justify-between px-6 py-8 sm:px-8 lg:px-10">
      <Link href="/" className="flex items-center gap-2.5" aria-label="LowPDF home">
        <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
          <Logo className="size-5" />
        </span>
        <span className="text-sm font-semibold tracking-tight">
          Low<span className="text-muted-foreground">PDF</span>
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground sm:flex">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          100% private · no uploads
        </span>
        <ThemeToggle />
      </div>
      </Container>
    </header>
  );
}