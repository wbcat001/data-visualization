import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  id: string;
  name: string;
  value: number;
  color?: string;
}

interface InteractiveAddViewProps {
  width?: number;
  height?: number;
  data?: DataPoint[];
}

const InteractiveAddView: React.FC<InteractiveAddViewProps> = ({
  width = 800,
  height = 600,
  data = [
    { id: '1', name: 'Group A', value: 30 },
    { id: '2', name: 'Group B', value: 45 },
    { id: '3', name: 'Group C', value: 60 },
  ]
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [views, setViews] = useState<{ id: string; x: number; y: number }[]>([
    { id: 'view-1', x: 50, y: 50 }
  ]);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const colors = d3.scaleOrdinal(d3.schemeCategory10);
  const viewPositionRef = useRef<{ [key: string]: { x: number, y: number } }>({});

  // 初期化時にviewPositionRefを設定
  useEffect(() => {
    views.forEach(view => {
      viewPositionRef.current[view.id] = { x: view.x, y: view.y };
    });
  }, []);

  // Initialize the visualization
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    
    // Clear previous content
    svg.selectAll('*').remove();
    
    // Add button to create a new view
    const addButtonGroup = svg.append('g')
      .attr('class', 'add-button')
      .attr('transform', `translate(${width - 80}, 30)`)
      .style('cursor', 'pointer')
      .on('click', () => {
        const newId = `view-${views.length + 1}`;
        const newX = Math.random() * (width - 200) + 50;
        const newY = Math.random() * (height - 200) + 50;
        
        viewPositionRef.current[newId] = { x: newX, y: newY };
        setViews([...views, { id: newId, x: newX, y: newY }]);
      });
      
    addButtonGroup.append('circle')
      .attr('r', 20)
      .attr('fill', '#4CAF50');
      
    addButtonGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'white')
      .attr('font-size', '24px')
      .text('+');
    
    // Create views
    views.forEach((view, index) => {
      // 現在の位置を取得（存在しない場合はviewの値を使用）
      const currentPos = viewPositionRef.current[view.id] || { x: view.x, y: view.y };
      
      const viewGroup = svg.append('g')
        .attr('class', `view ${view.id === selectedView ? 'selected' : ''}`)
        .attr('id', view.id)
        .attr('transform', `translate(${currentPos.x}, ${currentPos.y})`)
        .style('cursor', 'move')
        .call(d3.drag<SVGGElement, unknown>()
          .on('start', function() {
            d3.select(this).raise();
            setSelectedView(view.id);
          })
          .on('drag', function(event) {
            // refから現在位置を取得して更新
            const currentPos = viewPositionRef.current[view.id] || { x: view.x, y: view.y };
            const newX = currentPos.x + event.dx;
            const newY = currentPos.y + event.dy;
            
            // DOM要素の位置を直接更新
            d3.select(this).attr('transform', `translate(${newX}, ${newY})`);
            
            // refの位置を更新
            viewPositionRef.current[view.id] = { x: newX, y: newY };
          })
          .on('end', function() {
            // ドラッグ終了時にのみstateを更新
            const finalPos = viewPositionRef.current[view.id];
            if (finalPos) {
              setViews(views.map(v => 
                v.id === view.id ? { ...v, x: finalPos.x, y: finalPos.y } : v
              ));
            }
          })
        );
      
      // View background
      viewGroup.append('rect')
        .attr('width', 180)
        .attr('height', 180)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', '#f8f9fa')
        .attr('stroke', view.id === selectedView ? '#007bff' : '#dee2e6')
        .attr('stroke-width', view.id === selectedView ? 3 : 1);

      // View title
      viewGroup.append('text')
        .attr('x', 90)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .text(`View ${index + 1}`);

      // Close button
      const closeButton = viewGroup.append('g')
        .attr('class', 'close-button')
        .attr('transform', `translate(160, 20)`)
        .style('cursor', 'pointer')
        .on('click', (event) => {
          event.stopPropagation();
          setViews(views.filter(v => v.id !== view.id));
          if (selectedView === view.id) {
            setSelectedView(null);
          }
        });
        
      closeButton.append('circle')
        .attr('r', 10)
        .attr('fill', '#ff6b6b');
        
      closeButton.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .text('×');

      // Simple bar chart in each view
      const barHeight = 25;
      const barWidth = 140;
      
      // Use data related to this view (for demo we'll use all data with different offsets)
      const viewData = data.map((d, i) => ({
        ...d,
        value: d.value * (1 + (index % 3) * 0.25) // Different values for each view
      }));
      
      const maxValue = d3.max(viewData, d => d.value) || 0;
      const barScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, barWidth]);
      
      const barsGroup = viewGroup.append('g')
        .attr('transform', 'translate(20, 40)');
        
      barsGroup.selectAll('.bar')
        .data(viewData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', (d, i) => i * (barHeight + 5))
        .attr('width', d => barScale(d.value))
        .attr('height', barHeight)
        .attr('fill', (d, i) => colors(i.toString()))
        .attr('rx', 3)
        .attr('ry', 3);
        
      barsGroup.selectAll('.bar-label')
        .data(viewData)
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', d => barScale(d.value) + 5)
        .attr('y', (d, i) => i * (barHeight + 5) + barHeight / 2)
        .attr('dy', '0.35em')
        .attr('font-size', '11px')
        .text(d => d.value.toFixed(1));
        
      barsGroup.selectAll('.name-label')
        .data(viewData)
        .enter()
        .append('text')
        .attr('class', 'name-label')
        .attr('x', 2)
        .attr('y', (d, i) => i * (barHeight + 5) + barHeight / 2)
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-size', '11px')
        .text(d => d.name);
    });
    
    // Instructions text
    svg.append('text')
      .attr('x', 20)
      .attr('y', 30)
      .attr('font-size', '14px')
      .text('クリックして新しいビューを追加。ドラッグして移動。右上のボタンで削除。');

  }, [views, selectedView, width, height, data]);

  return (
    <div className="interactive-add-view-container">
      <h2>Interactive View Management</h2>
      <p>This example demonstrates dynamic view creation and management with D3 and React.</p>
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};

export default InteractiveAddView;