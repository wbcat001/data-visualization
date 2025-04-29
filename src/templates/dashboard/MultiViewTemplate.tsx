import React from 'react';
import ZoomableMultiView, { DataPoint } from '../../components/sample-code/zoomable-multi-view';

const MultiViewTemplate: React.FC = () => {
  // サンプルデータの生成（各カテゴリに異なる特性を持たせる）
  const generateDataPoints = (): DataPoint[] => {
    const dataPoints: DataPoint[] = [];
    
    // カテゴリA: 左上, 主に低い値の集中したデータ
    for (let i = 0; i < 20; i++) {
      dataPoints.push({
        id: `A-${i+1}`,
        x: Math.random() * 40 + 5, // 5-45の範囲
        y: Math.random() * 40 + 5, // 5-45の範囲
        value: Math.random() * 30 + 10, // 10-40の範囲
        category: 'A'
      });
    }
    
    // カテゴリB: 右上, 広範囲に散らばったデータ
    for (let i = 0; i < 15; i++) {
      dataPoints.push({
        id: `B-${i+1}`,
        x: Math.random() * 45 + 50, // 50-95の範囲
        y: Math.random() * 40 + 5, // 5-45の範囲
        value: Math.random() * 70 + 20, // 20-90の範囲
        category: 'B'
      });
    }
    
    // カテゴリC: 左下, 大きな値を持つデータが少数
    for (let i = 0; i < 12; i++) {
      dataPoints.push({
        id: `C-${i+1}`,
        x: Math.random() * 40 + 5, // 5-45の範囲
        y: Math.random() * 45 + 50, // 50-95の範囲
        value: Math.random() * 50 + 40, // 40-90の範囲
        category: 'C'
      });
    }
    
    // カテゴリD: 右下, 多数のデータポイント
    for (let i = 0; i < 30; i++) {
      dataPoints.push({
        id: `D-${i+1}`,
        x: Math.random() * 45 + 50, // 50-95の範囲
        y: Math.random() * 45 + 50, // 50-95の範囲
        value: Math.random() * 40 + 5, // 5-45の範囲
        category: 'D'
      });
    }
    
    return dataPoints;
  };

  const sampleData = generateDataPoints();

  return (
    <div className="template-item">
      <h3>エリア選択型散布図テンプレート</h3>
      <div className="template-description">
        <p>
          4つのエリアに分かれた散布図を表示し、エリアをクリックするとそのエリアのデータポイントの詳細を
          別のビューで表示する Focus+Context 可視化です。メインビューのコンテキストを維持したまま、
          選択した領域のデータを詳細に分析できます。
        </p>
      </div>
      <div className="template-preview large">
        <ZoomableMultiView 
          data={sampleData} 
          width={1000}
          height={600}
          mainViewWidth={500}
          mainViewHeight={500}
          detailViewWidth={400}
          detailViewHeight={400}
          connectionColor="#666"
          connectionWidth={2}
          colors={{
            A: '#1f77b4', // 青
            B: '#ff7f0e', // オレンジ
            C: '#2ca02c', // 緑
            D: '#d62728'  // 赤
          }}
        />
      </div>
      <div className="template-info">
        <h4>使用方法</h4>
        <pre>{`<ZoomableMultiView 
  data={dataPoints} 
  width={1000}
  height={600}
  mainViewWidth={500}
  mainViewHeight={500}
  detailViewWidth={400}
  detailViewHeight={400}
  connectionColor="#666"
  connectionWidth={2}
  colors={{
    A: '#1f77b4',
    B: '#ff7f0e',
    C: '#2ca02c',
    D: '#d62728'
  }}
/>`}</pre>
        <h4>インタラクション</h4>
        <ul>
          <li>メインビューの4つのエリア（A, B, C, D）のいずれかをクリックすると、そのエリア内のデータポイントが詳細ビューに表示されます</li>
          <li>選択されたエリアと詳細ビューは接続線で繋がれ、関連性が視覚的に表現されます</li>
          <li>詳細ビュー内のデータポイントにマウスオーバーすると、そのポイントの詳細情報がツールチップとして表示されます</li>
          <li>背景をクリックするか同じエリアを再度クリックすると、詳細ビューが閉じます</li>
        </ul>
        <h4>データ形式</h4>
        <pre>{`interface DataPoint {
  id: string;      // データポイントの一意識別子
  x: number;       // X座標 (0-100の範囲)
  y: number;       // Y座標 (0-100の範囲)
  value: number;   // 値 (円の大きさに反映)
  category: 'A' | 'B' | 'C' | 'D';  // 4つのエリアのいずれか
  color?: string;  // オプションの色指定 (指定なしの場合はcolorsから取得)
  label?: string;  // オプションのラベル
}`}</pre>
      </div>
    </div>
  );
};

export default MultiViewTemplate;