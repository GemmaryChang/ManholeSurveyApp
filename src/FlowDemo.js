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
    const nodes = [];
    const edges = [];
    const nodeMap = {}; 

    const manholeDict = Object.fromEntries(
        manholes.map(m => [m.manholeName, m])
    );

    function placeNode(name, x, y, fromDirection = null) {
        if (nodeMap[name]) return; 
        const m = manholeDict[name];
        if (!m) return;
        nodes.push({
            id: name,
            position: { x, y },
            type: 'circle',
            data: { name: m.manholeName, rimElev: m.rimElev }
        });
        nodeMap[name] = { x, y };
        m.pipes?.forEach((p, i) => {
            if (!p.to || !DIRECTION_VEC[p.direction]) return;
            const [dx, dy] = DIRECTION_VEC[p.direction];
            let angleFactor = 1;
            const newX = x + dx * DIST * angleFactor;
            const newY = y + dy * DIST * angleFactor;
            edges.push({
                id: `${name}-${p.to}-${i}`,
                source: name,
                target: p.to,
                type: 'straight',
                markerEnd: { type: 'arrowclosed', color: '#d00' }
            });
            placeNode(p.to, newX, newY, p.direction);
        });
    }

    if (manholes.length) {
        placeNode(manholes[0].manholeName, 300, 200);
        manholes.forEach(m => {
            if (!nodeMap[m.manholeName]) {
                placeNode(m.manholeName, 80 + Math.random() * 120, 350 + Math.random() * 80);
            }
        });
    }

    return { nodes, edges };
}








export default function FlowDemo({ manholes }) {


    // generate nodes and edges
    const { nodes, edges } = useMemo(() => autoLayoutManholes(manholes), [manholes]);
    console.log(edges);

    const nodeTypes = { circle: CustomNode };
    const edgeTypes = { straight: StraightEdge };



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
