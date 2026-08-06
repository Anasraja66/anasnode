import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { AppScroll } from "@/components/landing/AppScroll";
import { HowItWorks } from "@/components/landing/HowItWorks";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { Industries } from "@/components/landing/Industries";
import { IndustrySection } from "@/components/landing/IndustrySection";
import { Testimonials } from "@/components/landing/Testimonials";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen gemini-bg text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <AppScroll />
      <HowItWorks />
      <Industries />
      <IndustrySection />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
