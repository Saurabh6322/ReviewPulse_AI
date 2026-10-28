import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  Database,
  User,
  X,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { DATASET_META } from '../../data/mockData';
import PreviewBadge from '../Common/PreviewBadge';

const PAGE_TITLES = {
  '/overview': { title: 'Platform Overview', subtitle: 'Real-time telemetry, model benchmarks & review stream' },
  '/analytics': { title: 'Sentiment Analytics', subtitle: 'Multi-dimensional distributions & customer satisfaction patterns' },
  '/models': { title: 'Model Evaluation', subtitle: 'TF-IDF, Linear SVM, Random Forest & PySpark pipeline metrics' },
  '/confusion-matrix': { title: 'Confusion Matrix Intelligence', subtitle: 'Error analysis, class misclassifications & precision-recall' },
  '/reviews': { title: 'Review Explorer', subtitle: 'Search, filter, and inspect cleaned customer review records' },
  '/words': { title: 'Word Intelligence', subtitle: 'Linguistic bubbling representation, polarity & TF-IDF term weights' },
  '/big-data': { title: 'Big Data Monitor', subtitle: 'PySpark distributed partitions, cluster throughput & executor load' },
  '/prediction': { title: 'Live Sentiment Prediction', subtitle: 'Test customer review inference with real-time confidence scores' },
  '/datasets': { title: 'Dataset Manager', subtitle: 'Data hygiene, partition shards, and schema configuration' },
};

export default function Header({
  onOpenMobile,
  isCollapsed
}) {
  const location = useLocation();
  const currentPath = location.pathname === '/' ? '/overview' : location.pathname;
  const pageInfo = PAGE_TITLES[currentPath] || { title: 'Dashboard', subtitle: 'ReviewPulse AI' };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#141B2D]/85 backdrop-blur-md border-b border-border px-4 lg:px-6 flex items-center justify-between transition-all duration-300">
      {/* Left: Mobile Toggle + Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-text-primary tracking-tight">
              {pageInfo.title}
            </h1>
            <PreviewBadge label="Preview Mode" className="hidden sm:inline-flex" />
          </div>
          <p className="hidden md:block text-[11px] text-text-muted">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Dataset Status, Search, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dataset Status Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 border border-border text-xs text-text-secondary">
          <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
          <span className="font-medium text-text-primary">{DATASET_META.totalReviews.toLocaleString()} Reviews</span>
          <span className="text-text-muted">•</span>
          <span className="text-cyan font-mono text-[11px]">PySpark Synced</span>
        </div>

        {/* Search Trigger */}
        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-card-sm text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
            title="Search dataset and models"
          >
            <Search className="w-4 h-4" />
          </button>

          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 p-2 rounded-card bg-card border border-border shadow-soft z-50 animate-in fade-in zoom-in-95">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search reviews, terms, models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-background border border-border rounded-card-sm pl-9 pr-8 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-text-muted hover:text-text-primary"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="mt-2 p-2 text-[11px] text-text-muted border-t border-border/50">
                Quick filter reviews, models (SVM, RF, PySpark) or top words
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 rounded-card-sm text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple rounded-full animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple rounded-full" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 p-3 rounded-card bg-card border border-border shadow-soft z-50">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <span className="text-xs font-bold text-text-primary">System Notifications</span>
                <span className="text-[10px] text-cyan font-mono">3 New</span>
              </div>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2 rounded bg-background/50 border border-border/40 text-xs">
                  <div className="font-semibold text-positive flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    PySpark Batch #84 Complete
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    Processed 18,450 records across 16 partitions in 1.4s.
                  </div>
                </div>

                <div className="p-2 rounded bg-background/50 border border-border/40 text-xs">
                  <div className="font-semibold text-purple flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    TF-IDF Vocabulary Re-indexed
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    Top 5,000 n-gram features indexed for Linear SVM.
                  </div>
                </div>

                <div className="p-2 rounded bg-background/50 border border-border/40 text-xs">
                  <div className="font-semibold text-cyan flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Random Forest Evaluated
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5">
                    Test accuracy recorded at 94.12% across 8,548 reviews.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border/70">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple to-cyan p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-[#141B2D] rounded-full flex items-center justify-center text-xs font-bold text-cyan">
              ML
            </div>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-text-primary leading-tight">Data Scientist</span>
            <span className="text-[10px] text-text-muted">ReviewPulse Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
