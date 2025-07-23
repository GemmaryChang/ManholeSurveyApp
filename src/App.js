import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import FlowDemo from './FlowDemo';

// Utility: Calculate Invert
function calcInvert(rimElev, depth) {
  const rim = parseFloat(rimElev);
  const dep = parseFloat(depth);
  if (isNaN(rim) || isNaN(dep)) return '';
  return (rim - dep).toFixed(3);
}

function App() {
  const [manholes, setManholes] = useState([]);
  const [manholeName, setManholeName] = useState('');

  const [pointNo, setPointNo] = useState('');
  const [rimElev, setRimElev] = useState('');

  const emptyPipe = { direction: '', depth: '', to: '' };

  const [pipes, setPipes] = useState([{ ...emptyPipe }]);


  // Add a pipe field
  function addPipeField() {
    setPipes([...pipes, { ...emptyPipe }]);
  }

  // Remove a pipe field
  function removePipeField(idx) {
    setPipes(pipes.filter((_, i) => i !== idx));
  }

  // Update pipe data
  function updatePipe(idx, field, value) {
    setPipes(pipes.map((pipe, i) =>
      i === idx ? { ...pipe, [field]: value } : pipe
    ));
  }

  // Handle Add Manhole
  function handleAddManhole(e) {
    e.preventDefault();
    setManholes([
      ...manholes,
      {
        manholeName,
        pointNo,
        rimElev,
        pipes: pipes.filter(p => p.direction || p.depth || p.to),
      },
    ]);
    setManholeName('');
    setPointNo('');
    setRimElev('');
    setPipes([{ ...emptyPipe }]);
  }

  // Add new empty manhole (reset fields)
  function newManhole() {
    setManholeName('');
    setPointNo('');
    setRimElev('');
    setPipes([{ ...emptyPipe }]);
  }


  function updateTablePipe(mi, pi, field, value) {
    setManholes(ms =>
      ms.map((m, i) =>
        i !== mi ? m : {
          ...m,
          pipes: m.pipes.map((p, j) =>
            j !== pi ? p : { ...p, [field]: value }
          )
        }
      )
    );
  }

  // 这里是manhole主字段inline编辑
  function updateManhole(mi, field, value) {
    setManholes(ms =>
      ms.map((m, i) =>
        i !== mi ? m : { ...m, [field]: value }
      )
    );
  }


  

  // Export to CSV
  function exportCSV() {
    const rows = [
      ['Manhole Name', 'Point No', 'Rim Elev', 'Direction', 'Depth', 'To', 'Invert'],
    ];
    manholes.forEach(m =>
      m.pipes.forEach(p =>
        rows.push([
          m.manholeName,
          m.pointNo,
          m.rimElev,
          // p.pipeLabel,
          // p.pipeType,
          p.direction,
          // p.angle,
          p.depth,
          p.to,
          calcInvert(m.rimElev, p.depth),
        ])
      )
    );
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'manhole_survey.csv');
  }

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Manhole Survey App</h2>
      <form onSubmit={handleAddManhole} style={{ marginBottom: 30, border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ marginRight: 20 }}>
            <b>Manhole Name:</b>
            <input
              required
              value={manholeName}
              onChange={e => setManholeName(e.target.value)}
              style={{ marginLeft: 10, width: 80 }}
              autoFocus
            />
          </label>
          <label>
            <b>Point No:</b>
            <input
              required
              value={pointNo}
              onChange={e => setPointNo(e.target.value)}
              style={{ marginLeft: 10, width: 80 }}
            />
          </label>
          <label style={{ marginLeft: 20 }}>
            <b>Rim Elev:</b>
            <input
              required
              value={rimElev}
              onChange={e => setRimElev(e.target.value)}
              style={{ marginLeft: 10, width: 80 }}
            />
          </label>
        </div>
        <div>
          <b>Pipes:</b>
          {pipes.map((pipe, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              
              <input
                placeholder="Direction"
                value={pipe.direction}
                style={{ width: 65, marginRight: 8 }}
                onChange={e => updatePipe(idx, 'direction', e.target.value)}
              />
           
              <input
                placeholder="Depth"
                value={pipe.depth}
                style={{ width: 50, marginRight: 8 }}
                onChange={e => updatePipe(idx, 'depth', e.target.value)}
              />
              <input
                placeholder="To Manhole"
                value={pipe.to}
                style={{ width: 90, marginRight: 8 }}
                onChange={e => updatePipe(idx, 'to', e.target.value)}
              />
              {pipes.length > 1 && (
                <button type="button" onClick={() => removePipeField(idx)} style={{ marginRight: 8 }}>-</button>
              )}
              {idx === pipes.length - 1 && (
                <button type="button" onClick={addPipeField} title="Add Pipe" style={{ fontWeight: 'bold', fontSize: 18, width: 32, height: 32, padding: 0 }}>+</button>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit" style={{ marginRight: 12 }}>Add Manhole</button>
          <button type="button" onClick={newManhole}>New Manhole</button>
        </div>
      </form>

      <h3>Survey Data</h3>
      <table border="1" cellPadding="4" style={{ width: '100%', marginBottom: 15 }}>
        <thead>
          <tr>
            <th>Manhole Name</th>
            <th>Point No</th>
            <th>Rim Elev</th>

            <th>Direction</th>
            <th>Depth</th>
            <th>To</th>
            <th>Invert</th>
          </tr>
        </thead>
        <tbody>
          {manholes.length === 0 && (
            <tr><td colSpan={10} style={{ textAlign: 'center' }}>No data yet</td></tr>
          )}
          {manholes.map((m, mi) =>
            m.pipes.map((p, pi) => (
              <tr key={`${mi}-${pi}`}>
                <td>
                  <input value={m.manholeName} style={{ width: 60 }}
                    onChange={e => updateManhole(mi, 'manholeName', e.target.value)} />
                </td>
                <td>
                  <input value={m.pointNo} style={{ width: 40 }}
                    onChange={e => updateManhole(mi, 'pointNo', e.target.value)} />
                </td>
                <td>
                  <input value={m.rimElev} style={{ width: 60 }}
                    onChange={e => updateManhole(mi, 'rimElev', e.target.value)} />
                </td>
                <td>
                  <input value={p.direction} style={{ width: 50 }}
                    onChange={e => updateTablePipe(mi, pi, 'direction', e.target.value)} />
                </td>
                <td>
                  <input value={p.depth} style={{ width: 40 }}
                    onChange={e => updateTablePipe(mi, pi, 'depth', e.target.value)} />
                </td>
                <td>
                  <input value={p.to} style={{ width: 60 }}
                    onChange={e => updateTablePipe(mi, pi, 'to', e.target.value)} />
                </td>
                <td>
                  {calcInvert(m.rimElev, p.depth)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button onClick={exportCSV} disabled={manholes.length === 0}>Export CSV</button>
      <FlowDemo manholes={manholes} />
    </div>
  );
}

export default App;
