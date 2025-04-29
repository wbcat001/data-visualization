import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

// データポイントの型定義
export interface DataPoint {
  id: string;
  x: number;
  y: number;
  value: number;
  category: 'A' | 'B' | 'C' | 'D';  // 4つのエリアカテゴリ
  color?: string;
  label?: string;
}

// コンポーネントのProps
export interface ZoomableMultiViewProps {
  data: DataPoint[];  // 散布図のデータポイント
  width?: number;     // 全体の幅
  height?: number;    // 全体の高さ
  mainViewWidth?: number;    // メインビューの幅
  mainViewHeight?: number;   // メインビューの高さ
  detailViewWidth?: number;  // 詳細ビューの幅
  detailViewHeight?: number; // 詳細ビューの高さ
  margin?: { top: number; right: number; bottom: number; left: number };
  connectionColor?: string;  // 接続線の色
  connectionWidth?: number;  // 接続線の幅
  colors?: Record<string, string>; // カテゴリごとの色
}

/**
 * 4つのエリアを持った散布図のメインビューと詳細ビューを表示するコンポーネント
 * エリアをクリックすると、そのエリアのデータポイントを詳細ビューで表示し、接続線で繋ぐ
 */
const ZoomableMultiView: React.FC<ZoomableMultiViewProps> = ({
  data,
  width = 1000,
  height = 600,
  mainViewWidth = 500,
  mainViewHeight = 500,
  detailViewWidth = 400,
  detailViewHeight = 400,
  margin = { top: 40, right: 40, bottom: 40, left: 40 },
  connectionColor = '#999',
  connectionWidth = 2,
  colors = {
    A: '#1f77b4', // 青
    B: '#ff7f0e', // オレンジ
    C: '#2ca02c', // 緑
    D: '#d62728'  // 赤
  }
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [areaCenter, setAreaCenter] = useState<{x: number, y: number} | null>(null);

  // メインビューとディテールビューの位置
  const mainViewX = margin.left;
  const mainViewY = margin.top;
  const detailViewX = mainViewX + mainViewWidth + 100;
  const detailViewY = mainViewY + (mainViewHeight - detailViewHeight) / 2;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // SVG要素の参照を取得
    const svg = d3.select(svgRef.current);
    
    // 既存の要素をクリア
    svg.selectAll('*').remove();

    // メインビューグループを作成
    const mainView = svg.append('g')
      .attr('class', 'main-view')
      .attr('transform', `translate(${mainViewX}, ${mainViewY})`);

    // 接続線グループを作成
    const connectionGroup = svg.append('g')
      .attr('class', 'connection');

    // メインビューの背景を作成
    mainView.append('rect')
      .attr('width', mainViewWidth)
      .attr('height', mainViewHeight)
      .attr('fill', '#f8f8f8')
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1);

    // メインビューのX軸スケールを設定
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, mainViewWidth]);

    // メインビューのY軸スケールを設定
    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([mainViewHeight, 0]);

    // メインビューのX軸を描画
    mainView.append('g')
      .attr('transform', `translate(0, ${mainViewHeight})`)
      .call(d3.axisBottom(xScale));

    // メインビューのY軸を描画
    mainView.append('g')
      .call(d3.axisLeft(yScale));

    // 4つのエリアを描画（A、B、C、D）
    const areas = [
      { category: 'A', x: 0, y: 0, width: mainViewWidth / 2, height: mainViewHeight / 2 },
      { category: 'B', x: mainViewWidth / 2, y: 0, width: mainViewWidth / 2, height: mainViewHeight / 2 },
      { category: 'C', x: 0, y: mainViewHeight / 2, width: mainViewWidth / 2, height: mainViewHeight / 2 },
      { category: 'D', x: mainViewWidth / 2, y: mainViewHeight / 2, width: mainViewWidth / 2, height: mainViewHeight / 2 }
    ];

    // エリアを描画
    const areaGroups = mainView.selectAll('.area')
      .data(areas)
      .enter()
      .append('g')
      .attr('class', 'area')
      .attr('cursor', 'pointer');

    // エリアの背景矩形
    areaGroups.append('rect')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', d => d.width)
      .attr('height', d => d.height)
      .attr('fill', d => d3.color(colors[d.category as keyof typeof colors])?.brighter(1.5) || '#f8f8f8')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#ddd')
      .attr('stroke-width', 1)
      .attr('rx', 5)
      .attr('ry', 5)
      .on('mouseover', function() {
        d3.select(this)
          .attr('stroke', '#999')
          .attr('stroke-width', 2)
          .attr('fill-opacity', 0.5);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke', '#ddd')
          .attr('stroke-width', 1)
          .attr('fill-opacity', 0.3);
      })
      .on('click', (event, d) => {
        // エリアクリック時のイベントハンドラ
        handleAreaClick(d.category, d.x + d.width / 2, d.y + d.height / 2);
      });

    // エリアのラベル
    areaGroups.append('text')
      .attr('x', d => d.x + d.width / 2)
      .attr('y', d => d.y + d.height / 2 - 20)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text(d => `エリア ${d.category}`);

    // データポイントを描画
    const circleSize = 5; // 円のサイズ
    
    mainView.selectAll('.data-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', circleSize)
      .attr('fill', d => d.color || colors[d.category])
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .attr('opacity', 0.7);

    // 背景クリック時にフォーカスをクリア
    svg.on('click', event => {
      // イベント発生要素がエリア内の場合は伝播させない
      if (event.target.classList.contains('area') || event.target.parentNode?.classList.contains('area')) {
        return;
      }
      clearFocus();
    });

    // エリアクリック時の処理
    function handleAreaClick(category: string, centerX: number, centerY: number) {
      // 同じエリアが選択された場合はクリア
      if (selectedCategory === category) {
        clearFocus();
        return;
      }

      // 前の詳細ビューをクリア
      clearFocus();

      // 選択されたエリアの情報を保存
      setSelectedCategory(category);
      setAreaCenter({x: centerX + mainViewX, y: centerY + mainViewY});

      // 選択されたカテゴリのデータを抽出
      const filteredData = data.filter(d => d.category === category);
      
      // 詳細ビューを作成して表示
      createDetailView(category, filteredData);

      // 接続線を描画
      drawConnection({
        x: centerX + mainViewX,
        y: centerY + mainViewY
      }, {
        x: detailViewX,
        y: detailViewY + detailViewHeight / 2
      });
    }

    // 詳細ビューを作成して表示する関数
    function createDetailView(category: string, categoryData: DataPoint[]) {
      
      console.log(`エリア ${category} がクリックされました`);
      console.log(`エリア ${category} のデータポイント:`, categoryData);
      console.log(svg.node());
      // 詳細ビューグループを新規作成
      const detailView = svg.append('g')
        .attr('class', 'detail-view')
        .attr('transform', `translate(${detailViewX}, ${detailViewY})`)
        .style('opacity', 0)
        // .transition()
        // .duration(300)
        // .style('opacity', 1);
      
      detailView.transition()
            .duration(300)
            .style('opacity', 1)

      console.log('detailView', detailView.node()); 

      // 詳細ビューの背景を作成
      detailView.append('rect')
        .attr('width', detailViewWidth)
        .attr('height', detailViewHeight)
        .attr('fill', '#f0f0f0')
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);

      // 詳細ビューのタイトルを作成
      detailView.append('text')
        .attr('class', 'detail-title')
        .attr('x', 20)
        .attr('y', 30)
        .attr('font-family', 'sans-serif')
        .attr('font-size', '18px')
        .attr('font-weight', 'bold')
        .text(`エリア ${category} の詳細`);

      // 詳細ビューのコンテンツグループを作成
      const detailContent = detailView.append('g')
        .attr('class', 'detail-content')
        .attr('transform', 'translate(20, 50)');

      // 詳細ビュー用のスケールを設定
      const detailXScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, detailViewWidth - 40]);

      const detailYScale = d3.scaleLinear()
        .domain([0, 100])
        .range([detailViewHeight - 70, 0]);

      // 詳細ビューのX軸を描画
      detailContent.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${detailViewHeight - 70})`)
        .call(d3.axisBottom(detailXScale));

      // 詳細ビューのY軸を描画
      detailContent.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(detailYScale));

      // バブルチャートとして詳細データを表示
      detailContent.selectAll('.detail-point')
        .data(categoryData)
        .enter()
        .append('circle')
        .attr('class', 'detail-point')
        .attr('cx', d => detailXScale(d.x))
        .attr('cy', d => detailYScale(d.y))
        .attr('r', d => 5 + d.value / 10) // 値に基づいて円のサイズを変更
        .attr('fill', colors[category as keyof typeof colors])
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('opacity', 0.8)
        .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('stroke', '#333')
            .attr('stroke-width', 2);
          
          // ツールチップを表示
          const tooltip = detailContent.append('g')
            .attr('class', 'tooltip')
            .attr('transform', `translate(${detailXScale(d.x) + 10}, ${detailYScale(d.y) - 10})`);
          
          tooltip.append('rect')
            .attr('width', 120)
            .attr('height', 60)
            .attr('fill', 'white')
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('stroke', '#ccc');
          
          tooltip.append('text')
            .attr('x', 10)
            .attr('y', 20)
            .text(`ID: ${d.id}`)
            .attr('font-size', '12px')
            .attr('font-family', 'sans-serif');
          
          tooltip.append('text')
            .attr('x', 10)
            .attr('y', 40)
            .text(`値: ${d.value}`)
            .attr('font-size', '12px')
            .attr('font-family', 'sans-serif');
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('stroke', 'white')
            .attr('stroke-width', 1);
          
          detailContent.selectAll('.tooltip').remove();
        });

      // 詳細情報を表示
      detailContent.append('text')
        .attr('y', -20)
        .attr('x', detailViewWidth - 160)
        .text(`データポイント数: ${categoryData.length}`)
        .style('font-family', 'sans-serif')
        .style('font-size', '12px');

      console.log('detailView', detailView.node());
    }

    // 接続線を描画する関数
    function drawConnection(from: {x: number, y: number}, to: {x: number, y: number}) {
      // 既存の接続線を削除
      connectionGroup.selectAll('*').remove();

      // 曲線のパスを生成
      const linkGenerator = d3.linkHorizontal()
        .source(d => [from.x, from.y])
        .target(d => [to.x, to.y]);

      // 接続線を描画
      connectionGroup.append('path')
        .attr('d', linkGenerator({} as any))
        .attr('fill', 'none')
        .attr('stroke', connectionColor)
        .attr('stroke-width', connectionWidth)
        .attr('stroke-opacity', 0)
        .attr('marker-end', 'url(#arrow)')
        .transition()
        .duration(300)
        .attr('stroke-opacity', 0.6);

      // 矢印マーカーの定義
      svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 10)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', connectionColor);
    }

    // フォーカスをクリアする関数
    function clearFocus() {
      setSelectedCategory(null);
      setAreaCenter(null);

      // 詳細ビューを削除
      svg.selectAll('.detail-view')
        .transition()
        .duration(300)
        .style('opacity', 0)
        .remove();

      // 接続線を削除
      connectionGroup.selectAll('*')
        .transition()
        .duration(300)
        .style('opacity', 0)
        .remove();
        
      // 矢印マーカーを削除
      svg.selectAll('defs').remove();
    }

  }, [data, width, height, mainViewWidth, mainViewHeight, detailViewWidth, detailViewHeight,
     margin, connectionColor, connectionWidth, colors,
     mainViewX, mainViewY, detailViewX, detailViewY]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <title>4分割エリア選択型散布図</title>
    </svg>
  );
};

export default ZoomableMultiView;