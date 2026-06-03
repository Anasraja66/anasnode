"use client";

import React from "react";
import { motion } from "framer-motion";

const innerOrbit = [
  { 
    name: "WhatsApp", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#25D366"/>
      </svg>
    ) 
  },
  { 
    name: "Gmail", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M1.5 3.5h3.3v13.5h-3.3z" fill="#4285f4"/>
        <path d="M19.2 3.5h3.3v13.5h-3.3z" fill="#34a853"/>
        <path d="M1.5 3.5l10.5 8 10.5-8v3.3l-10.5 8-10.5-8z" fill="#ea4335"/>
        <path d="M1.5 17h21v3.5h-21z" fill="#fbbc04"/>
      </svg>
    )
  },
  { 
    name: "Google Drive", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M7.714 3.34L10.93 8.9H2.66l3.216-5.56zm4.57 5.56l3.217 5.56-8.273.01L12.284 8.9zm.644-5.56l8.273.01-4.136 7.15-4.137-7.16z" fill="#4285F4"/>
        <path d="M12.284 8.9l4.137 7.16-4.137 7.16-4.137-7.16 4.137-7.16z" fill="#34A853"/>
        <path d="M20.928 8.9l3.216 5.56-8.272.01 5.056-5.57z" fill="#FBBC05"/>
      </svg>
    )
  },
  { 
    name: "TikTok", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8 bg-black">
        <g>
          <path d="M12.525.02c1.31 0 2.591.26 3.811.73v4.257c-.711-.31-1.481-.47-2.281-.47-2.92 0-5.29 2.37-5.29 5.29 0 .09.01.18.02.27v4.25c-.01-.09-.02-.18-.02-.27 0-5.28 4.29-9.57 9.57-9.57.81 0 1.58.1 2.31.29V.75C19.385.25 18.104 0 16.794 0h-4.269v16.706c0 2.214-1.801 4.015-4.015 4.015s-4.015-1.801-4.015-4.015 1.801-4.015 4.015-4.015c.253 0 .495.029.731.083v-4.172c-.24-.022-.482-.036-.731-.036-4.51 0-8.17 3.66-8.17 8.17 0 4.51 3.66 8.17 8.17 8.17s8.17-3.66 8.17-8.17v-10.08c1.505 1.225 3.411 1.956 5.49 1.956v-4.17c-3.13 0-5.67-2.54-5.67-5.67V.02h-4.25z" fill="#25F4EE" transform="translate(-0.4, -0.4)"/>
          <path d="M12.525.02c1.31 0 2.591.26 3.811.73v4.257c-.711-.31-1.481-.47-2.281-.47-2.92 0-5.29 2.37-5.29 5.29 0 .09.01.18.02.27v4.25c-.01-.09-.02-.18-.02-.27 0-5.28 4.29-9.57 9.57-9.57.81 0 1.58.1 2.31.29V.75C19.385.25 18.104 0 16.794 0h-4.269v16.706c0 2.214-1.801 4.015-4.015 4.015s-4.015-1.801-4.015-4.015 1.801-4.015 4.015-4.015c.253 0 .495.029.731.083v-4.172c-.24-.022-.482-.036-.731-.036-4.51 0-8.17 3.66-8.17 8.17 0 4.51 3.66 8.17 8.17 8.17s8.17-3.66 8.17-8.17v-10.08c1.505 1.225 3.411 1.956 5.49 1.956v-4.17c-3.13 0-5.67-2.54-5.67-5.67V.02h-4.25z" fill="#FE2C55" transform="translate(0.4, 0.4)"/>
          <path d="M12.525.02c1.31 0 2.591.26 3.811.73v4.257c-.711-.31-1.481-.47-2.281-.47-2.92 0-5.29 2.37-5.29 5.29 0 .09.01.18.02.27v4.25c-.01-.09-.02-.18-.02-.27 0-5.28 4.29-9.57 9.57-9.57.81 0 1.58.1 2.31.29V.75C19.385.25 18.104 0 16.794 0h-4.269v16.706c0 2.214-1.801 4.015-4.015 4.015s-4.015-1.801-4.015-4.015 1.801-4.015 4.015-4.015c.253 0 .495.029.731.083v-4.172c-.24-.022-.482-.036-.731-.036-4.51 0-8.17 3.66-8.17 8.17 0 4.51 3.66 8.17 8.17 8.17s8.17-3.66 8.17-8.17v-10.08c1.505 1.225 3.411 1.956 5.49 1.956v-4.17c-3.13 0-5.67-2.54-5.67-5.67V.02h-4.25z" fill="#FFFFFF"/>
        </g>
      </svg>
    )
  },
  { 
    name: "Facebook", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
      </svg>
    )
  },
];

