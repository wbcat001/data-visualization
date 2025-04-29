import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

// データポイントの型定義
export interface DataPoint {
  id: string;
  x: number;
  y: number;
  value: number;
  category: string;
  color?: string;
  label?: string;
}

// コンポーネントのProps
export interface DragableViewProps {
  data: DataPoint[];         // グラフのデータポイント
  width?: number;           // 全体の幅
  height?: number;          // 全体の高さ
  margin?: { top: number; right: number; bottom: number; left: number };
  gridLines?: boolean;      // グリッドラインを表示するか
  initialPosition?: { x: number, y: number }; // 初期位置
  zoomable?: boolean;       // ズーム可能か
  minZoom?: number;         // 最小ズーム率
  maxZoom?: number;         // 最大ズーム率
  categoryColors?: Record<string, string>; // カテゴリごとの色
}

/**
 * ドラッグ可能なビューコンポーネント
 * - ビュー全体をドラッグして移動できる
 * - オプションでズーム機能も利用可能
 */
const DragableView: React.FC<DragableViewProps> = ({
  data,
  width = 800,
  height = 600,
  margin = { top: 40, right: 40, bottom: 60, left: 60 },
  gridLines = true,
  initialPosition = { x: 0, y: 0 },
  zoomable = true,
  minZoom = 0.5,
  maxZoom = 5,
  categoryColors = {
    'グループA': '#1f77b4', // 青
    'グループB': '#ff7f0e', // オレンジ
    'グループC': '#2ca02c', // 緑
    'グループD': '#d62728'  // 赤
  }
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const mainGroupRef = useRef<SVGGElement | null>(null);
  const [position, setPosition] = useState(initialPosition);
  const [scale, setScale] = useState(1);
  
  // 実際の描画エリアのサイズを計算
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    if (!svgRef.current) return;

    // SVG要素の参照を取得
    const svg = d3.select(svgRef.current);
    
    // 既存の要素をクリア
    svg.selectAll('*').remove();
    
    // クリップパスを定義（ビューの範囲外を表示しないため）
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'view-clip')
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    // メイングループを作成（マージンを適用）
    const mainGroup = svg.append('g')
      .attr('class', 'main-group')
      .attr('clip-path', 'url(#view-clip)')
      .attr('cursor', 'move')
      .attr('transform', `translate(${margin.left + position.x}, ${margin.top + position.y}) scale(${scale})`);
    
    // メイングループのDOM参照を保存
    mainGroupRef.current = mainGroup.node();

    // コンテンツを含むグループ
    const contentGroup = mainGroup.append('g')
      .attr('class', 'content-group');

    // X軸スケールを設定
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth]);

    // Y軸スケールを設定
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    // グラフの背景を作成
    contentGroup.append('rect')
      .attr('class', 'chart-background')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', '#f8f8f8')
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1);

    // グリッドラインを描画（オプション）
    if (gridLines) {
      // X軸のグリッドライン
      contentGroup.append('g')
        .attr('class', 'grid x-grid')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(
          d3.axisBottom(xScale)
            .tickSize(-innerHeight)
            .tickFormat(() => '')
            .ticks(10)
        )
        .attr('stroke-opacity', 0.1)
        .attr('stroke-dasharray', '3,3');

      // Y軸のグリッドライン
      contentGroup.append('g')
        .attr('class', 'grid y-grid')
        .call(
          d3.axisLeft(yScale)
            .tickSize(-innerWidth)
            .tickFormat(() => '')
            .ticks(10)
        )
        .attr('stroke-opacity', 0.1)
        .attr('stroke-dasharray', '3,3');
    }

    // X軸を描画
    contentGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'middle');

    // X軸ラベルを追加
    contentGroup.append('text')
      .attr('class', 'x-axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '14px')
      .text('X値');

    // Y軸を描画
    contentGroup.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('text-anchor', 'end');

    // Y軸ラベルを追加
    contentGroup.append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '14px')
      .text('Y値');

    // グラフタイトルを追加
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('ドラッグ可能なビュー');

    // データカテゴリをグループ化
    const categorizedData = d3.group(data, d => d.category);
    
    // カテゴリごとに凡例を追加（ドラッグ対象外）
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - margin.right - 120}, ${margin.top})`);
    
    const categories = Array.from(categorizedData.keys());
    
    categories.forEach((category, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
      
      legendItem.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', categoryColors[category] || '#999');
      
      legendItem.append('text')
        .attr('x', 15)
        .attr('y', 9)
        .attr('font-size', '12px')
        .attr('font-family', 'sans-serif')
        .text(category);
    });

    // データポイントを描画
    contentGroup.selectAll('.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('id', d => `point-${d.id}`)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', d => 5 + (d.value / 20)) // 値に基づいて円のサイズを変更
      .attr('fill', d => d.color || categoryColors[d.category] || '#999')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('opacity', 0.8);

    // データポイントにラベルを表示（オプション）
    data.forEach(d => {
      if (d.label) {
        contentGroup.append('text')
          .attr('class', `point-label point-label-${d.id}`)
          .attr('x', xScale(d.x))
          .attr('y', yScale(d.y) - 15)
          .attr('text-anchor', 'middle')
          .attr('font-family', 'sans-serif')
          .attr('font-size', '10px')
          .attr('pointer-events', 'none')
          .text(d.label);
      }
    });

    // ビュー全体をドラッグする機能を定義
    const dragView = d3.drag()
      .on('start', function(event) {
        d3.select(this).attr('cursor', 'grabbing');
      })
      .on('drag', function(event) {
        // 現在の位置から新しい位置を計算
        const newX = position.x + event.dx / scale;
        const newY = position.y + event.dy / scale;
        
        // 位置を更新
        setPosition({ x: newX, y: newY });
        
        // transformを更新
        d3.select(this)
          .attr('transform', `translate(${margin.left + newX}, ${margin.top + newY}) scale(${scale})`);
      })
      .on('end', function(event) {
        d3.select(this).attr('cursor', 'move');
      });

    // ドラッグ機能をメイングループに適用
    mainGroup.call(dragView as any);

    // ズーム機能（オプション）
    if (zoomable && svgRef.current) {
      const zoom = d3.zoom()
        .scaleExtent([minZoom, maxZoom])
        .on('zoom', (event) => {
          if (!mainGroupRef.current) return;
          
          // ズームイベントからスケールを取得
          const newScale = event.transform.k;
          setScale(newScale);
          
          // transformを更新
          d3.select(mainGroupRef.current)
            .attr('transform', `translate(${margin.left + position.x}, ${margin.top + position.y}) scale(${newScale})`);
        });
        
      // SVG全体にズームリスナーを適用
      svg.call(zoom as any);
      
      // ズーム操作のスタイル変更
      svg.on('mousedown.zoom', null);
    }

    // 操作説明テキスト
    svg.append('text')
      .attr('class', 'instructions')
      .attr('x', margin.left)
      .attr('y', height - 10)
      .attr('font-size', '12px')
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'start')
      .text(`ドラッグ: グラフを移動 ${zoomable ? '/ スクロール: ズーム' : ''}`);
      
    // ステータス表示（現在の位置と拡大率）
    const statusText = svg.append('text')
      .attr('class', 'status')
      .attr('x', width - margin.right)
      .attr('y', height - 10)
      .attr('font-size', '12px')
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'end');
      
    function updateStatus() {
      statusText.text(`位置: (${position.x.toFixed(0)}, ${position.y.toFixed(0)}) / 拡大率: ${(scale * 100).toFixed(0)}%`);
    }
    
    updateStatus();

  }, [data, width, height, innerWidth, innerHeight, margin, position, scale, gridLines, zoomable, minZoom, maxZoom, categoryColors]);

  return (
    <div className="dragable-view-container">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height}
        style={{ border: '1px solid #ccc', borderRadius: '5px' }}
      >
        <title>ドラッグ可能なビジュアライゼーションビュー</title>
      </svg>
    </div>
  );
};

export default DragableView;