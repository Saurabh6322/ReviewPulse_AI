import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PieChart,
  Cpu,
  Grid,
  FileText,
  Sparkles,
  Database,
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight,
  Activity,
  Server
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/overview', label: 'Overview', icon: LayoutDashboard },
  { path: '/analytics', label: 'Sentiment Analytics', icon: PieChart },
  { path: '/models', label: 'Model Evaluation', icon: Cpu },
  { path: '/confusion-matrix', label: 'Confusion Matrix', icon: Grid },
  { path: '/reviews', label: 'Review Explorer', icon: FileText },
  { path: '/words', label: 'Word Intelligence', icon: Sparkles },
  { path: '/big-data', label: 'Big Data Monitor', icon: Database },
  { path: '/prediction', label: 'Live Prediction', icon: Zap },
  { path: '/datasets', label: 'Dataset Manager', icon: Layers },
];

export default function Sidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[78px]' : 'w-[260px]'
        } ${
          isMobileOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0 w-9 h-9 rounded-card-sm bg-gradient-to-br from-purple to-cyan flex items-center justify-center shadow-glow-purple">
              <Activity className="w-5 h-5 text-background" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-positive rounded-full animate-pulse border border-card" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide text-text-primary flex items-center gap-1.5">
                  ReviewPulse<span className="text-cyan text-xs font-mono uppercase bg-cyan/10 px-1.5 py-0.5 rounded border border-cyan/30">AI</span>
                </span>
                <span className="text-[10px] text-text-muted tracking-tight truncate">
                  Big Data ML Intelligence
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-card-sm text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple/20 to-cyan/10 text-cyan border border-purple/30 shadow-glow-purple'
                      : 'text-text-secondary hover:text-text-primary hover:bg-card-hover'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-cyan' : 'text-text-muted group-hover:text-purple-light'
                      }`}
                    />

                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}

                    {/* Active Pill Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-purple to-cyan rounded-r" />
                    )}

                    {/* Tooltip on Collapsed */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2 py-1 rounded bg-[#1E293B] border border-border text-text-primary text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-soft">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* PySpark Engine Status Card */}
        <div className="p-3 border-t border-border">
          {!isCollapsed ? (
            <div className="p-3 rounded-card-sm bg-background/60 border border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-positive animate-ping" />
                <div>
                  <div className="text-[11px] font-semibold text-text-primary flex items-center gap-1">
                    <Server className="w-3 h-3 text-cyan" />
                    PySpark 3.5 Active
                  </div>
                  <div className="text-[10px] text-text-muted">4 Workers • 32 Cores</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="PySpark 3.5 Engine Active (4 Workers)">
              <div className="w-2.5 h-2.5 rounded-full bg-positive animate-pulse" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
