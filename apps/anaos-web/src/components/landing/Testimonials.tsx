"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FadeIn, Section, SectionLabel } from "./Section";
import { Typewriter } from "./Typewriter";

const items = [
  {
    quote: "This is a very good startup, it can automate my sales process with a WhatsApp cold calling agent. It was easy for a business owner.",
    name: "Asif Shoaib Raja", 
    role: "CEO", 
    company: "Reliable Home Properties",
    avatar: "AS"
  },
  {
    quote: "It's very easy to automate WhatsApp for my perfume brand. Anaos made our customer communication seamless.",
    name: "Abdul Rafay", 
    role: "Owner", 
    company: "Eluix Lumi",
    avatar: "AR"
  },
  {
    quote: "My factory automated the sales process for Facebook lead and Google Form lead through AI agents. Truly enterprise grade.",
    name: "Raja Qasim", 
    role: "Owner", 
    company: "Al Ameen Fence",
    avatar: "RQ"
  },
];

export function Testimonials() {
  return (
    <Section id="customers" className="relative bg-white overflow-hidden border-t border-zinc-100">
      {/* Background Glow Blobs to match Hero theme */}
      <div className="absolute top-0 left-0 right-0 h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[60%] bg-[#0A6BFF] blur-[120px] rounded-full opacity-[0.02] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[45%] h-[60%] bg-[#38BDF8] blur-[120px] rounded-full opacity-[0.02] mix-blend-multiply" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn>
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-[24px] sm:text-[48px] font-bold text-zinc-900 tracking-tight leading-[1.1] max-w-2xl">
              <Typewriter text="Trusted by business owners." />
              <span className="block text-zinc-400">
                <Typewriter text="Scaling operations with AI." delay={2} />
              </span>
            </h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((t, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="group relative flex flex-col h-full bg-white rounded-[32px] p-8 border border-zinc-100 hover:border-blue-100 transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,176,255,0.08)]">
                {/* Quote Icon */}
                <div className="mb-6">
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-100 group-hover:text-blue-200 transition-colors duration-500">
                    <path d="M0 24V11.134C0 7.42268 0.927835 4.50172 2.78351 2.37113C4.67354 0.206186 7.49141 -0.515464 11.2371 0.206186V5.4433C9.07216 5.06529 7.49141 5.47766 6.49485 6.68041C5.53265 7.84879 5.05155 9.34708 5.05155 11.1753H11.2371V24H0ZM20.7629 24V11.134C20.7629 7.42268 21.6907 4.50172 23.5464 2.37113C25.4364 0.206186 28.2543 -0.515464 32 0.206186V5.4433C29.8351 5.06529 28.2543 5.47766 27.2577 6.68041C26.2955 7.84879 25.8144 9.34708 25.8144 11.1753H32V24H20.7629Z" fill="currentColor"/>
                  </svg>
                </div>

                <blockquote className="text-[17px] font-medium text-zinc-700 leading-relaxed flex-1">
                  "{t.quote}"
                </blockquote>

                <div className="mt-8 pt-8 border-t border-zinc-50 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#00B0FF] font-bold text-sm tracking-tight">
                    {t.avatar}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[15px] font-bold text-zinc-900 leading-none mb-1.5">{t.name}</p>
                    <p className="text-[12.5px] text-zinc-400 font-medium leading-none">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}
