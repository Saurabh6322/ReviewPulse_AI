import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import OverviewPage from './pages/Overview/OverviewPage';
import SentimentAnalyticsPage from './pages/SentimentAnalytics/SentimentAnalyticsPage';
import ModelEvaluationPage from './pages/ModelEvaluation/ModelEvaluationPage';
import ConfusionMatrixPage from './pages/ConfusionMatrix/ConfusionMatrixPage';
import ReviewExplorerPage from './pages/ReviewExplorer/ReviewExplorerPage';
import WordIntelligencePage from './pages/WordIntelligence/WordIntelligencePage';
import BigDataMonitorPage from './pages/BigDataMonitor/BigDataMonitorPage';
import LivePredictionPage from './pages/LivePrediction/LivePredictionPage';
import DatasetManagerPage from './pages/DatasetManager/DatasetManagerPage';
import { AlertCircle } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <div className="w-16 h-16 rounded-full bg-negative/10 border border-negative/30 flex items-center justify-center text-negative mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-text-primary">404 - Page Not Found</h2>
      <p className="text-xs text-text-muted mt-2 max-w-sm">
        The requested ReviewPulse AI intelligence view does not exist or has been relocated.
      </p>
      <Link
        to="/overview"
        className="mt-5 px-4 py-2 rounded-card-sm bg-purple hover:bg-purple-dark text-white text-xs font-semibold transition-colors"
      >
        Return to Overview
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="analytics" element={<SentimentAnalyticsPage />} />
          <Route path="models" element={<ModelEvaluationPage />} />
          <Route path="confusion-matrix" element={<ConfusionMatrixPage />} />
          <Route path="reviews" element={<ReviewExplorerPage />} />
          <Route path="words" element={<WordIntelligencePage />} />
          <Route path="big-data" element={<BigDataMonitorPage />} />
          <Route path="prediction" element={<LivePredictionPage />} />
          <Route path="datasets" element={<DatasetManagerPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
