import type { ReactNode } from "react";
import { MonitorDown, FileCheck2, ShieldCheck } from "lucide-react";
import PdfCompressor from "@/components/pdf-compressor";
import MoreTools from "@/components/more-tools";
import Container from "@/components/container";
import { BlurIn, FadeIn } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Your files stay private",
    body: "Everything runs in your browser. Nothing is uploaded, stored, or tracked — so your documents never leave your device.",
  },
  {
    icon: MonitorDown,
    title: "No limits",
    body: "No file size caps, no sign-ups, no queues. Any PDF works, and the only limit is what your own device can handle.",
  },
  {
    icon: FileCheck2,
    title: "No server costs",
    body: "Compression is powered entirely by your CPU and pursuit of smaller files — we don't spend a cent on processing it.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Drop your PDF",
    body: "Drag and drop or browse for any PDF file. It stays on your device the entire time.",
  },
  {
    step: "02",
    title: "Pick a strength",
    body: "Slide toward smaller size or better quality — the page images are re-encoded to match.",
  },
  {
    step: "03",
    title: "Download",
    body: "Grab your compressed PDF instantly. Adjust the strength and re-compress whenever you like.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
<Section>
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <BlurIn>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Shrink your PDFs,{" "}
              <span className="text-muted-foreground">without sending them anywhere.</span>
            </h1>
          </BlurIn>
          <BlurIn delay={0.15}>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl">
              Compress PDF files instantly and privately. Processing happens 100% in
              your browser — your documents never leave your device.
            </p>
          </BlurIn>
        </div>
        <FadeIn delay={0.3} className="flex w-full justify-center">
          <PdfCompressor />
        </FadeIn>
      </Section>

      <Section className="bg-muted/40">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <FadeIn
              key={title}
              delay={i * 0.08}
              hover
              className="h-full transition-shadow duration-300 hover:shadow-md"
            >
              <Card className="h-full border-border/60 bg-background sm:rounded-3xl">
                <CardContent className="space-y-4 p-6 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h2 className="text-base font-semibold lg:text-lg">{title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">{body}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <FadeIn>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              How it works
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base text-muted-foreground lg:text-lg">
              Three steps, all on your device.
            </p>
          </FadeIn>
        </div>
        <div className="mx-auto grid max-w-5xl gap-12 sm:grid-cols-3 sm:gap-10">
          {STEPS.map(({ step, title, body }, i) => (
            <FadeIn
              key={step}
              delay={i * 0.08}
              hover
              className="space-y-4 text-center transition-shadow duration-300 hover:shadow-md sm:text-left"
            >
              <p className="text-sm font-mono text-muted-foreground">{step}</p>
              <h3 className="text-base font-medium lg:text-lg">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">{body}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      <MoreTools />
    </div>
  );
}

function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`space-y-12 px-6 py-16 sm:px-8 sm:space-y-16 sm:py-24 lg:px-10 ${className}`}
    >
      <Container className="flex-col items-center space-y-12 sm:space-y-16">
        {children}
      </Container>
    </section>
  );
}