import { useState } from 'react';
import BarChartTemplate from './templates/dashboard/BarChartTemplate';
import LineChartTemplate from './templates/dashboard/LineChartTemplate';
import CirclePackingTemplate from './templates/dashboard/CirclePackingTemplate';
import PieChartTemplate from './templates/reports/PieChartTemplate';
import DataExplorerTemplate from './templates/exploratory/DataExplorerTemplate';
import MultiViewTemplate from './templates/dashboard/MultiViewTemplate';
import DragableViewTemplate from './templates/dashboard/DragableViewTemplate';
import InteractiveAddViewTemplate from './templates/dashboard/InteractiveAddViewTemplate';
import LinkedVisualizationTemplate from './templates/dashboard/LinkedVisualizationTemplate';
import './App.css';

// タブの型定義
type TabType = 'dashboard' | 'gallery';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const renderDashboardTemplates = () => {
    switch (selectedTemplate) {
      case 'bar':
        return <BarChartTemplate />;
      case 'line':
        return <LineChartTemplate />;
      case 'circlePacking':
        return <CirclePackingTemplate />;
      case 'multiView':
        return <MultiViewTemplate />;
      case 'dragable':
        return <DragableViewTemplate />;
      case 'interactiveAdd':
        return <InteractiveAddViewTemplate />;
      case 'linkedVisualization':
        return <LinkedVisualizationTemplate />;
      default:
        return <div>テンプレートカテゴリを選択してください</div>;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="template-container">
            <h2>ダッシュボード用テンプレート</h2>
            <div className="template-nav">
              <button
                className={selectedTemplate === 'bar' ? 'active' : ''}
                onClick={() => setSelectedTemplate('bar')}
              >
                基本棒グラフ
              </button>
              <button
                className={selectedTemplate === 'line' ? 'active' : ''}
                onClick={() => setSelectedTemplate('line')}
              >
                時系列折れ線グラフ
              </button>
              <button
                className={selectedTemplate === 'circlePacking' ? 'active' : ''}
                onClick={() => setSelectedTemplate('circlePacking')}
              >
                階層円パッキング
              </button>
              <button
                className={selectedTemplate === 'multiView' ? 'active' : ''}
                onClick={() => setSelectedTemplate('multiView')}
              >
                Focus+Context マルチビュー
              </button>
              <button
                className={selectedTemplate === 'dragable' ? 'active' : ''}
                onClick={() => setSelectedTemplate('dragable')}
              >
                ドラッグ可能なビュー
              </button>
              <button
                className={selectedTemplate === 'interactiveAdd' ? 'active' : ''}
                onClick={() => setSelectedTemplate('interactiveAdd')}
              >
                インタラクティブ追加ビュー
              </button>
              <button
                className={selectedTemplate === 'linkedVisualization' ? 'active' : ''}
                onClick={() => setSelectedTemplate('linkedVisualization')}
              >
                Linked Visualization
              </button>
            </div>
            <div className="template-grid">{renderDashboardTemplates()}</div>
          </div>
        );
      case 'gallery':
        return (
          <div className="gallery-container">
            <h2>全グラフギャラリー</h2>
            <div className="gallery-grid">
              <div className="gallery-item">
                <h3>棒グラフ</h3>
                <BarChartTemplate />
              </div>
              <div className="gallery-item">
                <h3>折れ線グラフ</h3>
                <LineChartTemplate />
              </div>
              <div className="gallery-item">
                <h3>円グラフ</h3>
                <PieChartTemplate />
              </div>
              <div className="gallery-item">
                <h3>階層円パッキング</h3>
                <CirclePackingTemplate />
              </div>
              <div className="gallery-item">
                <h3>マルチビュー</h3>
                <MultiViewTemplate />
              </div>
              <div className="gallery-item">
                <h3>ドラッグ可能なビュー</h3>
                <DragableViewTemplate />
              </div>
              <div className="gallery-item">
                <h3>データ探索</h3>
                <DataExplorerTemplate />
              </div>
              <div className="gallery-item">
                <h3>インタラクティブ追加ビュー</h3>
                <InteractiveAddViewTemplate />
              </div>
            </div>
          </div>
        );
      default:
        return <div>テンプレートカテゴリを選択してください</div>;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>データ可視化テンプレートギャラリー</h1>
        <p>D3.js + React + TypeScriptで構築された再利用可能な可視化コンポーネント集</p>
      </header>
      <nav className="tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          ダッシュボードテンプレート
        </button>
        <button
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          全グラフギャラリー
        </button>
      </nav>
      <main className="content">{renderContent()}</main>
      <footer>
        <p>© 2025 データ可視化テンプレートプロジェクト</p>
      </footer>
    </div>
  );
}

export default App;
