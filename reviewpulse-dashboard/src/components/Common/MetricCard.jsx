import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  delta,
  deltaType = "positive", // "positive", "negative", "neutral"
  subtitle,
  icon: Icon,
  accentColor = "purple", // "purple", "cyan", "positive", "negative", "neutral"
  sparkline,
  className = ""
}) {
  const accentClasses = {
    purple: {
      borderHover: "hover:border-purple/50",
      glow: "group-hover:shadow-glow-purple",
      iconBg: "bg-purple/10 text-purple border-purple/30",
    },
    cyan: {
      borderHover: "hover:border-cyan/50",
      glow: "group-hover:shadow-glow-cyan",
      iconBg: "bg-cyan/10 text-cyan border-cyan/30",
    },
    positive: {
      borderHover: "hover:border-positive/50",
      glow: "group-hover:shadow-glow-positive",
      iconBg: "bg-positive/10 text-positive border-positive/30",
    },
    negative: {
      borderHover: "hover:border-negative/50",
      glow: "group-hover:shadow-glow-negative",
      iconBg: "bg-negative/10 text-negative border-negative/30",
    },
    neutral: {
      borderHover: "hover:border-neutral/50",
      glow: "group-hover:shadow-glow-neutral",
      iconBg: "bg-neutral/10 text-neutral border-neutral/30",
    }
  }[accentColor] || {};

  return (
    <div
      className={`group relative bg-card border border-border rounded-card p-5 transition-all duration-300 ease-out shadow-soft ${accentClasses.borderHover} ${accentClasses.glow} ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span className="text-xs uppercase tracking-wider font-medium text-text-muted">
            {title}
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-text-primary">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-card-sm border ${accentClasses.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(delta || subtitle) && (
        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-border/50">
          {delta && (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                deltaType === "positive"
                  ? "text-positive"
                  : deltaType === "negative"
                  ? "text-negative"
                  : "text-neutral"
              }`}
            >
              {deltaType === "positive" ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : deltaType === "negative" ? (
                <ArrowDownRight className="w-3.5 h-3.5" />
              ) : null}
              {delta}
            </span>
          )}

          {subtitle && (
            <span className="text-text-muted truncate ml-auto">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
