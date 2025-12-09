import AntigravityHero from "@/components/AntigravityHero";
import ParallaxShowcase from "@/components/ParallaxShowcase";
import GravityDock from "@/components/GravityDock";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30">
      <GravityDock />
      <AntigravityHero />
      <ParallaxShowcase />

      {/* Footer / Connect Section */}
      <section className="h-[50vh] flex flex-col items-center justify-center p-10 bg-neutral-900 border-t border-white/5 relative z-10">
        <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          Engineered for Impact.
        </h2>
        <p className="text-white/60 max-w-xl text-center mb-10">
          Let's build something that defies expectations. My approach combines rigorous engineering with fluid, organic design.
        </p>
        <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
          Initialize Contact_
        </button>
      </section>
    </main>
  );
}
