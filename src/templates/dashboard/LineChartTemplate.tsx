import React from 'react';
import LineChart, { TimeDataItem } from '../../components/charts/LineChart';

const LineChartTemplate: React.FC = () => {
  // サンプルデータ
  const sampleData: TimeDataItem[] = [
    { date: new Date(2023, 0, 1), value: 10 },
    { date: new Date(2023, 1, 1), value: 25 },
    { date: new Date(2023, 2, 1), value: 15 },
    { date: new Date(2023, 3, 1), value: 40 },
    { date: new Date(2023, 4, 1), value: 35 },
    { date: new Date(2023, 5, 1), value: 50 },
  ];

  return (
    <div className="template-item">
      <h3>時系列折れ線グラフテンプレート</h3>
      <div className="template-description">
        <p>時間経過に伴うデータ変化を可視化するための折れ線グラフ。トレンド分析に適しています。</p>
      </div>
      <div className="template-preview">
        <LineChart data={sampleData} />
      </div>
      <div className="template-info">
        <h4>使用方法</h4>
        <pre>{`<LineChart 
  data={timeSeriesData} 
  width={600} 
  height={400}
  showPoints={true}
  curve="linear" // "curve", "step"も選択可能
/>`}</pre>
      </div>
    </div>
  );
};

export default LineChartTemplate;