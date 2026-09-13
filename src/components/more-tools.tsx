import Link from "next/link";
import { ArrowUpRight, Clock, FileCheck2, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    icon: Layers,
    title: "Compressly",
    body: "Compress images and files in bulk — PNG, JPG, WebP and PDF. Batch mode with a simple drag-and-drop interface.",
    href: "https://compressly.dhirajarya.in",
    cta: "Compress images",
    badge: "Batch support",
    featured: true,
  },
  {
    icon: Clock,
    title: "Snapshot",
    body: "Turn screenshots into beautiful, share-ready visuals — backgrounds, frames and shadows, all in your browser.",
    href: "https://snapshot.dhirajarya.in",
    cta: "Style a screenshot",
    badge: "Live",
    featured: false,
  },
  {
    icon: FileCheck2,
    title: "Temp Mail",
    body: "Disposable email addresses with a real-time inbox for quick, hassle-free sign-ups.",
    href: "https://tempmail.dhirajarya.in",
    cta: "Get a temp email",
    badge: "Live",
    featured: false,
  },
];

export default function MoreTools() {
  return (
    <section className="px-6 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center space-y-12 sm:space-y-16">
        <div className="mx-auto max-w-3xl space-y-3 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            More free tools you&apos;ll like
          </h2>
          <p className="text-base text-muted-foreground lg:text-lg">
            Privacy-first utilities by Dhiraj Arya — none of them ever upload your
            files.
          </p>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-3">
          {TOOLS.map(({ icon: Icon, title, body, href, cta, badge, featured }) => (
            <Card
              key={title}
              className={cn(
                "flex border-border/60 bg-background transition-shadow sm:rounded-3xl",
                featured && "sm:-translate-y-2 sm:shadow-md",
              )}
            >
              <CardContent className="flex w-full flex-col gap-4 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-xl",
                      featured
                        ? "bg-foreground text-background"
                        : "bg-muted text-foreground",
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  {badge ? (
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        featured
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {badge}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold lg:text-lg">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground lg:text-base">
                    {body}
                  </p>
                </div>
                <div className="mt-auto pt-2">
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      featured
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "border border-border hover:border-foreground/40",
                    )}
                  >
                    {cta}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}