import Navbar from "@/components/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Tokenomics } from "@/components/landing/Tokenomics";
import { Roadmap } from "@/components/landing/Roadmap";
import { Partners } from "@/components/landing/Partners";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <section id="features">
          <Features />
        </section>
        <HowItWorks />
        <Tokenomics />
        <section id="roadmap">
          <Roadmap />
        </section>
        <Partners />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
