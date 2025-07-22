import React from 'react';
import { Handle, Position } from 'reactflow';

export default function CustomCircleNode({ data }) {
  return (
    <div style={{
      width: 60, height: 60, borderRadius: '50%', border: '2px solid #888',
      background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 500, textAlign: 'center', boxShadow: '0 1px 5px #ccc'
    }}>
        <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      {/* 下边输出 handle */}
      <Handle type="source" position={Position.Bottom} style={{ background: '#d00' }} />
      <div>
        {data.label}
      </div>
    </div>
  );
}
