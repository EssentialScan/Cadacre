import { FadeUp, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { RevealImage } from "@/components/motion/RevealImage";

const points = [
  {
    title: "Sydney priced you out, quietly",
    body: "Median house prices climbed faster than most first-home savings ever could. By the time the gap looks closeable, it's moved again. Waiting isn't a strategy — it's a loss taken in slow motion.",
  },
  {
    title: "‘Somewhere regional’ isn’t a plan",
    body: "Everyone says rentvest somewhere regional. Almost nobody says where, or why. A spreadsheet from a friend, a three-year-old blog post, a buyer's agent paid to push their own listing — none of that is research.",
  },
  {
    title: "The numbers were never hidden",
    body: "Median price, gross rental yield, vacancy rate — every figure Cadacre ranks on is public record, sourced and dated. We didn't discover anything. We just stopped letting it sit in twenty different PDFs.",
  },
];

export function ProblemSection() {
  return (
    <section className="border-b border-faded-rule bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <FadeUp>
              <p className="font-mono-figure text-xs uppercase tracking-[0.25em] text-survey-brass">
                01 — Why the old plan stopped working
              </p>
              <h2 className="mt-4 max-w-md font-display text-3xl font-semibold leading-tight text-ink-navy sm:text-4xl">
                The gap isn&apos;t closing. It&apos;s the plan that has to
                change.
              </h2>
            </FadeUp>

            <Stagger className="mt-12 divide-y divide-faded-rule border-t border-faded-rule">
              {points.map((point, i) => (
                <StaggerItem
                  key={point.title}
                  className="grid grid-cols-[auto_1fr] gap-6 py-8"
                >
                  <span className="font-display text-2xl italic text-charcoal/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink-navy">
                      {point.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-charcoal/75">
                      {point.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="md:col-span-5">
            <RevealImage
              src="/pexels-volkerthimm-27307400.jpg"
              alt="A quiet residential courtyard in a regional Australian town"
              className="sticky top-24 aspect-3/4 rounded-sm border border-faded-rule"
              sizes="(min-width: 768px) 33vw, 90vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
