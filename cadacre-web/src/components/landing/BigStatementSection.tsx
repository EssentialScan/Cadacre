import { SlideIn } from "@/components/motion/ScrollAnimations";
import { AmbientSection } from "@/components/ambient/AmbientSection";

export function BigStatementSection() {
  return (
    <section className="py-20 md:py-48 bg-transparent relative overflow-hidden text-center">
      <AmbientSection theme="statement" />
      
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 relative z-10 text-center">
        <SlideIn direction="up">
          <h2 
            className="font-display font-bold tracking-tight text-foreground leading-[1.05]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
          >
            65+ REITs.<br />
            Thousands of properties.<br />
            <span className="text-muted-foreground">One place to understand them.</span>
          </h2>
        </SlideIn>
      </div>
    </section>
  );
}
