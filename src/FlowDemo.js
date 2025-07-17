import React, {useMemo} from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

// const nodes = [
//   {
//     id: 'ST01',
//     position: { x: 50, y: 120 },
//     data: { label: 'ST01\n601.323' },
//     style: { border: '1px solid #888', borderRadius: 6, background: '#f8f9fa' },
//   },
//   {
//     id: 'ST02',
//     position: { x: 300, y: 120 },
//     data: { label: 'ST02\n604.000' },
//     style: { border: '1px solid #888', borderRadius: 6, background: '#f8f9fa' },
//   }
// ];

// const edges = [
//   {
//     id: 'ST01-ST02',
//     source: 'ST01',
//     target: 'ST02',
//     label: 'NW d=2.15',
//     style: { stroke: 'red', strokeWidth: 2 },
//     labelStyle: { fill: 'red', fontWeight: 'bold' }
//   },
// ];


export default function FlowDemo( {manholes}) {

    // nodes
    const nodes = useMemo(() =>
    manholes.map((m, idx) => ({
      id: m.manholeName,
      data: { label: `${m.manholeName}\nPt:${m.pointNo}\n${m.rimElev}` },
      position: { x: 100 + idx * 180, y: 120 },
      style: { border: '1px solid #888', borderRadius: 6, background: '#f8f9fa' }
    })), [manholes]);

  // edges
  const edges = useMemo(() =>
    manholes.flatMap((m) =>
      m.pipes.map((p, idx) => ({
        id: `${m.manholeName}-${p.to}-${idx}`,
        source: m.manholeName,
        target: p.to,
        label: `${p.direction} d=${p.depth}`,
        style: { stroke: '#222', strokeWidth: 1.5 },
        labelStyle: { fill: '#222' }
      }))
    ), [manholes]);

  return (
    <div style={{ width: '100%', height: 420 }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
       {/* <MiniMap />
        <Controls />
        <Background /> */}
    </div>
  );
}