import React, { useState } from 'react';
import MetricCard from '../../components/Common/MetricCard';
import PreviewBadge from '../../components/Common/PreviewBadge';
import { DATASET_META } from '../../data/mockData';
import { Layers, Database, CheckCircle2, RefreshCw, Download, FileSpreadsheet } from 'lucide-react';

const DATASET_FILES = [
  {
    name: "cleaned_reviews.csv",
    type: "Cleaned CSV",
    rows: 42740,
    size: "17.0 MB",
    status: "Active In-Memory",
    columns: ["Reviewer Name", "Country", "Review Date", "Rating", "Review Text", "Sentiment"]
  },
  {
    name: "processed_reviews.csv",
    type: "NLP Tokenized CSV",
    rows: 42739,
    size: "24.1 MB",
    status: "Feature Cached",
    columns: ["Rating", "Sentiment", "Clean_Review", "Sentiment_Label", "char_length", "word_count"]
  },
  {
    name: "Amazon_Reviews.csv",
    type: "Raw Scraped Corpus",
    rows: 42753,
    size: "16.7 MB",
    status: "Archived Raw",
    columns: ["Reviewer Name", "Profile Link", "Country", "Review Count", "Review Date", "Rating", "Review Title", "Review Text"]
  }
];

export default function DatasetManagerPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  const handleSync = () => {
    setIsSyncing(true);
    setSyncMessage(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('PySpark DataFrame partitions successfully synchronized and cached in memory.');
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary">Dataset & Partition Manager</h2>
            <PreviewBadge />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Data hygiene, partition shards, schema definitions, and PySpark synchronization.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-card-sm bg-purple hover:bg-purple-dark text-white disabled:opacity-50 transition-colors shadow-glow-purple self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Cluster...' : 'Sync DataFrame Partitions'}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="p-3.5 rounded-card bg-positive/10 border border-positive/30 text-xs text-positive flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Dataset Files Table */}
      <div className="bg-card border border-border rounded-card p-5 shadow-soft">
        <h3 className="text-sm font-bold text-text-primary mb-3">Managed Data Sources & Shards</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-text-muted uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">File Name</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Total Records</th>
                <th className="pb-3 font-semibold">Disk Size</th>
                <th className="pb-3 font-semibold">Cluster Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {DATASET_FILES.map((file) => (
                <tr key={file.name} className="hover:bg-card-hover/60 transition-colors">
                  <td className="py-3 font-mono text-cyan text-[11px] font-bold flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-purple" />
                    {file.name}
                  </td>
                  <td className="py-3 text-text-secondary">{file.type}</td>
                  <td className="py-3 font-mono font-semibold text-text-primary">
                    {file.rows.toLocaleString()}
                  </td>
                  <td className="py-3 font-mono text-text-muted">{file.size}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-background border border-border text-text-secondary">
                      {file.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Hygiene & Schema Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-card bg-card border border-border shadow-soft">
          <h4 className="text-xs uppercase font-bold text-text-muted mb-2">Cleaning & Hygiene Rules</h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-positive font-bold">✓</span>
              <span>13 incomplete raw records removed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-positive font-bold">✓</span>
              <span>Contractions expanded with negation preservation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-positive font-bold">✓</span>
              <span>WordNet lemmatization applied to all review tokens</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-positive font-bold">✓</span>
              <span>Punctuation and non-alphabetic symbols filtered</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-card bg-card border border-border shadow-soft">
          <h4 className="text-xs uppercase font-bold text-text-muted mb-2">Label Mapping Logic</h4>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-background/60 border border-border flex justify-between">
              <span className="text-negative font-bold">Negative (Class 0)</span>
              <span className="font-mono text-text-muted">1 & 2 Star Ratings</span>
            </div>
            <div className="p-2 rounded bg-background/60 border border-border flex justify-between">
              <span className="text-neutral font-bold">Neutral (Class 1)</span>
              <span className="font-mono text-text-muted">3 Star Ratings</span>
            </div>
            <div className="p-2 rounded bg-background/60 border border-border flex justify-between">
              <span className="text-positive font-bold">Positive (Class 2)</span>
              <span className="font-mono text-text-muted">4 & 5 Star Ratings</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-card bg-card border border-border shadow-soft">
          <h4 className="text-xs uppercase font-bold text-text-muted mb-2">PySpark Partitions</h4>
          <div className="space-y-2 text-xs text-text-secondary">
            <div className="flex justify-between border-b border-border/40 pb-1.5">
              <span>Partition Count:</span>
              <span className="font-mono font-bold text-cyan">16 Shards</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1.5">
              <span>Target RDD Batch Size:</span>
              <span className="font-mono font-bold text-purple-light">2,671 rows/shard</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Compression:</span>
              <span className="font-mono font-bold text-positive">Snappy Parquet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
