# インタラクティブビュー追加コンポーネント

このドキュメントでは、`interactive-add-view.tsx`コンポーネントの実装について説明します。このコンポーネントは、ユーザーが動的にビューを追加、移動、削除できるインタラクティブなインターフェイスを提供します。

## 主要な機能

1. **動的ビュー生成**: ボタンクリックで新しいビューを作成
2. **ドラッグによる位置調整**: D3.jsのドラッグ機能を使用したビューの自由な配置
3. **ビュー管理**: ビューの追加・削除とそれに伴う状態管理

## 実装概要

### 状態管理

このコンポーネントでは、以下の状態を管理しています：

```typescript
// ビューの配列（ID、X座標、Y座標）
const [views, setViews] = useState<{ id: string; x: number; y: number }[]>([
  { id: 'view-1', x: 50, y: 50 }
]);

// 現在選択されているビューのID
const [selectedView, setSelectedView] = useState<string | null>(null);

// ドラッグ中の位置を追跡するためのRef（再レンダリングを回避）
const viewPositionRef = useRef<{ [key: string]: { x: number, y: number } }>({});
```

### ビューの追加

「+」ボタンをクリックすると、新しいビューが生成されます：

```typescript
const addButtonGroup = svg.append('g')
  .attr('class', 'add-button')
  .attr('transform', `translate(${width - 80}, 30)`)
  .style('cursor', 'pointer')
  .on('click', () => {
    const newId = `view-${views.length + 1}`;
    const newX = Math.random() * (width - 200) + 50;
    const newY = Math.random() * (height - 200) + 50;
    
    // 新しいビューの位置を記録
    viewPositionRef.current[newId] = { x: newX, y: newY };
    
    // stateに新しいビューを追加（これによりコンポーネントが再レンダリング）
    setViews([...views, { id: newId, x: newX, y: newY }]);
  });
```

### ドラッグ機能の実装

各ビューはD3.jsのドラッグ機能を使用して移動可能です：

```typescript
.call(d3.drag<SVGGElement, unknown>()
  .on('start', function() {
    // ドラッグ開始時に要素を前面に出す
    d3.select(this).raise();
    setSelectedView(view.id);
  })
  .on('drag', function(event) {
    // 現在位置を取得して更新
    const currentPos = viewPositionRef.current[view.id] || { x: view.x, y: view.y };
    const newX = currentPos.x + event.dx;
    const newY = currentPos.y + event.dy;
    
    // DOM要素の位置を直接更新（滑らかな動きのため）
    d3.select(this).attr('transform', `translate(${newX}, ${newY})`);
    
    // 参照位置を更新
    viewPositionRef.current[view.id] = { x: newX, y: newY };
  })
  .on('end', function() {
    // ドラッグ終了時にのみstateを更新
    const finalPos = viewPositionRef.current[view.id];
    if (finalPos) {
      setViews(views.map(v => 
        v.id === view.id ? { ...v, x: finalPos.x, y: finalPos.y } : v
      ));
    }
  })
)
```

## ドラッグ処理の最適化

滑らかなドラッグ操作を実現するために、以下の最適化を行っています：

1. **位置の参照管理**:
   - `useRef`を使用して、ドラッグ中の位置を追跡
   - ドラッグ中はDOM操作のみを行い、Reactの状態更新を回避

2. **ドラッグ終了時の状態更新**:
   - ドラッグ操作中は状態を更新せず、DOMを直接操作
   - ドラッグ終了時にのみ`setViews`を呼び出して状態を更新

3. **一貫した位置追跡**:
   - 常に`viewPositionRef`から最新の位置情報を取得
   - これにより、ドラッグ操作中の位置計算の累積誤差を防止

## ビューの削除

各ビューの右上には削除ボタンがあり、クリックするとビューを削除できます：

```typescript
const closeButton = viewGroup.append('g')
  .attr('class', 'close-button')
  .attr('transform', `translate(160, 20)`)
  .style('cursor', 'pointer')
  .on('click', (event) => {
    event.stopPropagation();
    // ビュー配列からこのビューを削除
    setViews(views.filter(v => v.id !== view.id));
    if (selectedView === view.id) {
      setSelectedView(null);
    }
  });
```

## コンポーネントの活用方法

このコンポーネントは、ダッシュボードのような複数のビューを自由に配置したいシナリオで活用できます。各ビュー内のコンテンツは自由にカスタマイズ可能で、現在の実装ではシンプルな棒グラフを表示しています。

実際のアプリケーションでは、このパターンを応用して：

- データダッシュボードの作成
- カスタマイズ可能なレポートビルダー
- インタラクティブなデータ分析ツール

などを開発できます。

## まとめ

`interactive-add-view.tsx`コンポーネントは、React、D3.js、TypeScriptを組み合わせて、動的なビュー管理とインタラクティブな操作を実現しています。ボタンによるビュー生成、状態管理、そしてスムーズなドラッグ操作を実装することで、カスタマイズ可能なダッシュボードのような機能を提供します。