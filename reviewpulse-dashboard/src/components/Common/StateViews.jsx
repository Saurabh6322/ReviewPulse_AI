import React from 'react';
import { Loader2, Inbox, AlertTriangle, RefreshCw } from 'lucide-react';

export function LoadingState({ title = "Loading analytics...", description = "Fetching partitioned sentiment telemetry from PySpark cluster." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-card bg-card border border-border">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-purple/20 border-t-purple animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-cyan animate-pulse" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-muted mt-1 max-w-sm">{description}</p>
    </div>
  );
}

export function EmptyState({ 
  title = "No data records found", 
  description = "No reviews or telemetry matched the specified filter criteria.",
  actionText,
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-card bg-card border border-border">
      <div className="w-12 h-12 rounded-full bg-card-hover border border-border flex items-center justify-center mb-4 text-text-muted">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-muted mt-1 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-xs font-semibold rounded-card-sm bg-purple hover:bg-purple-dark text-white transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ 
  title = "Failed to load telemetry", 
  error = "Connection timeout while contacting PySpark gateway at spark://10.0.4.12:7077.",
  onRetry 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center rounded-card bg-negative/5 border border-negative/30">
      <div className="w-12 h-12 rounded-full bg-negative/10 border border-negative/30 flex items-center justify-center mb-4 text-negative">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-negative">{title}</h3>
      <p className="text-xs font-mono text-text-muted mt-2 max-w-md bg-background/50 p-2.5 rounded border border-border">
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-card-sm bg-card hover:bg-card-hover border border-border text-text-primary transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
