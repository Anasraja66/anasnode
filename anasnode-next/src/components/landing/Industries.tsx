"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, Section, SectionLabel } from "./Section";
import Image from "next/image";
import realEstateImg from "@/assets/industry-realestate.jpg";
import restaurantImg from "@/assets/industry-restaurant.jpg";
import clinicImg from "@/assets/industry-clinic.jpg";
import ecommerceImg from "@/assets/industry-ecommerce.jpg";
import salonImg from "@/assets/industry-salon.jpg";
import gymImg from "@/assets/industry-gym.jpg";

type Industry = {
  name: string;
  tag: string;
  image: any;
  automations: string[];
  chat: { from: "bot" | "user"; text: string }[];
};

const industries: Industry[] = [
  {
    name: "Real Estate", tag: "Lead qualification, follow-ups, listing match", image: realEstateImg,
    automations: ["Qualify every inbound lead instantly", "Match active listings to buyer criteria", "Auto-schedule viewings around agent calendars", "Drip nurture sequences for cold leads", "Voice-note replies in Arabic and English"],
    chat: [
      { from: "user", text: "Hi, looking for a 3BR in Dubai Marina." },
      { from: "bot", text: "Welcome — could you share your budget?" },
      { from: "user", text: "Around AED 2.2M." },
      { from: "bot", text: "Four listings match. Want me to send them?" },
    ],
  },
  {
    name: "Restaurant", tag: "Orders, reservations, daily broadcasts", image: restaurantImg,
    automations: ["WhatsApp ordering with menu cards", "Table reservations with conflict checks", "Daily specials broadcast to regulars", "Post-visit review requests", "Loyalty offers tied to visit count"],
    chat: [
      { from: "user", text: "Table for four tonight at 8?" },
      { from: "bot", text: "Booked — table 12 at 8:00 PM." },
      { from: "user", text: "Can I pre-order drinks?" },
      { from: "bot", text: "Of course. Here's our menu." },
    ],
  },
  {
    name: "Clinic", tag: "Appointments, reminders, patient follow-ups", image: clinicImg,
    automations: ["Smart appointment booking by specialty", "Pre-visit reminders 24h and 1h before", "Prescription refill follow-ups", "Test result notifications", "Insurance verification at intake"],
    chat: [
      { from: "user", text: "I need to see Dr. Ahmed." },
      { from: "bot", text: "Next available is tomorrow, 11:00 AM. Book it?" },
      { from: "user", text: "Yes, please." },
      { from: "bot", text: "Confirmed. We'll send a reminder." },
    ],
  },
  {
    name: "E-commerce", tag: "Order tracking, cart recovery, reviews", image: ecommerceImg,
    automations: ["Real-time order status updates", "Abandoned cart recovery flows", "Post-delivery review requests", "Restock alerts for saved items", "Personalized upsell campaigns"],
    chat: [
      { from: "bot", text: "Your order #2241 is out for delivery." },
      { from: "user", text: "What's the ETA?" },
      { from: "bot", text: "Arriving in about 45 minutes." },
    ],
  },
  {
    name: "Salon & Beauty", tag: "Slot booking, reminders, review collection", image: salonImg,
    automations: ["Book by stylist and service type", "24-hour reminder with location", "Birthday and anniversary offers", "Automated review collection", "Rebooking prompts at the right cadence"],
    chat: [
      { from: "user", text: "Haircut Saturday at 4?" },
      { from: "bot", text: "Booked with Sara — see you then." },
    ],
  },
  {
    name: "Gym & Fitness", tag: "Memberships, class booking, renewals", image: gymImg,
    automations: ["Class bookings with waitlist", "Membership renewal reminders", "Trainer matching by goal", "Attendance and streak tracking", "Plan check-ins with nutrition notes"],
    chat: [
      { from: "user", text: "Yoga tomorrow at 7?" },
      { from: "bot", text: "Spot reserved. See you in the studio." },
    ],
  },
];

export function Industries() {
  const [selected, setSelected] = useState(0);
  const current = industries[selected];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Section id="industries" className="bg-muted/40">
      <FadeIn>
        <SectionLabel number="02">Industries</SectionLabel>
        <h2 className="mt-4 text-[28px] sm:text-[40px] font-semibold text-foreground tracking-tight leading-[1.1] max-w-2xl">
          Built for the work you already do.
        </h2>
        <p className="mt-3 text-[14px] text-muted-foreground max-w-md">
          Pick a sector to see the exact automations AnasNode ships on day one.
        </p>
      </FadeIn>

      {/* Tab pills */}
      <div className="mt-8 flex flex-wrap gap-1.5">
        {industries.map((ind, i) => {
          const active = selected === i;
          return (
            <button
              key={ind.name}
              onClick={() => setSelected(i)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground border border-border hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {ind.name}
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      {mounted && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-6 rounded-2xl border border-border bg-card grid md:grid-cols-[1.2fr_1fr] overflow-hidden"
          >
            {/* Left: automations list */}
            <div className="p-7 sm:p-9">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                What ships for {current.name}
              </span>
              <ul className="mt-5 divide-y divide-border">
                {current.automations.map((a, idx) => (
                  <motion.li
                    key={a}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.3 }}
                    className="py-3 flex items-baseline gap-4 text-[14px] text-foreground"
                  >
                    <span className="text-[11px] font-mono text-muted-foreground w-6">{String(idx + 1).padStart(2, "0")}</span>
                    <span>{a}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right: WhatsApp mockup */}
            <div className="bg-muted/60 p-7 sm:p-9 flex items-center justify-center border-t md:border-t-0 md:border-l border-border">
              <div className="w-full max-w-[280px] rounded-[28px] border border-border bg-card p-2.5 shadow-sm">
                {/* Phone screen */}
                <div className="rounded-[22px] bg-muted/60 p-3 min-h-[300px] flex flex-col gap-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground text-center pb-2 border-b border-border/80">
                    WhatsApp · AnasNode
                  </div>
                  {current.chat.map((m, idx) => (
                    <motion.div
                      key={`${selected}-${idx}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.12 }}
                      className={`max-w-[82%] text-[12.5px] leading-snug px-3 py-2 rounded-2xl ${
                        m.from === "bot"
                          ? "bg-card text-foreground self-start rounded-bl-sm border border-border"
                          : "bg-foreground text-background self-end rounded-br-sm"
                      }`}
                    >
                      {m.text}
                    </motion.div>
                  ))}
                </div>

                {/* Industry image thumbnail */}
                <div className="mt-2 rounded-[18px] overflow-hidden aspect-[16/10]">
                  <Image
                    src={current.image}
                    alt={current.name}
                    className="w-full h-full object-cover"
                    priority={selected < 2}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </Section>
  );
}
