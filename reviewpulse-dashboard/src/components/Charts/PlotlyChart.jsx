import React, { useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

/**
 * Reusable PlotlyChart component with automatic dark analytics styling.
 */
export default function PlotlyChart({
  data = [],
  layout = {},
  config = {},
  style = { width: '100%', height: '100%' },
  className = ""
}) {
  const mergedLayout = useMemo(() => {
    return {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: {
        family: 'Inter, system-ui, sans-serif',
        color: '#94A3B8',
        size: 11
      },
      margin: { l: 40, r: 20, t: 40, b: 40, ...layout.margin },
      xaxis: {
        gridcolor: '#263149',
        zerolinecolor: '#263149',
        tickfont: { color: '#94A3B8', size: 10 },
        ...layout.xaxis
      },
      yaxis: {
        gridcolor: '#263149',
        zerolinecolor: '#263149',
        tickfont: { color: '#94A3B8', size: 10 },
        ...layout.yaxis
      },
      hoverlabel: {
        bgcolor: '#141B2D',
        bordercolor: '#8B5CF6',
        font: { family: 'Inter, sans-serif', color: '#F8FAFC' }
      },
      ...layout
    };
  }, [layout]);

  const mergedConfig = useMemo(() => {
    return {
      responsive: true,
      displayModeBar: false,
      ...config
    };
  }, [config]);

  return (
    <div className={`w-full h-full min-h-[300px] ${className}`}>
      <Plot
        data={data}
        layout={mergedLayout}
        config={mergedConfig}
        style={style}
        useResizeHandler={true}
      />
    </div>
  );
}
