import React, { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';

export default function FlowDemo({ manholes }) {
  // 节点
  const nodes = useMemo(() =>
    manholes.map((m, idx) => ({
      id: m.manholeName,
      data: { label: `${m.manholeName}\nPt:${m.pointNo}\n${m.rimElev}` },
      position: { x: 120 + idx * 220, y: 160 },
      style: { border: '1px solid #888', borderRadius: 6, background: '#f8f9fa', padding: 6 }
    })), [manholes]);

  // 连线
  const edges = useMemo(() =>
    manholes.flatMap((m) =>
      m.pipes.filter(p => p.to).map((p, idx2) => ({
        id: `${m.manholeName}-${p.to}-${idx2}`,
        source: m.manholeName,
        target: p.to,
        label: [p.pipeLabel, p.pipeType, p.direction, p.angle].filter(Boolean).join(' ') + ` d=${p.depth}`,
        style: { stroke: '#222', strokeWidth: 1.5 },
        labelStyle: { fill: '#222' }
      }))
    ), [manholes]);

  return (
    <div style={{ width: '100%', height: 460, margin: '0 auto 1rem' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
