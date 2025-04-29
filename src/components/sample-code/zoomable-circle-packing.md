# ズーム可能な円パッキングチャート (Zoomable Circle Packing)

## 概要

ズーム可能な円パッキングチャートは、階層データを視覚化する強力な方法を提供します。このコンポーネントはD3.jsとReactを組み合わせて、インタラクティブな階層データ探索を可能にします。ユーザーは円をクリックしてズームインしたり、背景をクリックしてズームアウトしたりすることができます。

## 機能

- **階層データの視覚化**: 親子関係を持つデータを入れ子になった円で表現
- **インタラクティブな探索**: クリックによるズームイン・ズームアウト機能
- **スムーズなアニメーション**: d3.interpolateZoomを使用した滑らかな遷移
- **視覚的フィードバック**: ホバー時のハイライト表示
- **カスタマイズ可能**: サイズ、色、アニメーション速度などの調整が可能

## 使用方法

```tsx
import ZoomableCirclePacking from '../components/sample-code/zoomable-circle-packing';

// 階層的なデータ構造を定義
const data = {
  name: "root",
  children: [
    {
      name: "グループA",
      children: [
        { name: "項目A1", value: 100 },
        { name: "項目A2", value: 200 }
      ]
    },
    {
      name: "グループB",
      children: [
        { name: "項目B1", value: 150 },
        { name: "項目B2", value: 300 }
      ]
    }
  ]
};

// コンポーネントを使用
function MyComponent() {
  return (
    <div>
      <h2>階層データの可視化</h2>
      <ZoomableCirclePacking data={data} width={800} height={800} />
    </div>
  );
}
```

## 実装の詳細解説

### 1. コンポーネント構造

このコンポーネントは、ReactのFunctional Componentとして実装されています。`useRef`フックを使用してSVG要素への参照を保持し、`useEffect`フック内でD3.jsを使用して可視化を構築しています。

```tsx
const ZoomableCirclePacking: React.FC<ZoomableCirclePackingProps> = ({ data, width = 928, height = 928 }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // D3.jsコードはここに実装
    // ...
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};
```

### 2. D3.jsとReactの統合

ReactとD3.jsを統合する際の主な課題は、両者の異なるレンダリングパラダイムです。Reactは宣言的なアプローチを取るのに対し、D3.jsは命令的にDOMを操作します。

この実装では、ReactがSVG要素の作成と管理を担当し、D3.jsがそのSVG要素内での描画と対話処理を担当するという方法を取っています。これにより、それぞれのライブラリの長所を活かすことができます。

### 3. 階層データの処理

D3.jsの階層データレイアウト機能を使用して、入れ子になったJSONデータを視覚的な階層構造に変換しています。

```tsx
const pack = (data: DataItem) => d3.pack<DataItem>()
  .size([width, height])
  .padding(3)
  (d3.hierarchy<DataItem>(data)
    .sum(d => d.value || 0)
    .sort((a, b) => (b.value || 0) - (a.value || 0)));

const root = pack(data);
```

この処理には以下のステップが含まれています：

1. **階層構造の作成**: `d3.hierarchy`を使用してデータをD3の階層構造に変換
2. **値の集計**: `.sum()`メソッドにより、各ノードとその子孫の値を集計
3. **ソート**: 値に基づいてノードをソート（大きい値から小さい値の順）
4. **レイアウトの計算**: `d3.pack()`を使用して、階層構造をパック（詰め込み）レイアウトに変換

### 4. ズーム機能の実装

ズーム機能は、視点の変更とトランジションアニメーションを組み合わせて実装されています。

```tsx
function zoomTo(v: [number, number, number]) {
  const k = width / v[2];
  view = v;

  label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
  node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
  node.attr("r", d => d.r * k);
}

function zoom(event: d3.D3ZoomEvent<SVGSVGElement, unknown>, d: d3.HierarchyNode<DataItem>) {
  const focus0 = focus;
  focus = d;

  const transition = svg.transition()
    .duration(event.sourceEvent && event.sourceEvent.altKey ? 7500 : 750)
    .tween("zoom", () => {
      const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
      return t => zoomTo(i(t));
    });

  // ラベルの表示/非表示の制御
  label
    .filter(function(d) { 
      const element = this as SVGTextElement;
      return d.parent === focus || element.style.display === "inline"; 
    })
    .transition(transition as any)
    .style("fill-opacity", d => d.parent === focus ? 1 : 0)
    .on("start", function(event, d) { 
      const element = this as SVGTextElement;
      if (d.parent === focus) element.style.display = "inline"; 
    })
    .on("end", function(event, d) { 
      const element = this as SVGTextElement;
      if (d.parent !== focus) element.style.display = "none"; 
    });
}
```

ズーム処理の主要なポイント：

