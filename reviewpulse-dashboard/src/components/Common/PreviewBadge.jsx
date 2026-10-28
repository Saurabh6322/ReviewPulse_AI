import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';

export default function PreviewBadge({ label = "PREVIEW DATA • SIMULATED METRICS", variant = "warning", className = "" }) {
  const isWarning = variant === "warning";
  
  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${
        isWarning 
          ? "bg-neutral/10 border-neutral/30 text-neutral text-glow" 
          : "bg-purple/10 border-purple/30 text-purple"
      } ${className}`}
      title="UI is currently rendering mock benchmark preview data until the Flask ML service is integrated."
    >
      {isWarning ? <AlertCircle className="w-3.5 h-3.5 text-neutral" /> : <Sparkles className="w-3.5 h-3.5 text-purple" />}
      <span>{label}</span>
    </div>
  );
}
