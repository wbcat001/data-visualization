import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const generateRandomCoordinates = (length: number) => {
  return Array.from({ length }, () => ({
    x: Math.random() * 200 + 50, // Random x between 50 and 250
    y: Math.random() * 300 + 50, // Random y between 50 and 350
  }));
};

const LinkedVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const leftCoordinates = generateRandomCoordinates(100);
    const rightCoordinates = generateRandomCoordinates(100);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    // Left view
    svg
      .selectAll('.left-circle')
      .data(leftCoordinates)
      .enter()
      .append('circle')
      .attr('class', 'left-circle')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 5)
      .attr('fill', 'blue');

    // Right view
    svg
      .selectAll('.right-circle')
      .data(rightCoordinates)
      .enter()
      .append('circle')
      .attr('class', 'right-circle')
      .attr('cx', (d) => d.x + 400) // Shift right view by 400px
      .attr('cy', (d) => d.y)
      .attr('r', 5)
      .attr('fill', 'red');

    // Links in the middle
    svg
      .selectAll('.link-line')
      .data(leftCoordinates)
      .enter()
      .append('line')
      .attr('class', 'link-line')
      .attr('x1', (d) => d.x)
      .attr('y1', (d) => d.y)
      .attr('x2', (d, i) => rightCoordinates[i].x + 400)
      .attr('y2', (d, i) => rightCoordinates[i].y)
      .attr('stroke', 'gray');
  }, []);

  return <svg ref={svgRef} width="800" height="400" style={{ border: '1px solid black' }}></svg>;
};

export default LinkedVisualization;