const outerOrbit = [
  { 
    name: "Shopify", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path fill="#96bf48" d="M18.8 6.4L16.2 0H7.8L5.2 6.4L0 7.8L1.6 22.4L12 24L22.4 22.4L24 7.8L18.8 6.4Z" />
        <path fill="#fff" d="M12 19.2c-1.6 0-2.8-1-3.2-2l-.6-.8 1.8-.8.4.6c.2.4.8 1 1.6 1 .8 0 1.4-.4 1.4-1s-.4-.8-1.4-1.2c-1.6-.6-2.8-1.2-2.8-2.8 0-1.4 1-2.4 2.6-2.4 1.4 0 2.4.8 2.8 1.6l.6.8-1.8.8-.4-.6c-.2-.4-.6-.8-1.2-.8-.6 0-1 .4-1 .8 0 .4.4.6 1.2 1 1.6.6 2.8 1.2 2.8 2.8 0 1.4-1 2.8-2.8 2.8z" />
      </svg>
    )
  },
  { 
    name: "HubSpot", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M21.5 12.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zM12 1.5c-.828 0-1.5.672-1.5 1.5s.672 1.5 1.5 1.5 1.5-.672 1.5-1.5-.672-1.5-1.5-1.5zM2.5 12.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5z" fill="#FF7A59"/>
        <path d="M18 12.5c0-3.314-2.686-6-6-6-1.565 0-2.986.6-4.06 1.583L5.47 5.61a9.96 9.96 0 0 1 6.53-2.435c.42 0 .835.026 1.242.076V5.77c-.4-.04-.81-.06-1.242-.06-2.21 0-4 1.79-4 4 0 .53.1 1.03.28 1.49l-2.43 1.4c-.1-.4-.17-.81-.17-1.24 0-.43.07-.84.17-1.24L8.28 9.1c.18.46.28.96.28 1.49 0 2.21-1.79 4-4 4-.43 0-.84-.07-1.24-.17l-1.4 2.43c.46.18.96.28 1.49.28 3.314 0 6-2.686 6-6 0-.53-.1-1.03-.28-1.49l2.43-1.4c.1.4.17.81.17 1.24 0 .43-.07.84-.17 1.24l2.43 1.4c.18-.46.28-.96.28-1.49z" fill="#FF7A59"/>
      </svg>
    )
  },
  { 
    name: "ChatGPT", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M22.28 7.59c-.52-1.99-1.73-3.45-3.59-4.34a11.5 11.5 0 0 0-4.01-1.1c-2.02-.17-4.04-.17-6.06 0-1.35.11-2.69.49-4.01 1.1-1.86.89-3.07 2.35-3.59 4.34-.11.41-.18.82-.21 1.24v6.33c.03.42.1.83.21 1.24.52 1.99 1.73 3.45 3.59 4.34 1.32.61 2.66.99 4.01 1.1 2.02.17 4.04.17 6.06 0 1.35-.11 2.69-.49 4.01-1.1 1.86-.89 3.07-2.35 3.59-4.34.11-.41.18-.82.21-1.24V8.83c-.03-.42-.1-.83-.21-1.24zM12 16.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" fill="#10a37f"/>
      </svg>
    )
  },
  { 
    name: "Claude", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 2L4 20h3l2-5h6l2 5h3L12 2zm-2 10l2-5 2 5h-4z" fill="#D97757"/>
      </svg>
    )
  },
  { 
    name: "Gemini", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 2L9.12 9.12 2 12l7.12 2.88L12 22l2.88-7.12L22 12l-7.12-2.88L12 2z" fill="#4285F4"/>
      </svg>
    )
  },
  { 
    name: "Instagram", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="#E4405F"/>
      </svg>
    )
  },
  { 
    name: "WordPress", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5s10.5 4.701 10.5 10.5-4.701 10.5-10.5 10.5z" fill="#21759B"/>
      </svg>
    )
  },
  { 
    name: "WooCommerce", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm4 11l-4-6-4 6h8z" fill="#96588a"/>
      </svg>
    )
  },
  { 
    name: "Lovable", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 2 7.5 2c1.74 0 3.41.81 4.5 2.09C13.09 2.81 14.76 2 16.5 2 19.58 2 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF4D4D"/>
      </svg>
    )
  },
  { 
    name: "Twilio", 
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.75c-3.728 0-6.75-3.022-6.75-6.75s3.022-6.75 6.75-6.75 6.75 3.022 6.75 6.75-3.022 6.75-6.75 6.75z" fill="#F22F46"/>
      </svg>
    )
  },
];

export function IntegrationsSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight mb-6 font-sans"
          >
            Connect your favorite tools
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600 max-w-2xl mx-auto font-semibold font-sans"
          >
            Anaos seamlessly integrates with the apps you use every day to automate your business operations.
          </motion.p>
        </div>

        <div className="relative h-[450px] sm:h-[600px] flex items-center justify-center scale-[0.7] sm:scale-100 transition-transform">
          {/* Central Logo (Anaos) */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-zinc-900 flex items-center justify-center z-20 shadow-2xl shadow-blue-500/20 border border-zinc-800"
          >
            <span className="text-white font-black text-2xl sm:text-3xl font-sans tracking-tighter italic">A</span>
          </motion.div>

          {/* Inner Orbit */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] border border-zinc-100 rounded-full relative animate-[spin_40s_linear_infinite]">
              {innerOrbit.map((item, index) => {
                const angle = (index / innerOrbit.length) * (2 * Math.PI);
                const radius = 140; // sm: 150
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <motion.div
                    key={item.name}
                    className="absolute w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl shadow-lg border border-zinc-100 flex items-center justify-center"
                    style={{ left: `calc(50% + ${x}px - 24px)`, top: `calc(50% + ${y}px - 24px)` }}
                  >
                    <div className="animate-[spin_40s_linear_infinite_reverse]">
                      {item.icon}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Outer Orbit */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[480px] h-[480px] sm:w-[520px] sm:h-[520px] border border-zinc-100 rounded-full relative animate-[spin_60s_linear_infinite]">
              {outerOrbit.map((item, index) => {
                const angle = (index / outerOrbit.length) * (2 * Math.PI);
                const radius = 240; // sm: 260
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <motion.div
                    key={item.name}
                    className="absolute w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl shadow-lg border border-zinc-100 flex items-center justify-center"
                    style={{ left: `calc(50% + ${x}px - 24px)`, top: `calc(50% + ${y}px - 24px)` }}
                  >
                    <div className="animate-[spin_60s_linear_infinite_reverse]">
                      {item.icon}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Orbit Lines (Static Decorative) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[380px] h-[380px] sm:w-[410px] sm:h-[410px] border border-dashed border-zinc-100 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
