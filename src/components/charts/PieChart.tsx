import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// データの型定義
export interface PieDataItem {
  label: string;
  value: number;
}

// コンポーネントのpropsの型定義
export interface PieChartProps {
  data: PieDataItem[];
  width?: number;
  height?: number;
  donut?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  cornerRadius?: number;
  padAngle?: number;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = 600,
  height = 400,
  donut = false,
  innerRadius = 0,
  outerRadius = 200,
  cornerRadius = 0,
  padAngle = 0.01
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !data.length || !svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll('*').remove();

    // Calculate radiuses
    const actualInnerRadius = donut ? innerRadius : 0;
    const radius = Math.min(width, height) / 2;
    const actualOuterRadius = Math.min(outerRadius, radius);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create pie generator
    const pie = d3.pie<PieDataItem>()
      .value(d => d.value)
      .sort(null);

    // Create arc generator
    const arc = d3.arc<d3.PieArcDatum<PieDataItem>>()
      .innerRadius(actualInnerRadius)
      .outerRadius(actualOuterRadius)
      .cornerRadius(cornerRadius)
      .padAngle(padAngle);

    // Create slices
    const slices = svg.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Draw arcs
    slices.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i.toString()));

    // Add labels
    const labelArc = d3.arc<d3.PieArcDatum<PieDataItem>>()
      .innerRadius(actualOuterRadius * 0.8)
      .outerRadius(actualOuterRadius * 0.8);

    slices.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text(d => d.data.label)
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    // Add legend
    const legendG = svg.selectAll(".legend")
      .data(data)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(${actualOuterRadius + 20}, ${-actualOuterRadius + i * 20})`);

    legendG.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d, i) => color(i.toString()));

    legendG.append("text")
      .text(d => `${d.label} (${d.value})`)
      .style("font-size", 12)
      .attr("y", 10)
      .attr("x", 15);

  }, [data, width, height, donut, innerRadius, outerRadius, cornerRadius, padAngle]);

  return (
    <div className="pie-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PieChart;