1. **フォーカスの変更**: クリックされた要素を新しいフォーカスポイントとして設定
2. **補間関数**: `d3.interpolateZoom`を使用して、現在の表示から新しいフォーカスへのスムーズな遷移を計算
3. **トランジション**: D3のトランジション機能を使用して、アニメーション中の各フレームを処理
4. **ラベルの制御**: ズームインやズームアウト時に関連するラベルのみを表示

### 5. TypeScriptによる型安全性

TypeScriptを使用して、データ構造とコンポーネントプロパティに強力な型付けを提供しています。

```tsx
interface DataItem {
  name: string;
  children?: DataItem[];
  value?: number;
}

interface ZoomableCirclePackingProps {
  data: DataItem;
  width?: number;
  height?: number;
}
```

これにより、コンポーネントの使用時に型エラーをコンパイル時に検出できるようになり、予期しないバグを防ぐことができます。

### 6. パフォーマンスの最適化

大規模なデータセットの場合、以下の最適化が適用されています：

1. **メモ化**: データや寸法が変更された場合のみ再レンダリングを行う `useEffect` の依存配列
2. **クリーンアップ**: コンポーネントのアンマウント時や再レンダリング前に既存のSVG要素をクリア
3. **イベント委譲**: 個別の要素ではなくグループレベルでのイベントハンドリング

```tsx
// クリーンアップ関数
return () => {
  d3.select(svgRef.current).selectAll('*').remove();
};
```

## カスタマイズのポイント

このコンポーネントは様々な方法でカスタマイズできます：

### 1. 色のカスタマイズ

```tsx
// 色のスケールをカスタマイズ
const color = d3.scaleLinear<string>()
  .domain([0, 5])  // 階層の深さの範囲
  .range(["#ff9900", "#0099ff"])  // 開始色と終了色
  .interpolate(d3.interpolateHcl);
```

### 2. アニメーション速度の調整

```tsx
// アニメーションのデュレーションを調整
const transition = svg.transition()
  .duration(1500)  // ミリ秒単位でデュレーションを設定
  .tween("zoom", () => {
    const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
    return t => zoomTo(i(t));
  });
```

### 3. パディングの調整

```tsx
// 円同士の間隔を調整
const pack = (data: DataItem) => d3.pack<DataItem>()
  .size([width, height])
  .padding(5)  // パディング値を大きくすると間隔が広がる
  (d3.hierarchy<DataItem>(data)
    .sum(d => d.value || 0)
    .sort((a, b) => (b.value || 0) - (a.value || 0)));
```

### 4. テキストスタイルのカスタマイズ

```tsx
// テキストラベルのスタイルをカスタマイズ
const label = svg.append("g")
  .style("font", "12px sans-serif")  // フォントサイズとファミリーを変更
  .style("font-weight", "bold")      // フォントの太さを変更
  .attr("pointer-events", "none")
  .attr("text-anchor", "middle")
  .selectAll("text")
  .data(root.descendants())
  .join("text")
    .style("fill", "#ffffff")       // テキストの色を変更
    .style("fill-opacity", d => d.parent === root ? 1 : 0)
    .style("display", d => d.parent === root ? "inline" : "none")
    .text(d => d.data.name);
```

## 技術的な課題と解決策

### 1. D3イベントとReactイベントの統合

D3.jsのイベントハンドリングはDOMに直接バインドされるため、Reactのイベントシステムとの統合が課題となります。この実装では、D3のイベントハンドラーを直接バインドし、必要に応じてTypeScriptキャストを使用して型の互換性を確保しています。

```tsx
.on("click", (event, d) => focus !== d && (zoom(event as any, d), event.stopPropagation()));
```

### 2. TypeScriptでのD3型の処理

D3.jsの一部のAPIは、TypeScriptとの完全な型互換性がないため、型アサーションが必要な場合があります。

```tsx
.transition(transition as any)
```

より厳密な型付けを実現するためには、カスタム型定義を追加することも検討できます。

### 3. SVG要素の管理

Reactと直接D3.jsを組み合わせる場合、SVG要素の管理が複雑になることがあります。この実装ではRefを使用してReactからD3.jsにSVG要素へのアクセスを提供し、D3.jsに要素の操作を任せています。

## まとめ

ズーム可能な円パッキングチャートコンポーネントは、D3.jsの強力なデータ可視化機能とReactの宣言的なコンポーネントモデルを組み合わせた例です。階層データを視覚化する必要がある場合に特に有用で、ユーザーに直感的なデータ探索体験を提供します。

TypeScriptを使用することで型安全性が向上し、メンテナンス性の高いコードを実現しています。このドキュメントで説明した実装の詳細とカスタマイズのポイントを理解することで、さまざまなユースケースに合わせてこのコンポーネントを適応させることができます。