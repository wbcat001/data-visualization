# DataVisualization プロジェクト Copilot 指示書

## プロジェクト概要

このプロジェクトは、D3.js + React + TypeScriptで構築されたデータ可視化テンプレート集です。様々なチャートコンポーネントと再利用可能なテンプレートを提供し、データ分析や情報可視化を容易に実装できるようにすることを目的としています。

## プロジェクト構造

```
data-viz-templates/
├── src/
│   ├── components/      # 再利用可能なチャートコンポーネント
│   │   ├── charts/      # 基本チャートタイプ（棒、線、円など）
│   │   ├── common/      # 共通要素（軸、凡例、ツールチップ）
│   │   └── sample-code/ # サンプル実装コード
│   ├── templates/       # 完成した可視化テンプレート
│   │   ├── dashboard/   # ダッシュボード向けテンプレート
│   │   ├── reports/     # レポート向けテンプレート
│   │   └── exploratory/ # データ探索向けテンプレート
│   ├── utils/           # ユーティリティ関数
│   └── data/            # サンプルデータセット
├── public/              # 静的アセットとHTMLエントリーポイント
└── docs/                # ドキュメント
    ├── templates/       # テンプレートのドキュメント
    └── components/      # コンポーネントAPIドキュメント
```

## 技術スタック

- **React**: UI構築のメインライブラリ
- **TypeScript**: 型安全なコード記述
- **D3.js**: データ駆動型ドキュメント生成とビジュアライゼーション
- **Vite**: 高速な開発環境とビルドツール

## 開発ガイドライン

### 1. 新しいチャートコンポーネントの追加

新しいチャートコンポーネントを追加する際は、以下の指針に従ってください：

1. `src/components/charts` ディレクトリに新しいファイルを作成
2. TypeScriptの型定義（Props、データ構造）を明示的に記述
3. D3.jsとReactの統合パターンを適切に使用（Refによる参照管理）
4. 再利用性を高めるためのプロパティ設計（サイズ、マージン、色など）
5. パフォーマンスに配慮した実装（メモ化、クリーンアップ）
6. ドキュメントを `docs/components` に追加

### 2. テンプレートの実装

新しいテンプレートを実装する際のポイント：

1. 適切なディレクトリ（dashboard/reports/exploratory）に配置
2. 既存の基本チャートコンポーネントを活用
3. 必要に応じてサンプルデータを提供
4. インタラクティブ要素（フィルタ、ソート機能など）の追加
5. 使用方法の説明をコード内コメントと `docs/templates` に追加

### 3. D3.jsとReactの統合パターン

プロジェクト内でD3.jsとReactを統合する際の推奨パターン：

```typescript
const MyChart: React.FC<Props> = ({ data, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // D3.js コードはここに実装
    const svg = select(svgRef.current);
    
    // クリーンアップ関数を返す
    return () => {
      // 必要に応じてクリーンアップ処理
    };
  }, [data, width, height]); // 依存配列を適切に設定
  
  return <svg ref={svgRef} width={width} height={height} />;
};
```

### 4. タイプセーフなデータ構造

データ構造はしっかりとした型定義を行ってください：

```typescript
// 良い例
interface DataItem {
  label: string;
  value: number;
  color?: string;
}

// 各コンポーネントのProps型定義
interface ChartProps {
  data: DataItem[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  // その他必要なプロパティ
}
```

### 5. パフォーマンス最適化

- 大規模データセット処理時はメモ化テクニック（useMemo, useCallback）を使用
- レンダリング最適化のためShouldComponentUpdateパターンを検討
- D3のエンターアップデートイグジットパターンを適切に実装
- SVG要素の再利用と最小限のDOM操作

### 6. 機能拡張予定リスト

今後追加予定の機能とコンポーネント：

- ヒートマップチャート
- 散布図と回帰線
- ツリーマップ（階層構造データの可視化）
- 地図ベースの可視化
- ネットワークグラフ（関係性の可視化）
- 双方向インタラクションの強化
- アニメーション効果の追加
- レスポンシブデザインの改善

### 7. コンポーネント設計原則

1. **単一責任の原則**: 各コンポーネントは1つの責任を持つ
2. **再利用性**: 高い再利用性を持たせる
3. **カスタマイズ性**: プロパティを通じて柔軟にカスタマイズ可能に
4. **ドキュメント化**: APIとサンプル実装を明確に文書化
5. **アクセシビリティ**: WCAG基準に準拠したアクセシブルな設計

