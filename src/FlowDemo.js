import React, { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { StraightEdge } from 'reactflow';


export default function FlowDemo({ manholes }) {
    const nodes = useMemo(() =>
        manholes.map((m, idx) => ({
            id: m.manholeName,
            data: { label: `${m.manholeName}\nRimElev:${m.rimElev}` },
            position: { x: 120 + idx * 220, y: 160 },
            style: { border: '1px solid #888', borderRadius: 6, background: '#f8f9fa', padding: 6 }
        })), [manholes]);

    const edges = useMemo(() =>
        manholes.flatMap((m) =>
            m.pipes.filter(p => p.to).map((p, idx2) => ({
                id: `${m.manholeName}-${p.to}-${idx2}`,
                source: m.manholeName,
                target: p.to,
                label: [p.pipeLabel, p.direction, p.angle].filter(Boolean).join(' ') + ` d=${p.depth}`,
                style: { stroke: '#222', strokeWidth: 1.5 },
                labelStyle: { fill: '#222' },
                type: 'arrow',
                markerEnd: {
                    type: 'arrowclosed',

                    color: '#d00', // arrow
                },
                style: { stroke: '#d00', strokeWidth: 1.5 }, 
            }))
        ), [manholes]);

    const edgeTypes = {
        arrow: StraightEdge,
    };


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
