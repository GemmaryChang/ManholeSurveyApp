import React from 'react';
import { Handle, Position } from 'reactflow';


const directionPositionStyle = {
  N:  { left: '50%', top: '-28px', transform: 'translateX(-50%)' },
  NE: { left: '100%', top: '-20px' },
  E:  { left: '100%', top: '50%', transform: 'translateY(-50%)' },
  SE: { left: '100%', bottom: '-20px' },
  S:  { left: '50%', bottom: '-28px', transform: 'translateX(-50%)' },
  SW: { right: '100%', bottom: '-20px' },
  W:  { right: '100%', top: '50%', transform: 'translateY(-50%)' },
  NW: { right: '100%', top: '-20px' },
};

export default function CustomCircleNode({ data }) {
    const infoStyle = {
    position: 'absolute',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    fontSize: 13,
    fontWeight: 600,
    ...directionPositionStyle[data.direction || 'E'], // 默认E
  };
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      minWidth: 130, // 右边有空间
      height: 60,
      background: 'transparent',
    }}>
      {/* 圆形本体（只显示线） */}
      <div style={{
        width: 60, height: 60, borderRadius: '50%', border: '2px solid #888',
        background: '#f8f9fa', position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <svg width={60} height={60} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          <line x1="10" y1="50" x2="50" y2="10" stroke="#555" strokeWidth="2" />
        </svg>
        <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
        <Handle type="source" position={Position.Bottom} style={{ background: '#d00' }} />
      </div>
      {/* 圆右侧信息 */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        marginLeft: 12, // 和圆的间距
        fontSize: 13,
        minWidth: 60,
      }}>
        <div style={{ fontWeight: 600 }}>{data.name || data.label}</div>
        <div style={{ color: '#444', fontSize: 12 }}>Rim: {data.rimElev}</div>
      </div>
    </div>
  );
}
