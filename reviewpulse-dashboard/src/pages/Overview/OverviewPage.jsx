import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Layers,
  TrendingUp,
  Zap,
  ArrowRight,
  Database,
  CheckCircle,
  Eye,
  RefreshCw
} from 'lucide-react';
import MetricCard from '../../components/Common/MetricCard';
import PreviewBadge from '../../components/Common/PreviewBadge';
import { LoadingState, EmptyState, ErrorState } from '../../components/Common/StateViews';
import PlotlyChart from '../../components/Charts/PlotlyChart';
import { DATASET_META, MODEL_BENCHMARKS, RECENT_REVIEWS_SAMPLE } from '../../data/mockData';
import { Link } from 'react-router-dom';

export default function OverviewPage() {
  const [demoState, setDemoState] = useState('normal'); // 'normal', 'loading', 'empty', 'error'

  if (demoState === 'loading') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => setDemoState('normal')} className="text-xs text-cyan hover:underline">Reset to Normal View</button>
        </div>
        <LoadingState title="Loading ReviewPulse AI Engine" description="Streaming review shards from PySpark cluster." />
      </div>
    );
  }

  if (demoState === 'empty') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => setDemoState('normal')} className="text-xs text-cyan hover:underline">Reset to Normal View</button>
        </div>
        <EmptyState title="No Review Telemetry Available" description="No reviews found in active batch." actionText="Reload Sample Shard" onAction={() => setDemoState('normal')} />
      </div>
    );
  }

  if (demoState === 'error') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={() => setDemoState('normal')} className="text-xs text-cyan hover:underline">Reset to Normal View</button>
        </div>
        <ErrorState onRetry={() => setDemoState('normal')} />
      </div>
    );
  }

  // Chart 1: Sentiment Distribution Donut
  const sentimentDonutData = [
    {
      values: [DATASET_META.positiveReviews, DATASET_META.neutralReviews, DATASET_META.negativeReviews],
      labels: ['Positive', 'Neutral', 'Negative'],
      type: 'pie',
      hole: 0.65,
      marker: {
        colors: ['#34D399', '#FBBF24', '#FB7185']
      },
      textinfo: 'percent+label',
      hoverinfo: 'label+value+percent'
    }
  ];

  // Chart 2: Model Accuracy & Latency Bar Chart
  const modelCompData = [
    {
      x: MODEL_BENCHMARKS.map(m => m.name),
      y: MODEL_BENCHMARKS.map(m => m.accuracy),
      type: 'bar',
      name: 'Accuracy (%)',
      marker: {
        color: ['#22D3EE', '#8B5CF6', '#34D399']
      },
      text: MODEL_BENCHMARKS.map(m => `${m.accuracy}%`),
      textposition: 'inside'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-card-lg bg-gradient-to-r from-card via-[#1A2238] to-card border border-border p-6 shadow-soft">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-purple/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan/10 text-cyan border border-cyan/30">
                PySpark 3.5 Distributed Cluster
              </span>
              <PreviewBadge />
            </div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-text-primary tracking-tight">
              Customer Sentiment Intelligence at Big-Data Scale
            </h2>
            <p className="text-xs md:text-sm text-text-secondary mt-1 max-w-2xl">
              Amazon consumer feedback analysis leveraging TF-IDF vectorization, Linear SVM, Random Forest, and PySpark MLlib distributed pipelines.
            </p>
          </div>

          {/* Interactive State Switcher for review */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-card-sm bg-background/70 border border-border self-start md:self-center">
            <span className="text-[10px] uppercase font-bold text-text-muted px-2">State Demo:</span>
            <button
              onClick={() => setDemoState('normal')}
              className={`px-2 py-1 text-xs rounded font-medium transition-colors ${demoState === 'normal' ? 'bg-cyan text-background font-bold' : 'text-text-muted hover:text-text-primary'}`}
            >
              Normal
            </button>
            <button
              onClick={() => setDemoState('loading')}
              className="px-2 py-1 text-xs rounded text-text-muted hover:text-text-primary transition-colors"
            >
              Loading
            </button>
            <button
              onClick={() => setDemoState('empty')}
              className="px-2 py-1 text-xs rounded text-text-muted hover:text-text-primary transition-colors"
            >
              Empty
            </button>
            <button
              onClick={() => setDemoState('error')}
              className="px-2 py-1 text-xs rounded text-text-muted hover:text-text-primary transition-colors"
            >
              Error
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Processed Reviews"
          value={DATASET_META.totalReviews.toLocaleString()}
          delta="+42,740 cleaned"
          deltaType="positive"
          subtitle="Deduplicated dataset"
          icon={Layers}
          accentColor="cyan"
        />

        <MetricCard
          title="Top Pipeline Accuracy"
          value="95.30%"
          delta="+0.45% vs Linear SVM"
          deltaType="positive"
          subtitle="PySpark Distributed Ensemble"
          icon={Cpu}
          accentColor="positive"
        />

        <MetricCard
          title="Cluster Throughput"
          value={DATASET_META.sparkThroughput}
          delta="16 Partitions"
          deltaType="neutral"
          subtitle="4 Spark Worker Nodes"
          icon={Activity}
          accentColor="purple"
        />

        <MetricCard
          title="Linear SVM Latency"
          value="4.2 ms"
          delta="Ultra-fast"
          deltaType="positive"
          subtitle="TF-IDF (5,000 features)"
          icon={Zap}
          accentColor="cyan"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Donut */}
        <div className="bg-card border border-border rounded-card p-5 shadow-soft flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Sentiment Breakdown</h3>
              <p className="text-[11px] text-text-muted">42,740 classified reviews</p>
            </div>
            <Link to="/analytics" className="text-xs text-cyan hover:underline flex items-center gap-1 font-medium">
              Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1 min-h-[260px]">
            <PlotlyChart
              data={sentimentDonutData}
              layout={{
                showlegend: true,
                legend: { orientation: 'h', y: -0.15, font: { size: 10 } },
                margin: { l: 10, r: 10, t: 10, b: 20 }
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50 text-center text-xs">
            <div>
              <span className="text-positive font-bold text-sm block">41.9%</span>
              <span className="text-text-muted text-[10px]">Positive</span>
            </div>
            <div>
              <span className="text-neutral font-bold text-sm block">24.5%</span>
              <span className="text-text-muted text-[10px]">Neutral</span>
            </div>
            <div>
              <span className="text-negative font-bold text-sm block">33.6%</span>
              <span className="text-text-muted text-[10px]">Negative</span>
            </div>
          </div>
        </div>

        {/* Model Accuracy Benchmark Comparison */}
        <div className="lg:col-span-2 bg-card border border-border rounded-card p-5 shadow-soft flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Model Accuracy Benchmark</h3>
              <p className="text-[11px] text-text-muted">TF-IDF + Linear SVM vs Random Forest vs PySpark MLlib</p>
            </div>
            <Link to="/models" className="text-xs text-purple-light hover:underline flex items-center gap-1 font-medium">
              All Metrics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex-1 min-h-[260px]">
            <PlotlyChart
              data={modelCompData}
              layout={{
                yaxis: { range: [90, 100], title: { text: 'Accuracy (%)', font: { size: 11 } } },
                xaxis: { title: { text: 'Architecture', font: { size: 11 } } },
                margin: { l: 45, r: 20, t: 20, b: 40 }
              }}
            />
          </div>

          <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between text-xs text-text-muted gap-2">
            <span>Linear SVM provides the lowest inference latency at 4.2ms.</span>
            <span className="text-positive font-semibold">PySpark MLlib leads overall accuracy at 95.30%.</span>
          </div>
        </div>
      </div>

      {/* Recent Reviews Streaming Table */}
      <div className="bg-card border border-border rounded-card p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary">Recent Ingested Reviews</h3>
            <p className="text-[11px] text-text-muted">Live classification stream through TF-IDF + Linear SVM model</p>
          </div>
          <Link
            to="/reviews"
            className="px-3 py-1.5 rounded-card-sm text-xs font-semibold bg-background hover:bg-card-hover border border-border text-cyan transition-colors flex items-center gap-1.5"
          >
            <span>Explore All Reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-text-muted uppercase text-[10px] tracking-wider">
                <th className="pb-2.5 font-semibold">ID</th>
                <th className="pb-2.5 font-semibold">Product</th>
                <th className="pb-2.5 font-semibold">Rating</th>
                <th className="pb-2.5 font-semibold">Predicted Sentiment</th>
                <th className="pb-2.5 font-semibold">Confidence</th>
                <th className="pb-2.5 font-semibold">Review Text</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {RECENT_REVIEWS_SAMPLE.map((rev) => (
                <tr key={rev.id} className="hover:bg-card-hover/60 transition-colors">
                  <td className="py-3 font-mono text-cyan text-[11px]">{rev.id}</td>
                  <td className="py-3 font-medium text-text-primary max-w-[180px] truncate">{rev.product}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-background border border-border font-bold">
                      {rev.rating} ★
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase border ${
                        rev.sentiment === 'Positive'
                          ? 'bg-positive/10 text-positive border-positive/30'
                          : rev.sentiment === 'Negative'
                          ? 'bg-negative/10 text-negative border-negative/30'
                          : 'bg-neutral/10 text-neutral border-neutral/30'
                      }`}
                    >
                      {rev.sentiment}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[11px]">
                    {(rev.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 text-text-secondary max-w-[320px] truncate" title={rev.text}>
                    {rev.text}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
