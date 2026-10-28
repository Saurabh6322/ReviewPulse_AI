import React from 'react';
import MetricCard from '../../components/Common/MetricCard';
import PreviewBadge from '../../components/Common/PreviewBadge';
import PlotlyChart from '../../components/Charts/PlotlyChart';
import { SPARK_CLUSTER_METRICS } from '../../data/mockData';
import { Database, Server, Cpu, HardDrive, CheckCircle2, Activity } from 'lucide-react';

export default function BigDataMonitorPage() {
  // Spark Memory Utilization Bar
  const memoryChartData = [
    {
      x: SPARK_CLUSTER_METRICS.workerNodes.map(w => w.id),
      y: [18.4, 21.1, 17.9, 19.5],
      name: 'Used Memory (GB)',
      type: 'bar',
      marker: { color: '#8B5CF6' }
    },
    {
      x: SPARK_CLUSTER_METRICS.workerNodes.map(w => w.id),
      y: [13.6, 10.9, 14.1, 12.5],
      name: 'Free Memory (GB)',
      type: 'bar',
      marker: { color: '#263149' }
    }
  ];

  // RDD Partition Throughput Sparkline
  const throughputData = [
    {
      x: ['10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00'],
      y: [14200, 16800, 15900, 18450, 19200, 18450, 17900, 18900, 18450],
      type: 'scatter',
      mode: 'lines+markers',
      line: { color: '#22D3EE', width: 3 },
      fill: 'tozeroy',
      fillcolor: 'rgba(34, 211, 238, 0.1)'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-text-primary">PySpark Big Data Cluster Monitor</h2>
            <PreviewBadge />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time telemetry from PySpark 3.5 distributed review partition and vectorization jobs.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-positive/10 border border-positive/30 text-positive text-xs font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-positive animate-ping" />
          <span>{SPARK_CLUSTER_METRICS.clusterState}</span>
        </div>
      </div>

      {/* Cluster Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Cluster Worker Nodes"
          value="4 Nodes"
          delta="32 Total Cores"
          deltaType="positive"
          subtitle="spark://10.0.4.12:7077"
          icon={Server}
          accentColor="cyan"
        />

        <MetricCard
          title="Partition Ingestion Speed"
          value={SPARK_CLUSTER_METRICS.throughputRecordsSec.toLocaleString()}
          delta="records/sec"
          deltaType="positive"
          subtitle="16 DataFrame Partitions"
          icon={Activity}
          accentColor="purple"
        />

        <MetricCard
          title="Cluster RAM Allocated"
          value="128 GB"
          delta="76.9 GB In-Memory"
          deltaType="neutral"
          subtitle="60% Memory Saturation"
          icon={HardDrive}
          accentColor="positive"
        />

        <MetricCard
          title="Shuffle I/O Volume"
          value={SPARK_CLUSTER_METRICS.shuffleReadBytes}
          delta="0 Failed Stages"
          deltaType="positive"
          subtitle="124 Completed DAG Stages"
          icon={Database}
          accentColor="cyan"
        />
      </div>

      {/* Worker Node Telemetry Table */}
      <div className="bg-card border border-border rounded-card p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary">PySpark Worker Executors</h3>
            <p className="text-[11px] text-text-muted">Distributed tasks executing TF-IDF vectorization and Spark MLlib classifiers</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-text-muted uppercase text-[10px] tracking-wider">
                <th className="pb-3 font-semibold">Executor ID</th>
                <th className="pb-3 font-semibold">IP Address</th>
                <th className="pb-3 font-semibold">Allocated Cores</th>
                <th className="pb-3 font-semibold">Memory Pool</th>
                <th className="pb-3 font-semibold">Memory Used</th>
                <th className="pb-3 font-semibold">Node Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {SPARK_CLUSTER_METRICS.workerNodes.map((w) => (
                <tr key={w.id} className="hover:bg-card-hover/60 transition-colors">
                  <td className="py-3 font-mono text-cyan text-[11px] font-bold">{w.id}</td>
                  <td className="py-3 font-mono text-text-secondary">{w.ip}</td>
                  <td className="py-3 font-semibold text-text-primary">{w.cores} vCPUs</td>
                  <td className="py-3 font-mono text-text-muted">{w.memory}</td>
                  <td className="py-3 font-mono text-purple-light font-bold">{w.memoryUsed}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-positive/10 text-positive border border-positive/30 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Throughput and Memory Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-card p-5 shadow-soft">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-text-primary">PySpark Streaming Ingestion Rate (Records / Sec)</h3>
            <p className="text-[11px] text-text-muted">Throughput over the last 2 hours across partitioned RDD pipelines</p>
          </div>
          <div className="h-[280px]">
            <PlotlyChart
              data={throughputData}
              layout={{
                yaxis: { title: { text: 'Records / Sec' } },
                xaxis: { title: { text: 'Time Window' } },
                margin: { l: 60, r: 20, t: 20, b: 40 }
              }}
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-card p-5 shadow-soft">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-text-primary">Worker Node RAM Allocation (GB)</h3>
            <p className="text-[11px] text-text-muted">In-memory DataFrame storage vs available free heap memory</p>
          </div>
          <div className="h-[280px]">
            <PlotlyChart
              data={memoryChartData}
              layout={{
                barmode: 'stack',
                yaxis: { title: { text: 'Memory (GB)' } },
                xaxis: { title: { text: 'Executor' } },
                legend: { orientation: 'h', y: -0.2 }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
