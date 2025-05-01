# Linked Visualization Component

This component visualizes two sets of coordinates on the left and right sides of an SVG canvas. Corresponding points are connected with lines to help visualize relationships, such as those resulting from dimensionality reduction.

## Props

- `leftCoordinates`: An array of objects with `x` and `y` properties representing the left-side coordinates.
- `rightCoordinates`: An array of objects with `x` and `y` properties representing the right-side coordinates.

## Usage

```tsx
import LinkedVisualization from './linked-visualization';

const leftCoordinates = [
  { x: 50, y: 50 },
  { x: 100, y: 100 },
  { x: 150, y: 150 },
];

const rightCoordinates = [
  { x: 50, y: 50 },
  { x: 100, y: 100 },
  { x: 150, y: 150 },
];

<LinkedVisualization leftCoordinates={leftCoordinates} rightCoordinates={rightCoordinates} />;
```

## Notes

- Ensure that both `leftCoordinates` and `rightCoordinates` have the same length.
- The SVG canvas is 800x400, with the right-side coordinates shifted 400 units to the right.