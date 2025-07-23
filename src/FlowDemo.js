import React, { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { StraightEdge } from 'reactflow';
import CustomNode from './CustomNode';

const DIRECTION_VEC = {
    N: [0, -1],
    NE: [1, -1],
    E: [1, 0],
    SE: [1, 1],
    S: [0, 1],
    SW: [-1, 1],
    W: [-1, 0],
    NW: [-1, -1],
};
const DIST = 140;

function autoLayoutManholes(manholes) {
    if (!Array.isArray(manholes) || manholes.length === 0) {
        return { nodes: [], edges: [] };
    }
    const nodes = [];
    const edges = [];
    const nodeMap = {};
   let baseX = 300, baseY = 200;
    const placed = {};
    manholes.forEach((m, idx) => {
        // 每个manhole都画出来，自动分散位置
        const x = baseX + (idx % 4) * 180;
        const y = baseY + Math.floor(idx / 4) * 180;
        nodes.push({
            id: m.manholeName,
            position: { x, y },
            type: 'circle',
            data: { name: m.manholeName, rimElev: m.rimElev }
        });
        nodeMap[m.manholeName] = { x, y };
        placed[m.manholeName] = { x, y };
    });

    console.log(manholes);

    const pipes = Array.isArray(manholes[0]?.pipes) ? manholes[0].pipes : [];
    console.log(pipes);


   manholes.forEach((m, idx) => {
        if (!Array.isArray(m.pipes)) return;
        m.pipes.forEach((p, pi) => {
            if (!p.to) return; // 防御
            edges.push({
                id: `${m.manholeName}-${p.to}-${pi}`,
                source: m.manholeName,
                target: p.to,
                type: 'arrow',
                markerEnd: { type: 'arrowclosed', color: '#d00' }
            });
        });
    });


    return { nodes, edges };
}








export default function FlowDemo({ manholes }) {
    // const nodes = useMemo(() =>
    //     manholes.map((m, idx) => ({
    //         id: m.manholeName,
    //         data: { label: `${m.manholeName}\nRimElev:${m.rimElev}` },
    //         position: { x: 120 + idx * 220, y: 160 },
    //         style: { border: '1px solid #888', borderRadius: 6, background: '#f8f9fa', padding: 6 }
    //     })), [manholes]);

    // const edges = useMemo(() =>
    //     manholes.flatMap((m) =>
    //         m.pipes.filter(p => p.to).map((p, idx2) => ({
    //             id: `${m.manholeName}-${p.to}-${idx2}`,
    //             source: m.manholeName,
    //             target: p.to,
    //             label: [p.pipeLabel, p.direction, p.angle].filter(Boolean).join(' ') + ` d=${p.depth}`,
    //             style: { stroke: '#222', strokeWidth: 1.5 },
    //             labelStyle: { fill: '#222' },
    //             type: 'arrow',
    //             markerEnd: {
    //                 type: 'arrowclosed',

    //                 color: '#d00', // arrow
    //             },
    //             style: { stroke: '#d00', strokeWidth: 1.5 },
    //         }))
    //     ), [manholes]);

    // const manholes = [
    //     {
    //         manholeName: 'st1',
    //         rimElev: '601.323',
    //         pipes: [
    //             { to: 'st2', direction: 'NW' },
    //             { to: 'st3', direction: 'SW' },
    //         ]
    //     },
    //     { manholeName: 'st2', rimElev: '601.000', pipes: [] },
    //     { manholeName: 'st3', rimElev: '601.531', pipes: [] }
    // ];

    // 动态生成 nodes 和 edges
    const { nodes, edges } = useMemo(() => autoLayoutManholes(manholes), [manholes]);
    console.log(edges);

    const nodeTypes = { circle: CustomNode };
    const edgeTypes = { arrow: StraightEdge };



    return (
        <div style={{ width: '100%', height: 460, margin: '0 auto 1rem' }}>
            <ReactFlow nodes={nodes} nodeTypes={nodeTypes} edges={edges} edgeTypes={edgeTypes} fitView>
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
}
