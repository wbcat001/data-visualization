import React from 'react';
import ZoomableCirclePacking from '../../components/sample-code/zoomable-circle-packing';

const CirclePackingTemplate: React.FC = () => {
  // サンプル階層データ
  const sampleData = {
    name: "データ可視化",
    children: [
      {
        name: "チャート",
        children: [
          { 
            name: "基本チャート", 
            children: [
              { name: "棒グラフ", value: 120 },
              { name: "折れ線グラフ", value: 100 },
              { name: "円グラフ", value: 80 }
            ] 
          },
          { 
            name: "高度なチャート", 
            children: [
              { name: "ヒートマップ", value: 70 },
              { name: "ツリーマップ", value: 90 },
              { name: "サンバースト", value: 85 }
            ] 
          }
        ]
      },
      {
        name: "インタラクション",
        children: [
          { name: "ドラッグ", value: 50 },
          { name: "ズーム", value: 60 },
          { name: "フィルター", value: 55 },
          { name: "ドリルダウン", value: 65 }
        ]
      },
      {
        name: "データ処理",
        children: [
          { name: "集計", value: 45 },
          { name: "変換", value: 40 },
          { name: "クリーニング", value: 35 }
        ]
      }
    ]
  };

  return (
    <div className="template-item">
      <h3>ズーム可能な円パッキングテンプレート</h3>
      <div className="template-description">
        <p>階層データを対話的に探索できる円パッキング可視化。円をクリックしてズームイン、背景をクリックしてズームアウト。</p>
      </div>
      <div className="template-preview">
        <ZoomableCirclePacking data={sampleData} width={600} height={600} />
      </div>
      <div className="template-info">
        <h4>使用方法</h4>
        <pre>{`<ZoomableCirclePacking 
  data={yourHierarchicalData} 
  width={600} 
  height={600} 
/>`}</pre>
        <p><small>Altキーを押しながらクリックすると、ゆっくりズームします。</small></p>
      </div>
    </div>
  );
};

export default CirclePackingTemplate;