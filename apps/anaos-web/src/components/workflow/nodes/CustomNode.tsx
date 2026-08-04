import { Handle, Position } from "@xyflow/react";
import BrandIcon from "@/components/ui/BrandIcon";
import { Zap, Bell, Mail, Database, Bot, Clock } from "lucide-react";

interface NodeData {
  label: string;
  type: "trigger" | "action" | "condition";
  app: string;
  description?: string;
}

export function CustomNode({ data }: { data: NodeData }) {
  const isTrigger = data.type === "trigger";

  // Determine icon based on app
  const getIcon = () => {
    switch (data.app?.toLowerCase()) {
      case "whatsapp":
        return <BrandIcon id="whatsapp" className="w-6 h-6" />;
      case "slack":
        return <BrandIcon id="slack" className="w-6 h-6" />;
      case "hubspot":
        return <BrandIcon id="hubspot" className="w-6 h-6" />;
      case "notion":
        return <BrandIcon id="notion" className="w-6 h-6" />;
      case "openai":
        return <BrandIcon id="openai" className="w-6 h-6" />;
      case "schedule":
        return <Clock className="w-6 h-6 text-purple-500" />;
      case "webhook":
        return <Zap className="w-6 h-6 text-orange-500" />;
      case "email":
        return <Mail className="w-6 h-6 text-blue-500" />;
      case "ai":
        return <Bot className="w-6 h-6 text-emerald-500" />;
      default:
        return <Database className="w-6 h-6 text-zinc-500" />;
    }
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
    if (data.type === "condition") {
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
            {data.label}
          </div>
          <div className="text-[12px] text-zinc-500 font-medium mt-0.5 line-clamp-1">
            {data.description || `Execute ${data.app} step`}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${styles.tagBg} ${styles.tagText}`}>
          {data.type}
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
