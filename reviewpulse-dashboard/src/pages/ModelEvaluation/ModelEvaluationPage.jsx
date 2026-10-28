import React, { useState } from 'react';
import PlotlyChart from '../../components/Charts/PlotlyChart';
import MetricCard from '../../components/Common/MetricCard';
import PreviewBadge from '../../components/Common/PreviewBadge';
import { MODEL_BENCHMARKS } from '../../data/mockData';
import { Cpu, Zap, CheckCircle2, Award, Clock, ArrowUpRight } from 'lucide-react';

export default function ModelEvaluationPage() {
  const [selectedMetric, setSelectedMetric] = useState('accuracy');

  // Chart 1: Grouped Metrics Bar Chart
  const groupedMetricsData = [
    {
      x: MODEL_BENCHMARKS.map(m => m.name),
      y: MODEL_BENCHMARKS.map(m => m.accuracy),
      type: 'bar',
      name: 'Accuracy (%)',
      marker: { color: '#22D3EE' }
    },
    {
      x: MODEL_BENCHMARKS.map(m => m.name),
      y: MODEL_BENCHMARKS.map(m => m.precision),
      type: 'bar',
      name: 'Precision (%)',
      marker: { color: '#8B5CF6' }
    },
    {
      x: MODEL_BENCHMARKS.map(m => m.name),
      y: MODEL_BENCHMARKS.map(m => m.recall),
      type: 'bar',
      name: 'Recall (%)',
      marker: { color: '#34D399' }
    },
    {
      x: MODEL_BENCHMARKS.map(m => m.name),
      y: MODEL_BENCHMARKS.map(m => m.f1Score),
      type: 'bar',
      name: 'F1-Score (%)',
      marker: { color: '#FBBF24' }
    }
  ];

  // Chart 2: Radar Competency Chart
  const radarData = MODEL_BENCHMARKS.map((m) => ({
    type: 'scatterpolar',
    r: [m.accuracy, m.precision, m.recall, m.f1Score, 100 - m.inferenceLatencyMs * 4],
    theta: ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'Latency Efficiency'],
    fill: 'toself',
    name: m.name,
    marker: { color: m.color }
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary">Machine Learning Model Evaluation</h2>
            <PreviewBadge />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Benchmarking TF-IDF + Linear SVM, Random Forest, and PySpark MLlib distributed classifiers.
          </p>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MODEL_BENCHMARKS.map((model) => (
          <div
            key={model.id}
            className={`relative rounded-card bg-card border p-5 shadow-soft transition-all duration-300 ${
              model.isBest ? 'border-positive/50 shadow-glow-positive' : 'border-border hover:border-purple/40'
            }`}
          >
            {model.isBest && (
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-positive/10 text-positive border border-positive/30 flex items-center gap-1">
                <Award className="w-3 h-3" /> Top Accuracy
              </div>
            )}

            <div className="text-base font-bold text-text-primary mb-1">{model.name}</div>
            <div className="text-[11px] text-text-muted min-h-[34px] leading-relaxed mb-4">
              {model.pipeline}
            </div>

            <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50 text-xs mb-3">
              <div>
                <span className="text-[10px] text-text-muted block">Accuracy</span>
                <span className="text-lg font-bold text-cyan">{model.accuracy}%</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">F1-Score</span>
                <span className="text-lg font-bold text-purple-light">{model.f1Score}%</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">Training Time</span>
                <span className="font-mono text-text-primary">{model.trainingTime}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">Inference Latency</span>
                <span className="font-mono text-positive">{model.inferenceLatencyMs} ms</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="px-2 py-0.5 rounded bg-background border border-border text-text-secondary">
                {model.status}
              </span>
              <span className="text-text-muted font-mono">8,548 test reviews</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grouped Bar Comparison */}
        <div className="lg:col-span-2 bg-card border border-border rounded-card p-5 shadow-soft">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-text-primary">Comparative Metric Benchmark (%)</h3>
            <p className="text-[11px] text-text-muted">Direct comparison across Accuracy, Precision, Recall, and F1-Score</p>
          </div>
          <div className="h-[340px]">
            <PlotlyChart
              data={groupedMetricsData}
              layout={{
                barmode: 'group',
                yaxis: { range: [92, 98], title: { text: 'Score (%)' } },
                legend: { orientation: 'h', y: -0.2 }
              }}
            />
          </div>
        </div>

        {/* Radar Capability Chart */}
        <div className="bg-card border border-border rounded-card p-5 shadow-soft">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-text-primary">Competency Radar</h3>
            <p className="text-[11px] text-text-muted">Trade-off between accuracy and latency efficiency</p>
          </div>
          <div className="h-[340px]">
            <PlotlyChart
              data={radarData}
              layout={{
                polar: {
                  radialaxis: { visible: true, range: [80, 100], gridcolor: '#263149', tickfont: { size: 9 } },
                  angularaxis: { gridcolor: '#263149' }
                },
                legend: { orientation: 'h', y: -0.2, font: { size: 10 } },
                margin: { l: 20, r: 20, t: 20, b: 30 }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
