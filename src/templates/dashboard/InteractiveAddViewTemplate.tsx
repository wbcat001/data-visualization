import React from 'react';
import InteractiveAddView from '../../components/sample-code/interactive-add-view';

const InteractiveAddViewTemplate: React.FC = () => {
  // Sample data
  const sampleData = [
    { id: '1', name: 'データA', value: 42 },
    { id: '2', name: 'データB', value: 67 },
    { id: '3', name: 'データC', value: 53 },
    { id: '4', name: 'データD', value: 89 },
  ];

  return (
    <div className="template-container">
      <div className="template-header">
        <h1>インタラクティブビュー管理</h1>
        <p className="description">
          このデモでは、ユーザーがインタラクションを通じて画面上にビューを追加、移動、削除する機能を実装しています。
          「+」ボタンを押して新しいビューを追加したり、ビューをドラッグして移動したり、右上の×ボタンで削除したりできます。
        </p>
      </div>
      <div className="chart-container">
        <InteractiveAddView data={sampleData} />
      </div>
    </div>
  );
};

export default InteractiveAddViewTemplate;