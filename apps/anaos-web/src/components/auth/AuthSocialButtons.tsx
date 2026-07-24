"use client";

import { Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export function AuthSocialButtons() {
  const searchParams = useSearchParams();
  const prompt = searchParams?.get("prompt");
  const workspace = searchParams?.get("workspace");

  const handleProvider = (provider: string) => {
    const callbackUrl = prompt 
      ? `/onboarding?prompt=${prompt}${workspace ? `&workspace=${workspace}` : ""}`
      : "/dashboard";
    
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-200 border border-dashed border-zinc-200" />
        <span className="text-[11px] font-semibold text-zinc-400 tracking-wider">OR</span>
        <div className="flex-1 h-px bg-zinc-200 border border-dashed border-zinc-200" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handleProvider("google")}
          className="w-full h-11 bg-white border border-zinc-200 rounded-xl flex items-center justify-center gap-3 text-[14px] font-bold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          onClick={() => {}} // Usually Email is a form, but Figma shows it as a button. Might just focus the email input or handle magic link
          className="w-full h-11 bg-white border border-zinc-200 rounded-xl flex items-center justify-center gap-3 text-[14px] font-bold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer"
        >
          <Mail className="w-5 h-5 text-zinc-700" />
          Continue with Email
        </button>

        <button
          type="button"
          onClick={() => handleProvider("apple")}
          className="w-full h-11 bg-white border border-zinc-200 rounded-xl flex items-center justify-center gap-3 text-[14px] font-bold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 13.97c-.03-2.39 1.94-3.55 2.03-3.61-1.12-1.63-2.85-1.87-3.48-1.9-1.48-.15-2.9.88-3.66.88-.76 0-1.92-.85-3.14-.83-1.6.03-3.08.93-3.9 2.37-1.68 2.9-.43 7.2 1.2 9.56.8 1.15 1.74 2.43 2.99 2.39 1.18-.05 1.64-.76 3.08-.76 1.43 0 1.86.76 3.1.73 1.28-.03 2.11-1.18 2.9-2.33 1.12-1.65 1.58-3.24 1.6-3.32-.03-.02-2.18-.84-2.2-3.38zm-1.89-6.32c.62-.76 1.04-1.82.93-2.87-1.1.05-2.22.68-2.86 1.44-.57.68-1.06 1.76-.93 2.79 1.22.1 2.24-.6 2.86-1.36z" />
          </svg>
          Continue with Apple
        </button>

        <button
          type="button"
          onClick={() => handleProvider("facebook")}
          className="w-full h-11 bg-white border border-zinc-200 rounded-xl flex items-center justify-center gap-3 text-[14px] font-bold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continue with Facebook
        </button>
      </div>
    </div>
  );
}
