import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import PreviewBadge from '../../components/Common/PreviewBadge';
import { EmptyState } from '../../components/Common/StateViews';
import { RECENT_REVIEWS_SAMPLE } from '../../data/mockData';

// Extended review dataset for exploration
const EXPLORER_REVIEWS = [
  ...RECENT_REVIEWS_SAMPLE,
  {
    id: "REV-10497",
    reviewer: "David K.",
    product: "Bluetooth In-Ear Sports Earbuds",
    rating: 4,
    sentiment: "Positive",
    confidence: 0.941,
    date: "2026-10-15",
    country: "US",
    text: "Great snug fit for outdoor running. Water resistance held up well through heavy rain. Case could be slightly smaller."
  },
  {
    id: "REV-10498",
    reviewer: "Elena Rostov",
    product: "Ergonomic Vertical Mouse",
    rating: 3,
    sentiment: "Neutral",
    confidence: 0.795,
    date: "2026-10-15",
    country: "CA",
    text: "Relieved wrist strain significantly, but the scroll wheel feels somewhat cheap and squeaks after extended sessions."
  },
  {
    id: "REV-10499",
    reviewer: "Tariq Mansoor",
    product: "Fast Qi Wireless Charging Stand",
    rating: 1,
    sentiment: "Negative",
    confidence: 0.985,
    date: "2026-10-14",
    country: "GB",
    text: "Overheats the phone rapidly and charges at a crawl. Total waste of money, stopped working on day four."
  },
  {
    id: "REV-10500",
    reviewer: "Hannah Schmidt",
    product: "Noise-Cancelling Over-Ear Headphones",
    rating: 5,
    sentiment: "Positive",
    confidence: 0.991,
    date: "2026-10-13",
    country: "DE",
    text: "Phenomenal soundstage and build quality. Battery easily exceeds 30 hours on a single charge. Superb product!"
  }
];

export default function ReviewExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [selectedReview, setSelectedReview] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredReviews = useMemo(() => {
    return EXPLORER_REVIEWS.filter((rev) => {
      const matchesSearch =
        rev.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSentiment = selectedSentiment === 'All' || rev.sentiment === selectedSentiment;
      const matchesRating = selectedRating === 'All' || rev.rating === Number(selectedRating);

      return matchesSearch && matchesSentiment && matchesRating;
    });
  }, [searchTerm, selectedSentiment, selectedRating]);

  const totalPages = Math.ceil(filteredReviews.length / pageSize) || 1;
  const paginatedReviews = filteredReviews.slice((page - 1) * pageSize, page * pageSize);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedSentiment('All');
    setSelectedRating('All');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary">Customer Review Explorer</h2>
            <PreviewBadge />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Search, filter, and inspect cleaned review tokens, confidence intervals, and star ratings.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-card bg-card border border-border shadow-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-[220px] max-w-sm flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search keyword, product, ID..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full bg-background border border-border rounded-card-sm pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-cyan"
            />
          </div>

          {/* Sentiment Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-text-muted text-[11px]">Sentiment:</span>
            {['All', 'Positive', 'Neutral', 'Negative'].map((sent) => (
              <button
                key={sent}
                onClick={() => { setSelectedSentiment(sent); setPage(1); }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedSentiment === sent
                    ? 'bg-purple text-white shadow-glow-purple'
                    : 'bg-background hover:bg-card-hover text-text-secondary border border-border'
                }`}
              >
                {sent}
              </button>
            ))}
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-text-muted text-[11px]">Rating:</span>
            <select
              value={selectedRating}
              onChange={(e) => { setSelectedRating(e.target.value); setPage(1); }}
              className="bg-background border border-border rounded px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-cyan"
            >
              <option value="All">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-border text-text-muted hover:text-text-primary hover:bg-card-hover transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Reviews Table or Empty State */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          title="No Matching Reviews"
          description="Try broadening your search term or resetting the sentiment filter."
          actionText="Reset Filters"
          onAction={handleReset}
        />
      ) : (
        <div className="bg-card border border-border rounded-card p-5 shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-muted uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Review ID</th>
                  <th className="pb-3 font-semibold">Product Title</th>
                  <th className="pb-3 font-semibold">Rating</th>
                  <th className="pb-3 font-semibold">Predicted Sentiment</th>
                  <th className="pb-3 font-semibold">Confidence</th>
                  <th className="pb-3 font-semibold">Market</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-card-hover/60 transition-colors">
                    <td className="py-3 font-mono text-cyan text-[11px]">{rev.id}</td>
                    <td className="py-3">
                      <div className="font-medium text-text-primary">{rev.product}</div>
                      <div className="text-[11px] text-text-muted truncate max-w-sm mt-0.5">{rev.text}</div>
                    </td>
                    <td className="py-3 font-bold text-text-primary">
                      {rev.rating} ★
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
                    <td className="py-3 font-mono text-[11px] text-cyan">
                      {(rev.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 font-mono text-text-muted">
                      {rev.country}
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => setSelectedReview(rev)}
                        className="p-1.5 rounded hover:bg-background text-text-muted hover:text-cyan transition-colors"
                        title="Inspect Token Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/50 text-xs text-text-muted">
            <span>
              Showing {filteredReviews.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
              {Math.min(page * pageSize, filteredReviews.length)} of {filteredReviews.length} reviews
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded border border-border disabled:opacity-40 hover:bg-card-hover"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded border border-border disabled:opacity-40 hover:bg-card-hover"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Inspection Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-card-lg p-6 max-w-lg w-full shadow-soft animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="font-mono text-xs text-cyan">{selectedReview.id}</span>
                <h3 className="text-sm font-bold text-text-primary">{selectedReview.product}</h3>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="p-1.5 rounded hover:bg-card-hover text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-text-muted">Full Review Text</span>
                <p className="mt-1 p-3 rounded bg-background/70 border border-border text-text-secondary leading-relaxed">
                  "{selectedReview.text}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded bg-background/50 border border-border">
                  <span className="text-[10px] text-text-muted block">Linear SVM Prediction</span>
                  <span className="font-bold text-sm text-text-primary">{selectedReview.sentiment}</span>
                </div>
                <div className="p-2.5 rounded bg-background/50 border border-border">
                  <span className="text-[10px] text-text-muted block">Inference Confidence</span>
                  <span className="font-bold text-sm text-cyan">{(selectedReview.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-border/50">
              <button
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 text-xs font-semibold rounded-card-sm bg-purple hover:bg-purple-dark text-white"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
