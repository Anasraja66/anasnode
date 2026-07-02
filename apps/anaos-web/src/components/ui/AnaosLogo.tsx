export function AnaosLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <mask id="swoosh-mask">
        <rect width="100" height="100" fill="white" />
        <path d="M 27.5 65 Q 55 45 95 50 Q 60 60 22.5 75 Z" fill="black" stroke="black" strokeWidth="4" strokeLinejoin="round" />
      </mask>

      {/* Main A Shape */}
      <path d="M50 20 L20 80 L35 80 L50 50 L65 80 L80 80 Z" fill="#0284c7" mask="url(#swoosh-mask)" />
      
      {/* The Swoosh */}
      <path d="M 27.5 65 Q 55 45 95 50 Q 60 60 22.5 75 Z" fill="#38bdf8" />

      {/* Two Dots */}
      <circle cx="42" cy="10" r="5" fill="#38bdf8" />
      <circle cx="58" cy="10" r="5" fill="#38bdf8" />
    </svg>
  );
}
