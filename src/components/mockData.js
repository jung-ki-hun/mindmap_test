const endpoints = [
  {
    id: 'right',// 구분용 id 값 // 식별하기 편한걸로 진행하면 하면됨
    orientation: [1, 0],// x 축값 
    pos: [0, 0.5] // y 축값
  },
  {
    id: 'left',
    orientation: [-1, 0],
    pos: [0, 0.5]
  },
  {
    id: 'up',
    orientation: [0, -1],
    pos: [0.5, 0.5] 
  },
  {
    id: 'down',
    orientation: [0, 1],
    pos: [0.5, 0.5]
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
      group: '1',
      top: 40,
      left: 140,
      endpoints: endpoints,
    },
  ],
  edges: [{
    id: '1-2',
    sourceNode: '1',
    targetNode: '2',
    source: 'down', // 연결 포인트 위치
    target: 'down', // 대상의 연결 포인트 위치
  }, 
  {
    id: '2-1',
    sourceNode: '2',
    targetNode: '1',
    source: 'up',
    target: 'up',
  }],
};