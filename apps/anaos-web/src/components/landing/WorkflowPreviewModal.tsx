import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, X, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Feature {
  category: string;
  title: string;
  description: string;
  defaultOn: boolean;
}

interface WorkflowPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploy: (enabledFeatures: string[]) => void;
  onEdit: () => void;
  previewData: {
    workflowName: string;
    industry: string;
    features: Feature[];
  } | null;
}

export function WorkflowPreviewModal({
  isOpen,
  onClose,
  onDeploy,
  onEdit,
  previewData,
}: WorkflowPreviewModalProps) {
  const [enabledStates, setEnabledStates] = useState<Record<string, boolean>>({});
  const [isDeploying, setIsDeploying] = useState(false);

  // Initialize states when preview data changes
  React.useEffect(() => {
    if (previewData?.features) {
      const initial: Record<string, boolean> = {};
      previewData.features.forEach((f) => {
        initial[f.title] = f.defaultOn;
      });
      setEnabledStates(initial);
    }
  }, [previewData]);

  if (!isOpen || !previewData) return null;

  const handleDeploy = async () => {
    setIsDeploying(true);
    const enabledFeatures = Object.keys(enabledStates).filter(k => enabledStates[k]);
    // Simulate a tiny delay for the "Deploying Agent..." effect
    await new Promise(r => setTimeout(r, 1200));
    onDeploy(enabledFeatures);
    setIsDeploying(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 pt-8 pb-4">
            <button 
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-600 bg-zinc-50 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-[32px] font-extrabold text-[#111827] tracking-tight leading-tight font-display mb-1">
              {previewData.workflowName}
            </h2>
            <p className="text-[15px] text-zinc-500 font-medium">
              <span className="capitalize">{previewData.industry}</span> Engine • {previewData.features.length} AI-Powered workflows generated.
            </p>
          </div>

          {/* Scrollable Features List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
            {previewData.features.map((feature, idx) => {
              const isEnabled = enabledStates[feature.title] ?? false;
              return (
                <div 
                  key={idx} 
                  className={`border rounded-2xl p-5 transition-all duration-200 ${
                    isEnabled ? "border-zinc-200 bg-white shadow-sm" : "border-zinc-100 bg-zinc-50/50 opacity-70"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600">
                      {feature.category}
                    </span>
                    
                    {/* Custom iOS Style Switch */}
                    <button
                      onClick={() => setEnabledStates(prev => ({ ...prev, [feature.title]: !prev[feature.title] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                        isEnabled ? "bg-blue-600" : "bg-zinc-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 shadow-sm ${
                          isEnabled ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  
                  <h3 className="text-[17px] font-bold text-zinc-900 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] text-zinc-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Sticky Footer */}
          <div className="p-5 bg-white border-t border-zinc-100 mt-auto rounded-b-[24px]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-50 p-1.5 rounded-full">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-[14px] font-bold text-zinc-700 leading-tight">
                  Agent Setup<br />Complete
                </span>
              </div>
              
              <Button 
                onClick={handleDeploy}
                disabled={isDeploying}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-6 h-auto font-bold text-[15px] shadow-sm shadow-blue-500/20 transition-all min-w-[160px]"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  "Deploy Agent"
                )}
              </Button>
            </div>
            
            {/* Edit Option */}
            <div className="flex justify-center border-t border-zinc-50 pt-3">
              <button 
                onClick={onEdit}
                className="text-[13px] text-zinc-500 hover:text-zinc-800 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Settings2 className="w-4 h-4" />
                Or edit workflow manually
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
