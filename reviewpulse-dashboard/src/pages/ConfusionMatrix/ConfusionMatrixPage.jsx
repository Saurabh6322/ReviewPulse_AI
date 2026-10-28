import React, { useState } from 'react';
import PlotlyChart from '../../components/Charts/PlotlyChart';
import MetricCard from '../../components/Common/MetricCard';
import PreviewBadge from '../../components/Common/PreviewBadge';
import { CONFUSION_MATRICES } from '../../data/mockData';
import { Grid, HelpCircle, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function ConfusionMatrixPage() {
  const [selectedModel, setSelectedModel] = useState('linear_svm');
  const activeCM = CONFUSION_MATRICES[selectedModel] || CONFUSION_MATRICES.linear_svm;

  const matrix = activeCM.matrix;
  const labels = activeCM.labels;

  // Compute cell annotations
  const annotations = [];
  for (let i = 0; i < labels.length; i++) {
    for (let j = 0; j < labels.length; j++) {
      const val = matrix[i][j];
      const isDiagonal = i === j;
      annotations.push({
        x: labels[j],
        y: labels[i],
        text: `<b>${val.toLocaleString()}</b><br>${isDiagonal ? '✓ Correct' : 'Misclass.'}`,
        showarrow: false,
        font: {
          color: isDiagonal ? '#F8FAFC' : '#FB7185',
          size: 13
        }
      });
    }
  }

  const heatmapData = [
    {
      z: matrix,
      x: labels,
      y: labels,
      type: 'heatmap',
      colorscale: [
        [0, '#0B1020'],
        [0.2, '#1B243B'],
        [0.5, '#7C3AED'],
        [1.0, '#22D3EE']
      ],
      showscale: true,
      colorbar: { title: 'Sample Count' }
    }
  ];

  // Calculate per-class breakdown
  const classBreakdown = labels.map((label, idx) => {
    const tp = matrix[idx][idx];
    const totalActual = matrix[idx].reduce((a, b) => a + b, 0);
    const totalPredicted = matrix.reduce((sum, row) => sum + row[idx], 0);
    const fp = totalPredicted - tp;
    const fn = totalActual - tp;
    const precision = ((tp / (tp + fp)) * 100).toFixed(1);
    const recall = ((tp / (tp + fn)) * 100).toFixed(1);
    const f1 = ((2 * tp / (2 * tp + fp + fn)) * 100).toFixed(1);

    return { label, tp, fp, fn, totalActual, precision, recall, f1 };
  });

  return (
    <div className="space-y-6">
      {/* Header with Model Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary">Confusion Matrix Intelligence</h2>
            <PreviewBadge />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Error analysis on 8,548 holdout test reviews. Evaluate true vs predicted class distributions.
          </p>
        </div>

        {/* Model Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-card-sm bg-card border border-border self-start sm:self-auto">
          {Object.entries(CONFUSION_MATRICES).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedModel(key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-card-sm transition-all ${
                selectedModel === key
                  ? 'bg-purple text-white shadow-glow-purple'
                  : 'text-text-muted hover:text-text-primary hover:bg-card-hover'
              }`}
            >
              {data.modelName}
            </button>
          ))}
        </div>
      </div>

      {/* Main Confusion Matrix + Class Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Matrix */}
        <div className="lg:col-span-7 bg-card border border-border rounded-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-text-primary">
                {activeCM.modelName} Confusion Heatmap
              </h3>
              <p className="text-[11px] text-text-muted">Rows: Actual True Label • Columns: Predicted Label</p>
            </div>
          </div>

          <div className="h-[380px]">
            <PlotlyChart
              data={heatmapData}
              layout={{
                annotations: annotations,
                xaxis: { title: { text: 'Predicted Sentiment' }, side: 'bottom' },
                yaxis: { title: { text: 'True Actual Sentiment' }, autorange: 'reversed' },
                margin: { l: 70, r: 20, t: 30, b: 60 }
              }}
            />
          </div>
        </div>

        {/* Per-Class Breakdown Metrics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-card p-5 shadow-soft">
            <h3 className="text-sm font-bold text-text-primary mb-3">Class Performance Breakdown</h3>
            <div className="space-y-3">
              {classBreakdown.map((item) => (
                <div key={item.label} className="p-3 rounded bg-background/50 border border-border/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-text-primary flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.label === 'Positive'
                            ? 'bg-positive'
                            : item.label === 'Negative'
                            ? 'bg-negative'
                            : 'bg-neutral'
                        }`}
                      />
                      {item.label} Class
                    </span>
                    <span className="text-[11px] font-mono text-cyan">{item.totalActual} samples</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-border/40">
                    <div>
                      <span className="text-text-muted text-[10px] block">Precision</span>
                      <span className="font-bold text-text-primary">{item.precision}%</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-[10px] block">Recall</span>
                      <span className="font-bold text-text-primary">{item.recall}%</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-[10px] block">F1-Score</span>
                      <span className="font-bold text-purple-light">{item.f1}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Diagnostics Alert */}
          <div className="p-4 rounded-card bg-purple/10 border border-purple/30 text-xs">
            <div className="font-semibold text-purple-light flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-purple" />
              Low False Negative Cross-Talk
            </div>
            <p className="text-text-muted leading-relaxed">
              Misclassification between polar opposites (Positive predicted as Negative, or vice-versa) is extremely rare (&lt; 0.6%), with most boundary fuzziness occurring in borderline 3-star Neutral reviews.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
