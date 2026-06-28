"use client";

import { motion } from "framer-motion";

export function WorkflowBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-white">
      {/* Soft sky blue grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-80" />
      
      {/* Animated Glowing Orbs (Sky Blue & White themes) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-sky-400/10 blur-[100px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, -30, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px]" 
      />

      {/* Workflow connecting lines (Subtle) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="1" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Animated paths mimicking workflows */}
        <motion.path
          d="M 100 800 Q 300 500 600 500 T 1200 200"
          fill="none"
          stroke="url(#flowGrad)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M -100 200 Q 200 400 500 200 T 1500 600"
          fill="none"
          stroke="url(#flowGrad)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
        />
        <motion.path
          d="M 800 1000 Q 900 600 1200 700 T 2000 300"
          fill="none"
          stroke="url(#flowGrad)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
        />
      </svg>
    </div>
  );
}