## トラブルシューティング

一般的な問題と解決策：

1. **チャートが表示されない**: データ形式が正しいか、SVG参照が適切か確認
2. **TypeScriptエラー**: 型定義が適切か確認（特にD3.js関連の型）
3. **パフォーマンス問題**: 不必要な再レンダリングがないか、大きなデータセットの処理方法を確認
4. **レスポンシブ対応**: ウィンドウリサイズイベントの適切なハンドリングを実装

## 便利なコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# ESLintチェック
npm run lint

# テスト実行
npm run test
```

## 参考リソース

- [D3.js ドキュメント](https://d3js.org/)
- [React + D3.js ベストプラクティス](https://www.sitepoint.com/react-d3-ecosystem/)
- [TypeScript 高度な型](https://www.typescriptlang.org/docs/handbook/advanced-types.html)
- [データ可視化デザインパターン](https://datavizcatalogue.com/)

## コーディング規約

- コンポーネントファイル名: パスカルケース（例: `BarChart.tsx`）
- 関数名: キャメルケース（例: `createScale`）
- TypeScript型定義: エクスポートして再利用可能に
- コメント: 複雑なロジックや非自明な処理に付与
- D3.jsコード: メソッドチェーンは適切に改行して可読性を保つ

## Agentでのコード自動化手順

プロジェクトの実装を自動化するためのステップバイステップ手順です。特に新規コンポーネントを作成から画面表示までの一連のフローを自動化できます。

### 1. 新規チャートコンポーネントの実装と表示フロー

新しいチャートコンポーネントを実装し、ダッシュボードに表示するまでの自動化手順：

1. **コンポーネント作成**:
   ```typescript
   // src/components/charts/[ChartName].tsx を作成
   import React, { useRef, useEffect } from 'react';
   import * as d3 from 'd3';
   
   export interface [ChartName]Props {
     data: [DataType][];
     width?: number;
     height?: number;
     // 他の必要なプロパティ
   }
   
   const [ChartName]: React.FC<[ChartName]Props> = ({ data, width = 600, height = 400 }) => {
     const svgRef = useRef<SVGSVGElement>(null);
     
     useEffect(() => {
       // D3.js実装
     }, [data, width, height]);
     
     return <svg ref={svgRef} width={width} height={height}></svg>;
   };
   
   export default [ChartName];
   ```

2. **テンプレート作成**:
   ```typescript
   // src/templates/dashboard/[ChartName]Template.tsx を作成
   import React from 'react';
   import [ChartName], { [ChartName]Props } from '../../components/charts/[ChartName]';
   
   const [ChartName]Template: React.FC = () => {
     // サンプルデータ
     const sampleData = [
       // データ構造に合わせたサンプル
     ];
     
     return (
       <div className="template-item">
         <h3>[表示名]テンプレート</h3>
         <div className="template-description">
           <p>[チャートの説明文]</p>
         </div>
         <div className="template-preview">
           <[ChartName] data={sampleData} />
         </div>
         <div className="template-info">
           <h4>使用方法</h4>
           <pre>{`<[ChartName] 
  data={yourData} 
  width={600} 
  height={400} 
  // その他のプロパティ
/>`}</pre>
         </div>
       </div>
     );
   };
   
   export default [ChartName]Template;
   ```

3. **App.tsxへの統合**:
   - ダッシュボードの場合は `src/App.tsx` の `renderDashboardTemplates` 関数に追加
   - レポートの場合は `renderReportTemplates` 関数に追加
   - 探索テンプレートの場合は `renderExploratoryTemplates` 関数に追加

   ```typescript
   // App.tsxのrenderDashboardTemplates関数を編集
   const renderDashboardTemplates = () => {
     switch(selectedTemplate) {
       // ...existing code...
       case '[chartNameInCamelCase]':
         return <[ChartName]Template />;
       default:
         // ...existing code...
     }
   };
   ```

4. **ナビゲーションメニューへの追加**:
   ```typescript
   // App.tsxのナビゲーションメニュー部分を編集
   <div className="template-nav">
     {/* ...existing code... */}
     <button 
       className={selectedTemplate === '[chartNameInCamelCase]' ? 'active' : ''} 
       onClick={() => setSelectedTemplate('[chartNameInCamelCase]')}
     >
       [表示名]
     </button>
     {/* ...existing code... */}
   </div>
   ```

5. **必要なインポート追加**:
   ```typescript
   // App.tsxの先頭に追加
   import [ChartName]Template from './templates/dashboard/[ChartName]Template';
   ```

### 2. データ構造拡張の自動化

データ構造を拡張してチャートを強化する手順：

1. **データ型定義の拡張**:
   ```typescript
   // src/components/charts/[ChartName].tsx
   export interface [DataType] {
     // 基本プロパティ
     label: string;
     value: number;
     
     // 拡張プロパティ
     color?: string;
     additionalData?: any;
   }
   ```

2. **データ操作ユーティリティの追加**:
   ```typescript
   // src/utils/dataTransformers.ts
   export const transform[ChartName]Data = (rawData: any[]): [DataType][] => {
     return rawData.map(item => ({
       label: item.someProperty,
       value: item.someValue,
       // その他の変換ロジック
     }));
   };
   ```

3. **データローダーの実装**:
   ```typescript
   // src/data/dataLoaders.ts
   export const load[DataType] = async (url: string): Promise<[DataType][]> => {
     const response = await fetch(url);
     const rawData = await response.json();
     return transform[ChartName]Data(rawData);
   };
   ```

### 3. 自動テスト生成

コンポーネント追加時に自動的にテストを生成する手順：

1. **基本テストケース生成**:
   ```typescript
   // src/components/charts/[ChartName].test.tsx
   import { render } from '@testing-library/react';
   import [ChartName] from './[ChartName]';
   
   describe('[ChartName] コンポーネント', () => {
     const sampleData = [
       // テスト用データ
     ];
     
     test('正しくレンダリングされること', () => {
       const { container } = render(<[ChartName] data={sampleData} />);
       expect(container.querySelector('svg')).toBeInTheDocument();
     });
     
     test('データなしの場合エラーなくレンダリングされること', () => {
       const { container } = render(<[ChartName] data={[]} />);
       expect(container.querySelector('svg')).toBeInTheDocument();
     });
   });
   ```

2. **テストの実行**:
   ```bash
   npm test -- -t "[ChartName]"
   ```

### 4. ドキュメント自動生成

コンポーネントからドキュメントを自動生成する手順：

1. **コンポーネントドキュメント作成**:
   ```markdown
   # [ChartName]
   
   ## 概要
   
   [コンポーネントの概要説明]
   
   ## プロパティ
   
   | プロパティ名 | 型 | 必須 | デフォルト値 | 説明 |
   |------------|------|------|------------|------|
   | data | [DataType][] | はい | - | 表示するデータ |
   | width | number | いいえ | 600 | チャートの幅 |
   | height | number | いいえ | 400 | チャートの高さ |
   | [その他のプロパティ] | [型] | [必須か] | [デフォルト値] | [説明] |
   
   ## 使用例
   
   ```tsx
   import [ChartName] from './components/charts/[ChartName]';
   
   const MyComponent = () => {
     const data = [
       // サンプルデータ
     ];
     
     return <[ChartName] data={data} width={600} height={400} />;
   };
   ```
   
   ## カスタマイズ方法
   
   [カスタマイズのガイドライン]
   ```

2. **ドキュメントのパス**:
   - コンポーネントドキュメント: `docs/components/[chart-name-kebab-case].md`
   - テンプレートドキュメント: `docs/templates/[chart-name-kebab-case]-template.md`

### 5. 自動化コマンド

以下のコマンドで一連の作業を自動化できます：

```bash
# 新しいチャートコンポーネントの作成
npm run generate:chart [ChartName]

# テンプレートの作成
npm run generate:template [ChartName] [dashboard|reports|exploratory]

# ドキュメントの生成
npm run generate:docs [ChartName]

# すべてを一括生成
npm run generate:all [ChartName] [dashboard|reports|exploratory]
```

### 6. コンポーネント開発チェックリスト

新規コンポーネント実装時の確認事項：

- [ ] 型定義は適切か
- [ ] D3.jsの処理は適切にクリーンアップされているか
- [ ] レスポンシブ対応しているか
- [ ] アクセシビリティに配慮しているか
- [ ] パフォーマンスを考慮しているか
- [ ] テンプレートにサンプルデータと使用方法が記載されているか
- [ ] App.tsxへの統合は完了しているか
- [ ] コンポーネントのドキュメントは作成されているか