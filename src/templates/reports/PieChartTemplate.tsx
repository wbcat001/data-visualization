import React from 'react';
import PieChart, { PieDataItem } from '../../components/charts/PieChart';

const PieChartTemplate: React.FC = () => {
  // サンプルデータ
  const sampleData: PieDataItem[] = [
    { label: '項目1', value: 30 },
    { label: '項目2', value: 15 },
    { label: '項目3', value: 25 },
    { label: '項目4', value: 10 },
    { label: '項目5', value: 20 },
  ];

  return (
    <div className="template-item">
      <h3>基本円グラフテンプレート</h3>
      <div className="template-description">
        <p>データの割合や構成比を表示するための円グラフテンプレート。全体に対する部分の比率を視覚化します。</p>
      </div>
      <div className="template-preview">
        <PieChart data={sampleData} />
      </div>
      <div className="template-info">
        <h4>使用方法</h4>
        <pre>{`<PieChart 
  data={categoryData} 
  width={600} 
  height={400} 
  donut={false} // ドーナツチャートにする場合はtrue
  innerRadius={0} // ドーナツチャートの場合に内側の半径を指定
  outerRadius={200} // 円グラフの半径
/>`}</pre>
      </div>
    </div>
  );
};

export default PieChartTemplate;