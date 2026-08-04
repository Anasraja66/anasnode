import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

export function InnerPageHeader({
  title,
  subtitle,
  icon: Icon,
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="bg-white border-b border-zinc-100 relative overflow-hidden">
      {/* Decorative subtle gradients */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <Link 
          href={backHref} 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-all mb-8 shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          {backLabel}
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {Icon && (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A6BFF] to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 border border-blue-400/20">
                <Icon className="w-7 h-7 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-[26px] font-extrabold text-zinc-900 tracking-tight leading-none mb-1.5">{title}</h1>
              {subtitle && <p className="text-[14px] font-medium text-zinc-500 max-w-xl">{subtitle}</p>}
            </div>
          </div>
          
          {children && (
            <div className="flex items-center gap-3 w-full md:w-auto">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
