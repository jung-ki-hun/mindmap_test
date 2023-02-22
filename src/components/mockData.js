const endpoints = [
  {
    id: 'right',
    orientation: [1, 0],
    pos: [0, 0.5]
  },
  {
    id: 'left',
    orientation: [-1, 0],
    pos: [0, 0.5]
  }
]; // 연결지점

export default {
  groups: [
    {
      id: '1',
      left: 10,
      top: 20,
    },
  ],
  nodes: [
    {
      id: '1',
      group: '1',
      top: 40,
      left: 20,
      endpoints: endpoints,
    },
    {
      id: '2',
      top: 50,
      left: 300,
      endpoints: endpoints,
    },
  ],
  edges: [{
    id: '1-2',
    sourceNode: '1',
    targetNode: '2',
    source: 'right',
    target: 'left',},
  {
    id: '2-1',
    sourceNode: '2',
    targetNode: '1',
    source: 'right',
    target: 'left',
  }],
};