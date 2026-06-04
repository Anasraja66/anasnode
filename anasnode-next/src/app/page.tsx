import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { Industries } from "@/components/landing/Industries";
import { IndustrySection } from "@/components/landing/IndustrySection";
import { Testimonials } from "@/components/landing/Testimonials";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Industries />
      <IndustrySection />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
