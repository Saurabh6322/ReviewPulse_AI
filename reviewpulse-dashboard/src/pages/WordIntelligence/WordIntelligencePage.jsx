import React, { useState } from 'react';
import PlotlyChart from '../../components/Charts/PlotlyChart';
import PreviewBadge from '../../components/Common/PreviewBadge';
import { TOP_WORDS_DATA } from '../../data/mockData';
import { Sparkles, MessageSquare, Tag, SlidersHorizontal } from 'lucide-react';

export default function WordIntelligencePage() {
  const [activeTab, setActiveTab] = useState('comparative'); // 'comparative', 'positive', 'negative'

  // Combine top positive and negative for comparative bubble scatter
  const bubbleWords = [
    ...TOP_WORDS_DATA.positive.map(w => ({ ...w, sentiment: 'Positive', posCount: w.count, negCount: Math.round(w.count * 0.1) })),
    ...TOP_WORDS_DATA.negative.map(w => ({ ...w, sentiment: 'Negative', posCount: Math.round(w.count * 0.08), negCount: w.count }))
  ];

  // Comparative Scatter Plot
  const comparativeBubbleData = [
    {
      x: bubbleWords.filter(w => w.sentiment === 'Positive').map(w => w.posCount),
      y: bubbleWords.filter(w => w.sentiment === 'Positive').map(w => w.negCount),
      text: bubbleWords.filter(w => w.sentiment === 'Positive').map(w => w.word),
      mode: 'markers+text',
      name: 'Positive Keywords',
      textposition: 'top center',
      marker: {
        size: bubbleWords.filter(w => w.sentiment === 'Positive').map(w => Math.sqrt(w.count) * 0.8 + 12),
        color: '#34D399',
        opacity: 0.85,
        line: { color: '#059669', width: 1.5 }
      }
    },
    {
      x: bubbleWords.filter(w => w.sentiment === 'Negative').map(w => w.posCount),
      y: bubbleWords.filter(w => w.sentiment === 'Negative').map(w => w.negCount),
      text: bubbleWords.filter(w => w.sentiment === 'Negative').map(w => w.word),
      mode: 'markers+text',
      name: 'Negative Keywords',
      textposition: 'top center',
      marker: {
        size: bubbleWords.filter(w => w.sentiment === 'Negative').map(w => Math.sqrt(w.count) * 0.5 + 12),
        color: '#FB7185',
        opacity: 0.85,
        line: { color: '#E11D48', width: 1.5 }
      }
    }
  ];

  // Positive Clustered Bar
  const posBarData = [
    {
      y: TOP_WORDS_DATA.positive.map(w => w.word).reverse(),
      x: TOP_WORDS_DATA.positive.map(w => w.count).reverse(),
      type: 'bar',
      orientation: 'h',
      marker: { color: '#34D399' }
    }
  ];

  // Negative Clustered Bar
  const negBarData = [
    {
      y: TOP_WORDS_DATA.negative.map(w => w.word).reverse(),
      x: TOP_WORDS_DATA.negative.map(w => w.count).reverse(),
      type: 'bar',
      orientation: 'h',
      marker: { color: '#FB7185' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary">Word Intelligence & Linguistic Bubbling</h2>
            <PreviewBadge />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            TF-IDF vocabulary weights, keyword polarity clustering, and bubbling representation of consumer sentiment drivers.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-card-sm bg-card border border-border self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('comparative')}
            className={`px-3 py-1.5 rounded-card-sm font-semibold transition-all ${
              activeTab === 'comparative' ? 'bg-purple text-white shadow-glow-purple' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Polarity Bubble Chart
          </button>
          <button
            onClick={() => setActiveTab('lists')}
            className={`px-3 py-1.5 rounded-card-sm font-semibold transition-all ${
              activeTab === 'lists' ? 'bg-purple text-white shadow-glow-purple' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            Frequency Breakdown
          </button>
        </div>
      </div>

      {activeTab === 'comparative' ? (
        /* Bubble Chart Section */
        <div className="bg-card border border-border rounded-card p-5 shadow-soft">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-text-primary">
              Sentiment Polarity Word Bubble Map
            </h3>
            <p className="text-[11px] text-text-muted">
              X = Positive Review Frequency • Y = Negative Review Frequency • Bubble Diameter = Total Corpus Salience
            </p>
          </div>

          <div className="h-[460px]">
            <PlotlyChart
              data={comparativeBubbleData}
              layout={{
                xaxis: { title: { text: 'Occurrences in Positive Reviews' } },
                yaxis: { title: { text: 'Occurrences in Negative Reviews' } },
                legend: { orientation: 'h', y: -0.15 }
              }}
            />
          </div>

          <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between text-xs text-text-muted gap-2">
            <span className="text-positive">🟢 Positive anchors: "quality", "experience", "great", "excellent"</span>
            <span className="text-negative">🔴 Negative anchors: "not", "refund", "broken", "delayed", "worst"</span>
          </div>
        </div>
      ) : (
        /* Top Frequency Side-by-Side Horizontal Bars */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Positive Bar */}
          <div className="bg-card border border-border rounded-card p-5 shadow-soft">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-positive flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Top Positive Vocabulary (TF-IDF)
              </h3>
              <p className="text-[11px] text-text-muted">Highest weighted terms in 4-star and 5-star customer feedback</p>
            </div>
            <div className="h-[360px]">
              <PlotlyChart
                data={posBarData}
                layout={{
                  xaxis: { title: { text: 'Review Occurrences' } },
                  margin: { l: 90, r: 20, t: 20, b: 40 }
                }}
              />
            </div>
          </div>

          {/* Negative Bar */}
          <div className="bg-card border border-border rounded-card p-5 shadow-soft">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-negative flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Top Negative Vocabulary (TF-IDF)
              </h3>
              <p className="text-[11px] text-text-muted">High-frequency dissatisfaction keywords in 1-star and 2-star reviews</p>
            </div>
            <div className="h-[360px]">
              <PlotlyChart
                data={negBarData}
                layout={{
                  xaxis: { title: { text: 'Review Occurrences' } },
                  margin: { l: 90, r: 20, t: 20, b: 40 }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Vocabulary Keyword Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {TOP_WORDS_DATA.positive.slice(0, 3).concat(TOP_WORDS_DATA.negative.slice(0, 3)).map((item) => (
          <div key={item.word} className="p-3 rounded bg-card border border-border shadow-soft text-center">
            <span className="font-mono text-sm font-bold text-text-primary block">
              "{item.word}"
            </span>
            <span className="text-[11px] text-text-muted block mt-0.5">
              {item.count.toLocaleString()} occurrences
            </span>
            <span
              className={`inline-block mt-1.5 text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                item.polarity > 0
                  ? 'bg-positive/10 text-positive border-positive/30'
                  : 'bg-negative/10 text-negative border-negative/30'
              }`}
            >
              Polarity {item.polarity > 0 ? `+${item.polarity}` : item.polarity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
