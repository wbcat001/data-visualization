import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// データの型定義
export interface TimeDataItem {
  date: Date;
  value: number;
}

// コンポーネントのpropsの型定義
export interface LineChartProps {
  data: TimeDataItem[];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  showPoints?: boolean;
  curve?: string;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  width = 600, 
  height = 400, 
  marginTop = 20, 
  marginRight = 20, 
  marginBottom = 60, 
  marginLeft = 60,
  showPoints = true,
  curve = 'linear'
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
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, innerWidth]);
    
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

    // Define line generator
    let curveFunction;
    switch(curve) {
      case 'curve':
        curveFunction = d3.curveCatmullRom;
        break;
      case 'step':
        curveFunction = d3.curveStep;
        break;
      default:
        curveFunction = d3.curveLinear;
    }
    
    const line = d3.line<TimeDataItem>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(curveFunction);
    
    // Draw line
    chart.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
    
    // Add data points
    if (showPoints) {
      chart.selectAll(".data-point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "data-point")
        .attr("cx", d => xScale(d.date))
        .attr("cy", d => yScale(d.value))
        .attr("r", 4)
        .attr("fill", "steelblue");
    }
    
    // Create axes
    chart.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));
    
    chart.append("g")
      .call(d3.axisLeft(yScale));
    
    // Add labels
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("Time");
    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("Values");
  }, [data, width, height, marginTop, marginRight, marginBottom, marginLeft, showPoints, curve]);

  return (
    <div className="line-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default LineChart;