import React from 'react';
import DragableView, { DataPoint } from '../../components/sample-code/dragable-view';

const DragableViewTemplate: React.FC = () => {
  // サンプルデータの作成
  const sampleData: DataPoint[] = [
    { id: '1', x: 20, y: 30, value: 50, category: 'グループA', label: 'ポイント1' },
    { id: '2', x: 40, y: 60, value: 70, category: 'グループA', label: 'ポイント2' },
    { id: '3', x: 60, y: 40, value: 30, category: 'グループB', label: 'ポイント3' },
    { id: '4', x: 70, y: 70, value: 90, category: 'グループB', label: 'ポイント4' },
    { id: '5', x: 30, y: 50, value: 40, category: 'グループC', label: 'ポイント5' },
    { id: '6', x: 50, y: 20, value: 60, category: 'グループC', label: 'ポイント6' },
    { id: '7', x: 80, y: 30, value: 20, category: 'グループD', label: 'ポイント7' },
    { id: '8', x: 25, y: 75, value: 80, category: 'グループD', label: 'ポイント8' },
  ];

  return (
    <div className="template">
      <h3>ドラッグ可能なビューテンプレート</h3>
      <p>ビュー全体をドラッグして移動できるグラフコンポーネントです。マウスホイールでズームも可能です。</p>
      <div className="visualization-container">
        <DragableView 
          data={sampleData}
          width={800}
          height={600}
          gridLines={true}
          zoomable={true}
        />
      </div>
    </div>
  );
};

export default DragableViewTemplate;