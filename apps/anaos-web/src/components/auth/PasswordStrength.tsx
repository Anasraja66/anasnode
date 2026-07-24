"use client";

import { useMemo } from "react";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  return (
    <div className="flex flex-col gap-2 mt-3">
      <div className="flex gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((index) => {
          let bgColor = "bg-zinc-200"; // default empty
          
          if (strength >= index) {
            if (strength === 1) bgColor = "bg-red-500";
            else if (strength === 2) bgColor = "bg-orange-500";
            else if (strength === 3) bgColor = "bg-[#0A6BFF]";
            else if (strength === 4) bgColor = "bg-emerald-500";
          }
          
          return (
            <div
              key={index}
              className={`flex-1 rounded-full transition-colors duration-300 ${bgColor}`}
            />
          );
        })}
      </div>
      <p className="text-[11.5px] font-medium text-zinc-500">
        Use 8+ characters with a number and symbol
      </p>
    </div>
  );
}
