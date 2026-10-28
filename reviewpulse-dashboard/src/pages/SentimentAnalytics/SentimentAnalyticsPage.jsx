import React from 'react';
import PlotlyChart from '../../components/Charts/PlotlyChart';
import MetricCard from '../../components/Common/MetricCard';
import PreviewBadge from '../../components/Common/PreviewBadge';
import { DATASET_META } from '../../data/mockData';
import { PieChart, TrendingUp, BarChart3, Globe } from 'lucide-react';

export default function SentimentAnalyticsPage() {
  // Chart 1: Rating to Sentiment Mapping Bar Chart
  const ratingSentimentData = [
    {
      x: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
      y: [13122, 1226, 0, 0, 0],
      name: 'Negative',
      type: 'bar',
      marker: { color: '#FB7185' }
    },
    {
      x: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
      y: [0, 0, 10468, 0, 0],
      name: 'Neutral',
      type: 'bar',
      marker: { color: '#FBBF24' }
    },
    {
      x: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
      y: [0, 0, 0, 3911, 14012],
      name: 'Positive',
      type: 'bar',
      marker: { color: '#34D399' }
    }
  ];

  // Chart 2: Review Length (characters) Box Plot by Sentiment
  const reviewLengthData = [
    {
      y: [120, 150, 180, 220, 310, 480, 620, 750, 920, 1100],
      name: 'Negative',
      type: 'box',
      marker: { color: '#FB7185' },
      boxpoints: 'outliers'
    },
    {
      y: [80, 110, 130, 160, 210, 290, 380, 450, 560],
      name: 'Neutral',
      type: 'box',
      marker: { color: '#FBBF24' },
      boxpoints: 'outliers'
    },
    {
      y: [40, 65, 90, 120, 160, 210, 280, 340, 420],
      name: 'Positive',
      type: 'box',
      marker: { color: '#34D399' },
      boxpoints: 'outliers'
    }
  ];

  // Chart 3: Geographic Review Share (Top Countries)
  const countryData = [
    {
      x: ['US', 'GB', 'DE', 'FR', 'CA', 'IT', 'ES', 'JP', 'AU', 'IN'],
      y: [18450, 8920, 4610, 3210, 2840, 1920, 1450, 980, 740, 620],
      type: 'bar',
      marker: {
        color: '#8B5CF6'
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary">Customer Sentiment Analytics</h2>
            <PreviewBadge />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Statistical breakdown of 42,740 customer reviews across star ratings and geographic regions.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Positive Reviews"
          value="17,923"
          delta="41.9% Share"
          deltaType="positive"
          subtitle="4 & 5 Star Ratings"
          accentColor="positive"
        />
        <MetricCard
          title="Neutral Reviews"
          value="10,468"
          delta="24.5% Share"
          deltaType="neutral"
          subtitle="3 Star Ratings"
          accentColor="neutral"
        />
        <MetricCard
          title="Negative Reviews"
          value="14,349"
          delta="33.6% Share"
          deltaType="negative"
          subtitle="1 & 2 Star Ratings"
          accentColor="negative"
        />
        <MetricCard
          title="Mean Review Length"
          value="248 chars"
          delta="Negatives avg 380c"
          deltaType="neutral"
          subtitle="High complaint verbosity"
          accentColor="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating vs Sentiment Cross-Tab */}
        <div className="bg-card border border-border rounded-card p-5 shadow-soft">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-text-primary">Star Rating vs Sentiment Class Distribution</h3>
            <p className="text-[11px] text-text-muted">Exact classification mapping: 1-2★ Negative, 3★ Neutral, 4-5★ Positive</p>
          </div>
          <div className="h-[320px]">
            <PlotlyChart
              data={ratingSentimentData}
              layout={{
                barmode: 'stack',
                xaxis: { title: { text: 'Customer Rating' } },
                yaxis: { title: { text: 'Review Count' } },
                legend: { orientation: 'h', y: -0.2 }
              }}
            />
          </div>
        </div>

        {/* Review Length by Sentiment */}
        <div className="bg-card border border-border rounded-card p-5 shadow-soft">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-text-primary">Review Length by Sentiment Class (Characters)</h3>
            <p className="text-[11px] text-text-muted">Box plot showing median and spread. Negative reviews are ~2.2x longer.</p>
          </div>
          <div className="h-[320px]">
            <PlotlyChart
              data={reviewLengthData}
              layout={{
                yaxis: { title: { text: 'Character Length' } },
                xaxis: { title: { text: 'Sentiment Class' } },
                showlegend: false
              }}
            />
          </div>
        </div>
      </div>

      {/* Geographic Breakdown */}
      <div className="bg-card border border-border rounded-card p-5 shadow-soft">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-text-primary">Top 10 Geographic Markets Review Volume</h3>
          <p className="text-[11px] text-text-muted">Geographic density of consumer feedback records ingested by PySpark</p>
        </div>
        <div className="h-[300px]">
          <PlotlyChart
            data={countryData}
            layout={{
              xaxis: { title: { text: 'Market Country Code' } },
              yaxis: { title: { text: 'Total Customer Reviews' } },
              margin: { l: 50, r: 20, t: 20, b: 40 }
            }}
          />
        </div>
      </div>
    </div>
  );
}
