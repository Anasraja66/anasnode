"use client";

import { Building2, Utensils, Stethoscope } from "lucide-react";
import { Typewriter } from "./Typewriter";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-6 bg-white border-t border-[#E5E5E0] z-10 relative overflow-hidden">
      {/* Background Glow Blobs to match Hero */}
      <div className="absolute top-0 left-0 right-0 h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[50%] bg-[#0A6BFF] blur-[120px] rounded-full opacity-5 mix-blend-multiply animate-blob" />
        <div className="absolute top-[30%] right-[-10%] w-[45%] h-[60%] bg-[#38BDF8] blur-[130px] rounded-full opacity-5 mix-blend-multiply animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <h2 className="text-[24px] sm:text-[44px] font-semibold text-[#111827] tracking-[-0.03em] mb-12">
          <Typewriter text="Meet Anaos" />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Custom Video Browser Mockup (7 Columns) */}
          <div className="lg:col-span-7">
            <div className="rounded-[32px] bg-[#F3EFE9] border border-[#E5E2DB] p-5 sm:p-7 flex items-center justify-center shadow-[0_4px_30px_rgba(0,0,0,0.015)]">
              {/* High-Fidelity Browser Card */}
              <div className="w-full bg-white rounded-2xl border border-zinc-200/80 shadow-md overflow-hidden flex flex-col">
                
                {/* Browser top navigation controls */}
                <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 flex items-center gap-1.5 shrink-0 select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                  <div className="h-5 bg-white border border-zinc-200/80 rounded-md text-[10px] text-zinc-400 flex items-center px-4 w-48 mx-auto font-bold tracking-tight">
                    anaos.ai/sandbox-active
                  </div>
                </div>

                {/* Aspect-Ratio video container */}
                <div className="relative aspect-video bg-zinc-950 overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/hero-video-25.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Steps Narrative list (5 Columns) */}
          <div className="lg:col-span-5 space-y-10">
            {/* Step 1 */}
            <div className="space-y-2">
              <h3 className="text-[22px] font-semibold text-[#111827] tracking-tight">Start with an idea</h3>
              <p className="text-[14.5px] sm:text-[15px] text-[#4B5563] leading-relaxed font-semibold">
                Describe the WhatsApp operator or workflow you want to create or drop in templates and docs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <h3 className="text-[22px] font-semibold text-[#111827] tracking-tight">Watch it come to life</h3>
              <p className="text-[14.5px] sm:text-[15px] text-[#4B5563] leading-relaxed font-semibold">
                See your vision transform into active visual workspace nodes in real-time as AI builds it for you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <h3 className="text-[22px] font-semibold text-[#111827] tracking-tight">Refine and ship</h3>
              <p className="text-[14.5px] sm:text-[15px] text-[#4B5563] leading-relaxed font-semibold">
                Test your bot instantly inside the live WhatsApp sandbox, toggle connections, and deploy with one click.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
