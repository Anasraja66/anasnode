"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Zap, MessageCircle, ShoppingBag, Users, Megaphone,
  HeadphonesIcon, Brain, Share2, Settings, Star, Sparkles,
  ArrowRight, Clock, Plug, Check, Filter, X, LayoutTemplate
} from "lucide-react";
import {
  WORKFLOW_TEMPLATES,
  TEMPLATE_CATEGORIES,
  getTemplatesByCategory,
  getPopularTemplates,
  searchTemplates,
  type TemplateCategory,
  type WorkflowTemplate
} from "@/lib/templates/workflow-templates";

const CATEGORY_ICONS: Record<string, any> = {
  whatsapp: MessageCircle,
  ecommerce: ShoppingBag,
  crm: Users,
  marketing: Megaphone,
  support: HeadphonesIcon,
  ai: Brain,
  social: Share2,
  operations: Settings,
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-red-100 text-red-700",
};

function TemplateCard({ template, onUse }: { template: WorkflowTemplate; onUse: () => void }) {
  const CategoryIcon = CATEGORY_ICONS[template.category] || Zap;
  const cat = TEMPLATE_CATEGORIES.find(c => c.id === template.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white border border-zinc-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all cursor-pointer relative overflow-hidden"
    >
      {/* Gradient glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/60 group-hover:to-purple-50/30 transition-all rounded-2xl" />

      <div className="relative">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          {template.popular && (
            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
              <Star className="w-2.5 h-2.5" /> Popular
            </span>
          )}
          {template.new && (
            <span className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
              <Sparkles className="w-2.5 h-2.5" /> New
            </span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${DIFFICULTY_COLORS[template.difficulty]}`}>
            {template.difficulty}
          </span>
        </div>

        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: cat?.color + "18" }}
          >
            <CategoryIcon className="w-5 h-5" style={{ color: cat?.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-[14px] text-zinc-900 leading-tight">{template.name}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-[12px] text-zinc-500 leading-relaxed mb-4 line-clamp-2">{template.description}</p>

        {/* Integrations */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {template.integrations.slice(0, 4).map(integration => (
            <span
              key={integration}
              className="text-[10px] font-medium px-2 py-0.5 bg-zinc-50 border border-zinc-100 text-zinc-600 rounded-full capitalize"
            >
              {integration}
            </span>
          ))}
          {template.integrations.length > 4 && (
            <span className="text-[10px] text-zinc-400">+{template.integrations.length - 4} more</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-50">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Clock className="w-3 h-3" />
            <span>{template.estimatedSetupTime}</span>
          </div>
          <button
            onClick={onUse}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 hover:text-blue-700 group/btn transition-colors"
          >
            Use Template
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import { AIPromptGenerator } from "@/components/automations/AIPromptGenerator";

export default function TemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all" | "popular">("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

  const filteredTemplates = (() => {
    if (searchQuery.trim()) return searchTemplates(searchQuery);
    if (activeCategory === "all") return WORKFLOW_TEMPLATES;
    if (activeCategory === "popular") return getPopularTemplates();
    return getTemplatesByCategory(activeCategory as TemplateCategory);
  })();

  const handleUseTemplate = async (template: WorkflowTemplate) => {
    // Save template as new workflow and open in builder
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          definition: JSON.stringify(template.definition),
        }),
      });
      const data = await res.json();
      if (data.workflow?.id) {
        router.push(`/dashboard/automations/builder/${data.workflow.id}`);
      } else {
        // Fallback: open builder with template in localStorage
        localStorage.setItem("anaos_template_draft", JSON.stringify(template));
        router.push("/dashboard/automations/builder/new");
      }
    } catch {
      localStorage.setItem("anaos_template_draft", JSON.stringify(template));
      router.push("/dashboard/automations/builder/new");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-zinc-100 px-8 py-10 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-zinc-900 mb-4 tracking-tight">
              What would you like to automate?
            </h1>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-medium">
              Simply describe your workflow and AnaOS AI will build it instantly, or pick from our {WORKFLOW_TEMPLATES.length}+ production-ready templates.
            </p>
          </div>
          
          <AIPromptGenerator />
          
          <div className="flex items-center justify-between mt-12 mb-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-blue-600" />
                Template Library
              </h2>
            </div>
            {/* Search */}
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setActiveCategory("all"); }}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {/* All & Popular */}
            {[
              { id: "popular", label: "⭐ Popular", color: "#F59E0B" },
              { id: "all", label: "All Templates", color: "#6B7280" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveCategory(tab.id as any); setSearchQuery(""); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === tab.id
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {tab.label}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeCategory === tab.id ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-500"
                }`}>
                  {tab.id === "popular" ? getPopularTemplates().length : WORKFLOW_TEMPLATES.length}
                </span>
              </button>
            ))}

            <div className="w-px h-5 bg-zinc-200 mx-1" />

            {/* Category tabs */}
            {TEMPLATE_CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat.id] || Zap;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id as TemplateCategory); setSearchQuery(""); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                  style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeCategory === cat.id ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-500"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-zinc-500">
            {searchQuery ? (
              <><span className="font-semibold text-zinc-900">{filteredTemplates.length}</span> results for "<span className="text-blue-600">{searchQuery}</span>"</>
            ) : (
              <><span className="font-semibold text-zinc-900">{filteredTemplates.length}</span> templates</>
            )}
          </p>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20">
            <Zap className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No templates found</h3>
            <p className="text-zinc-500">Try a different search or <button onClick={() => setActiveCategory("all")} className="text-blue-600">browse all templates</button></p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={() => handleUseTemplate(template)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
