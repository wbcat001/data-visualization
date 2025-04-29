import React from 'react';
import BarChart, { DataItem } from '../../components/charts/BarChart';

const BarChartTemplate: React.FC = () => {
  // サンプルデータ
  const sampleData: DataItem[] = [
    { label: 'A', value: 25 },
    { label: 'B', value: 40 },
    { label: 'C', value: 30 },
    { label: 'D', value: 60 },
    { label: 'E', value: 20 },
  ];

  return (
    <div className="template-item">
      <h3>基本棒グラフテンプレート</h3>
      <div className="template-description">
        <p>シンプルな棒グラフ表示。カテゴリデータの比較に最適。</p>
      </div>
      <div className="template-preview">
        <BarChart data={sampleData} />
      </div>
      <div className="template-info">
        <h4>使用方法</h4>
        <pre>{`<BarChart 
  data={yourData} 
  width={600} 
  height={400} 
/>`}</pre>
      </div>
    </div>
  );
};

export default BarChartTemplate;