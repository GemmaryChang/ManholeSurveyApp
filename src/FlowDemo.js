import React, { useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { StraightEdge } from 'reactflow';
import CustomNode from './CustomNode'; // 路径视你的项目结构


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
    const nodes = [];
    const edges = [];
    const nodeMap = {};
    // 以第一个manhole为中心
    let baseX = 300, baseY = 200;
    manholes.forEach((m, idx) => {
        if (idx === 0) {
            nodes.push({
                id: m.manholeName,
                position: { x: baseX, y: baseY },
                type: 'circle',
                data: { name: m.manholeName, rimElev: m.rimElev }
            });
            nodeMap[m.manholeName] = { x: baseX, y: baseY };
        }
    });

    // 只布局第一节点的pipes（可按你需要扩展成递归）
    manholes[0].pipes.forEach((p, idx) => {
        const [dx, dy] = DIRECTION_VEC[p.direction];
        const x = baseX + dx * DIST;
        const y = baseY + dy * DIST;
        nodes.push({
            id: p.to,
            position: { x, y },
            type: 'circle',
            data: {
                name: p.to,
                rimElev: manholes.find(m => m.manholeName === p.to)?.rimElev
            }
        });
        nodeMap[p.to] = { x, y };
        edges.push({
            id: `${manholes[0].manholeName}-${p.to}`,
            source: manholes[0].manholeName,
            target: p.to,
            type: 'arrow',
            markerEnd: { type: 'arrowclosed', color: '#d00' }
        });
    });

    return { nodes, edges };
}

// const nodes = [
//   {
//     id: 'st1',
//     type: 'circle', // 关键
//     data: { label: `st1\nRimElev:11` },
//     position: { x: 120, y: 160 }
//   },
//   {
//     id: 'st2',
//     type: 'circle',
//     data: { label: `st2\nRimElev:12` },
//     position: { x: 340, y: 160 }
//   },
//   {
//     id: 'st3',
//     type: 'circle',
//     data: { label: `st3\nRimElev:12` },
//     position: { x: 520, y: 160 }
//   }
// ];


// const edges = [
//   {
//     id: 'st1-st2',
//     source: 'st1',
//     target: 'st2',
//     type: 'arrow',
//     style: { stroke: '#d00', strokeWidth: 1.5 },
//     markerEnd: { type: 'arrowclosed', color: '#d00' }
//   },
//   {
//     id: 'st1-st3',
//     source: 'st1',
//     target: 'st3',

//     style: { stroke: '#d00', strokeWidth: 1.5 },
//     labelStyle: { fill: '#222' },
//     type: 'arrow',
//     markerEnd: {
//       type: 'arrowclosed',
//       color: '#d00'
//     }
//   }
// ];

// const edgeTypes = {
//   arrow: StraightEdge,
// };

// const nodeTypes = {
//   circle: CustomNode, // 注册类型
// };



export default function FlowDemo() {
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

    const manholes = [
        {
            manholeName: 'st1',
            rimElev: '601.323',
            pipes: [
                { to: 'st2', direction: 'NW' },
                { to: 'st3', direction: 'SW' },
            ]
        },
        { manholeName: 'st2', rimElev: '601.000', pipes: [] },
        { manholeName: 'st3', rimElev: '601.531', pipes: [] }
    ];

    // 动态生成 nodes 和 edges
    const { nodes, edges } = autoLayoutManholes(manholes);
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
