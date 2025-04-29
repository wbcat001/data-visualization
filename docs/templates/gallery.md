# データ可視化テンプレートギャラリー

このドキュメントでは、プロジェクトで提供されている様々なテンプレートの概要と使用例を紹介します。

## ダッシュボードテンプレート

### 基本棒グラフテンプレート

**説明**: シンプルな棒グラフ表示。カテゴリデータの比較に最適です。

**使用例**:
```tsx
import { BarChart } from '../../components/charts/BarChart';

const MyComponent = () => {
  const data = [
    { label: 'カテゴリA', value: 20 },
    { label: 'カテゴリB', value: 35 },
    { label: 'カテゴリC', value: 15 },
    { label: 'カテゴリD', value: 40 }
  ];

  return <BarChart data={data} width={600} height={400} />;
};
```

### 時系列折れ線グラフテンプレート

**説明**: 時間経過に伴うデータ変化を可視化するための折れ線グラフ。トレンド分析に適しています。

**使用例**:
```tsx
import { LineChart } from '../../components/charts/LineChart';

const MyComponent = () => {
  const data = [
    { date: new Date(2023, 0, 1), value: 10 },
    { date: new Date(2023, 1, 1), value: 25 },
    { date: new Date(2023, 2, 1), value: 15 },
    { date: new Date(2023, 3, 1), value: 40 },
    { date: new Date(2023, 4, 1), value: 35 }
  ];

  return <LineChart data={data} width={600} height={400} />;
};
```

## レポートテンプレート

### 円グラフテンプレート

**説明**: データの割合や構成比を表示するための円グラフテンプレート。全体に対する部分の比率を視覚化します。

**使用例**:
```tsx
import { PieChart } from '../../components/charts/PieChart';

const MyComponent = () => {
  const data = [
    { label: '項目1', value: 30 },
    { label: '項目2', value: 15 },
    { label: '項目3', value: 25 },
    { label: '項目4', value: 10 },
    { label: '項目5', value: 20 }
  ];

  return <PieChart data={data} width={600} height={400} donut={false} />;
};
```

## データ探索テンプレート

### インタラクティブデータ探索テンプレート

**説明**: 複数の視点からデータを探索できる多機能可視化テンプレート。散布図、棒グラフ、折れ線グラフを切り替えながらデータ分析できます。

**使用例**:
```tsx
import DataExplorerTemplate from '../../templates/exploratory/DataExplorerTemplate';

const MyComponent = () => {
  return <DataExplorerTemplate />;
};
```

## 今後追加予定のテンプレート

1. **ヒートマップ**: データマトリックスの値を色の強度で表現するヒートマップ
2. **散布図**: 2変数間の関係を示す散布図と回帰線
3. **ツリーマップ**: 階層構造を持つデータを長方形の入れ子構造で表現
4. **地図可視化**: 地理情報データの視覚化
5. **ネットワークグラフ**: 関係性や接続を表現するネットワーク図