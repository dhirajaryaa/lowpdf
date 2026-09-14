import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "@/components/container";
import { cn } from "@/lib/utils";

export default function MoreTools() {
  return (
    <section className="px-6 py-16 sm:px-8 sm:py-24 lg:px-10">
      <Container className="flex-col items-center space-y-12 sm:space-y-16">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            More free tools you&apos;ll like
          </h2>
          <p className="text-base text-muted-foreground lg:text-lg">
            Privacy-first utilities by Dhiraj Arya — none of them ever upload your
            files.
          </p>
        </div>

        <Card className="w-full max-w-md border-border/60 bg-background sm:rounded-3xl sm:shadow-md">
          <CardContent className="flex flex-col gap-4 p-6 sm:p-8">
            <div className="flex size-12 items-center justify-center overflow-hidden rounded-xl bg-muted">
              <Image
                src="/compressly.webp"
                alt="Compressly logo"
                width={32}
                height={32}
                className="size-8"
              />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold">Compressly</h3>
              <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                Compress images and files in bulk — PNG, JPG, WebP and PDF. Batch
                mode with a simple drag-and-drop interface.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="https://compressly.dhirajarya.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Compress images
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="w-full py-2 flex items-center justify-center">
          <Link
            href="https://tools.dhirajarya.in"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "rounded-full px-8",
            )}
          >
            Explore more tools
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}