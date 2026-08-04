import { Handle, Position } from "@xyflow/react";
import BrandIcon from "@/components/ui/BrandIcon";
import { Zap, Bell, Mail, Database, Bot, Clock } from "lucide-react";

interface NodeData {
  label: string;
  type: "trigger" | "action" | "condition";
  app: string;
  description?: string;
}

export function CustomNode({ data, type }: { data: any, type: string }) {
  // Map backend types if they don't match exactly
  const nodeType = data.type === 'trigger' || type === 'trigger' ? 'trigger' 
                 : type === 'condition' ? 'condition' 
                 : 'action';
  
  const isTrigger = nodeType === "trigger";

  const appName = data.app || data.type || data.actionType || "unknown";
  const label = data.label || data.title || "Unknown Node";
  const desc = data.description || `Execute ${appName} step`;

  // Determine icon based on app
  const getIcon = () => {
    const a = appName.toLowerCase();
    if (a.includes("whatsapp")) return <BrandIcon id="whatsapp" className="w-6 h-6" />;
    if (a.includes("slack")) return <BrandIcon id="slack" className="w-6 h-6" />;
    if (a.includes("hubspot") || a.includes("crm")) return <BrandIcon id="hubspot" className="w-6 h-6" />;
    if (a.includes("notion")) return <BrandIcon id="notion" className="w-6 h-6" />;
    if (a.includes("openai") || a.includes("ai")) return <BrandIcon id="openai" className="w-6 h-6" />;
    if (a.includes("schedule")) return <Clock className="w-6 h-6 text-purple-500" />;
    if (a.includes("webhook")) return <Zap className="w-6 h-6 text-orange-500" />;
    if (a.includes("email")) return <Mail className="w-6 h-6 text-blue-500" />;
    if (type === "condition") return <Zap className="w-6 h-6 text-purple-500" />;
    return <Database className="w-6 h-6 text-zinc-500" />;
  };

  // Determine styles based on type
  const getStyles = () => {
    if (isTrigger) {
      return {
        border: "border-green-500/30",
        bg: "bg-white",
        shadow: "shadow-sm shadow-green-500/10",
        tagBg: "bg-green-100",
        tagText: "text-green-700",
      };
    }
    if (nodeType === "condition") {
      return {
        border: "border-purple-500/30",
        bg: "bg-white",
        shadow: "shadow-sm shadow-purple-500/10",
        tagBg: "bg-purple-100",
        tagText: "text-purple-700",
      };
    }
    // Action
    return {
      border: "border-blue-500/30",
      bg: "bg-white",
      shadow: "shadow-sm shadow-blue-500/10",
      tagBg: "bg-blue-100",
      tagText: "text-blue-700",
    };
  };

  const styles = getStyles();

  return (
    <div className={`w-[260px] rounded-2xl border ${styles.border} ${styles.bg} ${styles.shadow} p-4 relative`}>
      {/* Input Handle - Only for actions/conditions */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-zinc-300 border-2 border-white rounded-full"
        />
      )}

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>
        <div>
          <div className="font-bold text-[14px] text-zinc-900 leading-tight">
            {label}
          </div>
          <div className="text-[12px] text-zinc-500 font-medium mt-0.5 line-clamp-1">
            {desc}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${styles.tagBg} ${styles.tagText}`}>
          {nodeType}
        </span>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 bg-zinc-300 border-2 border-white rounded-full`}
      />
    </div>
  );
}
