import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// データの型定義
export interface DataItem {
  label: string;
  value: number;
}

// コンポーネントのpropsの型定義
export interface BarChartProps {
  data: DataItem[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  width = 600, 
  height = 400, 
  marginTop = 20, 
  marginRight = 20, 
  marginBottom = 60, 
  marginLeft = 60 
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !data.length || !svgRef.current) return;

    // Clear any existing SVG content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Define chart dimensions
    const innerWidth = width - marginLeft - marginRight;
    const innerHeight = height - marginTop - marginBottom;

    // Create scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);
    
    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    
    // Create chart area
    const chart = svg.append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);
    
    // Create bars
    chart.append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => xScale(d.label) || 0)
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.value))
      .attr("fill", "steelblue");
    
    // Create axes
    chart.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end");
    
    chart.append("g")
      .call(d3.axisLeft(yScale));
    
    // Add labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Categories");
    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("Values");
  }, [data, width, height, marginTop, marginRight, marginBottom, marginLeft]);

  return (
    <div className="bar-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;