import React from 'react';
import LinkedVisualization from '../../components/sample-code/linked-visualization';

const LinkedVisualizationTemplate: React.FC = () => {
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

  return (
    <div>
      <h2>Linked Visualization</h2>
      <LinkedVisualization leftCoordinates={leftCoordinates} rightCoordinates={rightCoordinates} />
    </div>
  );
};

export default LinkedVisualizationTemplate;