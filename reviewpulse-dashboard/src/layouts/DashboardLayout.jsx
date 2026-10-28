import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import PreviewBadge from '../components/Common/PreviewBadge';
import { DATASET_META } from '../data/mockData';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex text-text-primary">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-[78px]' : 'lg:pl-[260px]'
        }`}
      >
        {/* Sticky Top Header */}
        <Header
          onOpenMobile={() => setIsMobileOpen(true)}
          isCollapsed={isCollapsed}
        />

        {/* Global Notice Bar: Preview Data Notification */}
        <div className="bg-[#141B2D]/40 border-b border-border/50 px-4 lg:px-6 py-2 flex flex-wrap items-center justify-between text-xs text-text-muted gap-2">
          <div className="flex items-center gap-2">
            <PreviewBadge label="UI Preview Data" variant="purple" />
            <span>Currently rendering simulated Amazon review metrics & PySpark cluster telemetry.</span>
          </div>
          <span className="font-mono text-[11px] text-cyan/80">
            Cluster Target: PySpark 3.5 MLlib • Flask REST API
          </span>
        </div>

        {/* Scrollable Page Body */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* Subtle Footer */}
        <footer className="border-t border-border/50 px-6 py-3.5 text-xs text-text-muted flex flex-wrap items-center justify-between gap-2">
          <span>ReviewPulse AI • Amazon Sentiment Intelligence Platform</span>
          <span className="font-mono text-[11px]">PySpark • TF-IDF • Linear SVM • Random Forest</span>
        </footer>
      </div>
    </div>
  );
}
