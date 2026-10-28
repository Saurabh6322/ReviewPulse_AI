import React, { useState } from 'react';
import PreviewBadge from '../../components/Common/PreviewBadge';
import { Zap, Sparkles, Send, RotateCcw, Cpu, Clock, CheckCircle2 } from 'lucide-react';

const SAMPLE_PROMPTS = [
  "The build quality and acoustic clarity on these headphones are phenomenal! Highly recommended.",
  "Terrible customer service. Item was defective on arrival and refund was denied. Never again.",
  "Shipping was reasonably fast, product performs adequately as described, though instructions are brief."
];

export default function LivePredictionPage() {
  const [reviewText, setReviewText] = useState(SAMPLE_PROMPTS[0]);
  const [selectedModel, setSelectedModel] = useState('linear_svm');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState({
    sentiment: 'Positive',
    confidence: 0.984,
    latencyMs: 4.2,
    modelName: 'Linear SVM',
    tokens: [
      { text: 'build', weight: 0.12, type: 'neutral' },
      { text: 'quality', weight: 0.42, type: 'positive' },
      { text: 'acoustic', weight: 0.15, type: 'positive' },
      { text: 'clarity', weight: 0.28, type: 'positive' },
      { text: 'phenomenal', weight: 0.65, type: 'positive' },
      { text: 'recommended', weight: 0.52, type: 'positive' }
    ]
  });

  const handleAnalyze = () => {
    if (!reviewText.trim()) return;
    setIsAnalyzing(true);

    // Simulate model inference with realistic latency
    setTimeout(() => {
      const lower = reviewText.toLowerCase();
      let sentiment = 'Neutral';
      let confidence = 0.84;
      let latency = selectedModel === 'linear_svm' ? 4.2 : (selectedModel === 'random_forest' ? 12.8 : 6.5);

      if (lower.includes('great') || lower.includes('phenomenal') || lower.includes('superb') || lower.includes('recommended') || lower.includes('love') || lower.includes('excellent')) {
        sentiment = 'Positive';
        confidence = 0.97 + Math.random() * 0.02;
      } else if (lower.includes('terrible') || lower.includes('defective') || lower.includes('never') || lower.includes('refund') || lower.includes('broken') || lower.includes('worst')) {
        sentiment = 'Negative';
        confidence = 0.96 + Math.random() * 0.03;
      }

      setPredictionResult({
        sentiment,
        confidence,
        latencyMs: latency,
        modelName: selectedModel === 'linear_svm' ? 'Linear SVM' : (selectedModel === 'random_forest' ? 'Random Forest' : 'PySpark MLlib'),
        tokens: reviewText.split(' ').slice(0, 8).map(w => ({
          text: w.replace(/[^a-zA-Z]/g, ''),
          weight: Math.random() * 0.5,
          type: sentiment === 'Positive' ? 'positive' : (sentiment === 'Negative' ? 'negative' : 'neutral')
        }))
      });
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary">Live Sentiment Inference Lab</h2>
            <PreviewBadge label="Simulated ML Predictor" />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Evaluate raw customer review text in real-time. Features token saliency and multi-model confidence scores.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Console */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-card border border-border rounded-card p-5 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Input Customer Review
              </label>

              {/* Model Choice */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-text-muted text-[11px]">Model:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-background border border-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:border-cyan"
                >
                  <option value="linear_svm">Linear SVM (4.2ms)</option>
                  <option value="random_forest">Random Forest (12.8ms)</option>
                  <option value="pyspark">PySpark MLlib (6.5ms)</option>
                </select>
              </div>
            </div>

            <textarea
              rows={5}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Type or paste a customer review..."
              className="w-full bg-background border border-border rounded-card-sm p-3.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan leading-relaxed resize-none"
            />

            {/* Quick Samples */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] text-text-muted uppercase font-bold mr-1">Sample Prompts:</span>
              {SAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setReviewText(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded bg-background hover:bg-card-hover border border-border text-text-secondary truncate max-w-[200px]"
                >
                  Sample #{idx + 1}
                </button>
              ))}
            </div>

            {/* Submit Action */}
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="text-[11px] text-text-muted">
                {reviewText.length} characters • ~{reviewText.split(/\s+/).filter(Boolean).length} tokens
              </span>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !reviewText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-card-sm bg-gradient-to-r from-purple to-cyan text-background hover:opacity-95 disabled:opacity-50 transition-opacity shadow-glow-purple"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-background/20 border-t-background animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Classify Sentiment</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-card bg-card border border-border/70 text-xs text-text-muted flex items-start gap-3">
            <Cpu className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-text-primary block mb-0.5">Flask REST API Integration Ready</span>
              <span>
                This laboratory UI is prepared for full integration with the Flask backend endpoint: <code className="bg-background px-1.5 py-0.5 rounded text-cyan font-mono">POST /api/v1/predict</code>.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Prediction Output Card */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-border rounded-card p-5 shadow-soft h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-xs font-bold text-text-primary">Inference Result</span>
                <span className="text-[11px] font-mono text-cyan flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {predictionResult.latencyMs} ms
                </span>
              </div>

              {/* Sentiment Card */}
              <div className="my-5 p-5 rounded-card bg-background/60 border border-border text-center">
                <span className="text-xs uppercase font-bold text-text-muted block mb-1">
                  Predicted Sentiment
                </span>
                <div
                  className={`text-3xl font-extrabold tracking-tight ${
                    predictionResult.sentiment === 'Positive'
                      ? 'text-positive text-glow'
                      : predictionResult.sentiment === 'Negative'
                      ? 'text-negative text-glow'
                      : 'text-neutral text-glow'
                  }`}
                >
                  {predictionResult.sentiment}
                </div>

                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs">
                  <span className="text-text-muted">Confidence:</span>
                  <span className="font-bold text-cyan font-mono">
                    {(predictionResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Salient Tokens */}
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted block mb-2">
                  Top Salient Tokens (TF-IDF Weighting)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {predictionResult.tokens.map((tok, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-xs font-mono font-medium border ${
                        tok.type === 'positive'
                          ? 'bg-positive/10 text-positive border-positive/30'
                          : tok.type === 'negative'
                          ? 'bg-negative/10 text-negative border-negative/30'
                          : 'bg-neutral/10 text-neutral border-neutral/30'
                      }`}
                    >
                      {tok.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-border/50 text-[11px] text-text-muted">
              Model engine: <span className="font-semibold text-text-primary">{predictionResult.modelName}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
