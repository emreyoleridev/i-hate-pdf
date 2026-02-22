import { HeroSection } from "@/components/landing/HeroSection";
import { ToolGrid } from "@/components/landing/ToolGrid";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FAQ } from "@/components/landing/FAQ";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Decorative divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

      <ToolGrid />

      {/* New Informational Sections */}
      <HowItWorks />

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <Features />

      <FAQ />

      {/* Trust section / Bottom CTA */}
      <section className="py-24 relative overflow-hidden bg-zinc-950 border-t border-zinc-900">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="w-full max-w-[1400px] mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">
            Stop struggling. Start working.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto text-lg">
            Join thousands of users who have already switched to a faster, cleaner, ad-free PDF experience. Fully client-side processing means we never see your files.
          </p>
        </div>
      </section>
    </div>
  );
}
