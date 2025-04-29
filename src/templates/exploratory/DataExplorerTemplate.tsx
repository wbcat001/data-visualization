import React, { useState } from 'react';
import BarChart from '../../components/charts/BarChart';
import LineChart from '../../components/charts/LineChart';
import PieChart from '../../components/charts/PieChart';

// データの型定義
interface DataPoint {
  id: number;
  category: string;
  value1: number;
  value2: number;
  date: Date;
}

// オプションの型定義
interface ExplorerOptions {
  enableFiltering: boolean;
  enableSorting: boolean;
  highlightOutliers: boolean;
}

const DataExplorerTemplate: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'bar'|'line'|'pie'>('bar');
  
  // サンプルデータ
  const sampleData: DataPoint[] = [
    { id: 1, category: 'A', value1: 10, value2: 20, date: new Date(2023, 0, 1) },
    { id: 2, category: 'B', value1: 15, value2: 30, date: new Date(2023, 1, 1) },
    { id: 3, category: 'A', value1: 20, value2: 15, date: new Date(2023, 2, 1) },
    { id: 4, category: 'C', value1: 25, value2: 40, date: new Date(2023, 3, 1) },
    { id: 5, category: 'B', value1: 30, value2: 25, date: new Date(2023, 4, 1) },
  ];

  // 各チャートタイプに合わせたデータ変換
  const barData = sampleData.map(d => ({
    label: d.category,
    value: d.value1
  }));

  const lineData = sampleData.map(d => ({
    date: d.date,
    value: d.value1
  }));

  const pieData = sampleData.map(d => ({
    label: d.category,
    value: d.value1
  })).reduce((acc, curr) => {
    const existingItem = acc.find(item => item.label === curr.label);
    if (existingItem) {
      existingItem.value += curr.value;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, [] as {label: string, value: number}[]);

  const renderVisualization = () => {
    switch (selectedView) {
      case 'bar':
        return <BarChart data={barData} width={700} height={500} />;
      case 'line':
        return <LineChart data={lineData} width={700} height={500} showPoints={true} />;
      case 'pie':
        return <PieChart data={pieData} width={700} height={500} />;
      default:
        return <div>表示タイプを選択してください</div>;
    }
  };
  
  return (
    <div className="template-item explorer-template">
      <h3>インタラクティブデータ探索テンプレート</h3>
      <div className="template-description">
        <p>
          複数の視点からデータを探索できる多機能可視化テンプレート。
          棒グラフ、折れ線グラフ、円グラフを切り替えながらデータ分析できます。
        </p>
      </div>
      <div className="controls">
        <button 
          className={selectedView === 'bar' ? 'active' : ''} 
          onClick={() => setSelectedView('bar')}
        >
          棒グラフ
        </button>
        <button 
          className={selectedView === 'line' ? 'active' : ''} 
          onClick={() => setSelectedView('line')}
        >
          折れ線グラフ
        </button>
        <button 
          className={selectedView === 'pie' ? 'active' : ''} 
          onClick={() => setSelectedView('pie')}
        >
          円グラフ
        </button>
      </div>
      <div className="template-preview large">
        {renderVisualization()}
      </div>
      <div className="template-info">
        <h4>使用方法</h4>
        <pre>{`<DataExplorer 
  data={yourData} 
  options={{
    enableFiltering: true,
    enableSorting: true,
    highlightOutliers: true
  }} 
  width={700}
  height={500}
/>`}</pre>
      </div>
    </div>
  );
};

export default DataExplorerTemplate;