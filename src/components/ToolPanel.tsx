import type { Tool } from '../types';
import { useGeometryStore } from '../store/useGeometryStore';

interface ToolDef {
  id: Tool;
  label: string;
  desc: string;
  shortcut: string;
  svg: JSX.Element;
}

const tools: (ToolDef | 'divider' | 'section')[] = [
  {
    id: 'ruler',
    label: 'Ruler',
    desc: 'Draw straight lines',
    shortcut: '1',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <path d="M2 12h20M2 12l4-4M2 12l4 4M22 12l-4-4M22 12l-4 4" />
        <path d="M6 8v8M10 8v8M14 8v8M18 8v8" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'protractor',
    label: 'Protractor',
    desc: 'Draw angles & rays',
    shortcut: '2',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <path d="M12 22C6.5 22 2 17.5 2 12h20c0 5.5-4.5 10-10 10z" />
        <path d="M12 12l7-7" />
        <path d="M12 12V2" />
        <circle cx="12" cy="12" r="2" fill="#94a3b8" />
      </svg>
    ),
  },
  {
    id: 'compass',
    label: 'Compass',
    desc: 'Draw arcs & circles',
    shortcut: '3',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <path d="M12 2L8 22M12 2l4 20" />
        <circle cx="12" cy="2" r="2" />
      </svg>
    ),
  },
  {
    id: 'point',
    label: 'Point',
    desc: 'Mark a point',
    shortcut: '4',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    id: 'text',
    label: 'Text',
    desc: 'Add text labels',
    shortcut: '5',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <path d="M4 7V4h16v3M9 20h6M12 4v16" />
      </svg>
    ),
  },
  'divider',
  'section' as const,
  {
    id: 'intersect',
    label: 'Intersection',
    desc: 'Find crossing points',
    shortcut: '6',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <path d="M4 4l16 16M20 4L4 20" />
      </svg>
    ),
  },
  'divider',
  'section' as const,
  {
    id: 'hand',
    label: 'Hand',
    desc: 'Pan the canvas',
    shortcut: '7',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <path d="M18 11V6a2 2 0 00-4 0v1M14 10V4a2 2 0 00-4 0v6M10 10V6a2 2 0 00-4 0v8c0 4.418 3.582 8 8 8h.5a7.5 7.5 0 005.5-12.5L16 4" />
      </svg>
    ),
  },
  {
    id: 'move',
    label: 'Move',
    desc: 'Drag points & labels',
    shortcut: '8',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" />
      </svg>
    ),
  },
  {
    id: 'eraser',
    label: 'Eraser',
    desc: 'Remove elements',
    shortcut: '9',
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <path d="M18 2l4 4-14 14H4v-4L18 2z" />
      </svg>
    ),
  },
];

const toolVisuals: Record<string, string> = {
  ruler: `<svg width="70" height="50" viewBox="0 0 70 50"><rect x="5" y="20" width="60" height="10" rx="2" fill="#94a3b8" opacity="0.6"/><line x1="15" y1="20" x2="15" y2="30" stroke="#1e293b" stroke-width="1"/><line x1="25" y1="20" x2="25" y2="30" stroke="#1e293b" stroke-width="1"/><line x1="35" y1="20" x2="35" y2="30" stroke="#1e293b" stroke-width="1"/><line x1="45" y1="20" x2="45" y2="30" stroke="#1e293b" stroke-width="1"/><line x1="55" y1="20" x2="55" y2="30" stroke="#1e293b" stroke-width="1"/></svg>`,
  protractor: `<svg width="70" height="50" viewBox="0 0 70 50"><path d="M35 45 C10 45 5 25 5 25 L65 25 C65 25 60 45 35 45Z" fill="none" stroke="#94a3b8" stroke-width="2"/><line x1="35" y1="45" x2="35" y2="10" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 2"/><path d="M35 35 L50 20" stroke="#94a3b8" stroke-width="1.5"/><circle cx="35" cy="45" r="3" fill="#94a3b8"/></svg>`,
  compass: `<svg width="70" height="50" viewBox="0 0 70 50"><path d="M35 5 L20 45" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><path d="M35 5 L50 45" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><circle cx="35" cy="5" r="3" fill="#94a3b8"/><circle cx="50" cy="45" r="2" fill="#64748b"/></svg>`,
  point: `<svg width="70" height="50" viewBox="0 0 70 50"><circle cx="35" cy="25" r="10" fill="#94a3b8" opacity="0.3"/><circle cx="35" cy="25" r="5" fill="#94a3b8"/></svg>`,
  text: `<svg width="70" height="50" viewBox="0 0 70 50"><text x="35" y="32" font-size="24" font-family="serif" font-weight="bold" fill="#94a3b8" text-anchor="middle">T</text></svg>`,
  intersect: `<svg width="70" height="50" viewBox="0 0 70 50"><line x1="10" y1="10" x2="60" y2="40" stroke="#94a3b8" stroke-width="2"/><line x1="60" y1="10" x2="10" y2="40" stroke="#94a3b8" stroke-width="2"/><circle cx="35" cy="25" r="5" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/></svg>`,
  move: `<svg width="70" height="50" viewBox="0 0 70 50"><path d="M35 5 L35 45" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/><path d="M5 25 L65 25" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/><circle cx="35" cy="25" r="4" fill="#94a3b8" opacity="0.3"/></svg>`,
  hand: `<svg width="70" height="50" viewBox="0 0 70 50"><path d="M35 10 L35 35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><path d="M25 15 L25 30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><path d="M45 15 L45 30" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/><path d="M20 25 Q20 40 35 42 Q50 40 50 25" fill="none" stroke="#94a3b8" stroke-width="2.5"/></svg>`,
  eraser: `<svg width="70" height="50" viewBox="0 0 70 50"><path d="M15 40 L30 15 L55 30 L40 50 Z" fill="#94a3b8" opacity="0.3" stroke="#94a3b8" stroke-width="2"/></svg>`,
};

export function ToolPanel() {
  const currentTool = useGeometryStore((s) => s.currentTool);
  const setTool = useGeometryStore((s) => s.setTool);
  const undo = useGeometryStore((s) => s.undo);
  const redo = useGeometryStore((s) => s.redo);
  const historyIndex = useGeometryStore((s) => s.historyIndex);
  const undoHistory = useGeometryStore((s) => s.undoHistory);

  return (
    <div
      style={{
        width: 210,
        background: '#16213e',
        borderRight: '1px solid #0f3460',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {tools.map((item, i) => {
        if (item === 'divider') {
          return <div key={'d' + i} style={{ height: 1, background: '#1e3a5f', margin: '4px 0' }} />;
        }
        if (item === 'section') {
          return (
            <div
              key={'s' + i}
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 6,
                marginTop: 4,
              }}
            >
              {i < 10 ? 'Drawing Tools' : i < 16 ? 'Analysis' : 'Navigation'}
            </div>
          );
        }
        const def = item as ToolDef;
        const active = currentTool === def.id;
        return (
          <button
            key={def.id}
            onClick={() => setTool(def.id)}
            style={{
              display: 'grid',
              gridTemplateColumns: '32px 1fr auto',
              alignItems: 'center',
              gap: 6,
              padding: '7px 8px',
              borderRadius: 8,
              border: `1px solid ${active ? '#0ea5a9' : '#1e3a5f'}`,
              background: active ? '#0d3030' : '#1a2744',
              cursor: 'pointer',
              transition: 'all 0.15s',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#1e293b',
              }}
            >
              {def.svg}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0' }}>{def.label}</div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>{def.desc}</div>
            </div>
            <span
              style={{
                fontSize: 9,
                color: active ? '#0ea5a9' : '#475569',
                background: active ? '#0d1117' : '#0d1117',
                padding: '1px 5px',
                borderRadius: 3,
                fontFamily: 'monospace',
                justifySelf: 'end',
              }}
            >
              {def.shortcut}
            </span>
          </button>
        );
      })}
      <div style={{ height: 1, background: '#1e3a5f', margin: '4px 0' }} />
      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 8,
            border: '1px solid #1e3a5f',
            background: historyIndex <= 0 ? '#1a2744' : '#0d3030',
            color: historyIndex <= 0 ? '#475569' : '#e2e8f0',
            cursor: historyIndex <= 0 ? 'not-allowed' : 'pointer',
            fontSize: 11,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 10h13a4 4 0 010 8H7" /><path d="M7 6l-4 4 4 4" />
          </svg>
          Undo
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= undoHistory.length - 1}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 8,
            border: '1px solid #1e3a5f',
            background: historyIndex >= undoHistory.length - 1 ? '#1a2744' : '#0d3030',
            color: historyIndex >= undoHistory.length - 1 ? '#475569' : '#e2e8f0',
            cursor: historyIndex >= undoHistory.length - 1 ? 'not-allowed' : 'pointer',
            fontSize: 11,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10H8a4 4 0 000 8h9" /><path d="M17 6l4 4-4 4" />
          </svg>
          Redo
        </button>
      </div>
    </div>
  );
}

export function ToolVisual() {
  const currentTool = useGeometryStore((s) => s.currentTool);
  return (
    <div
      style={{
        padding: 10,
        background: '#0d1117',
        borderRadius: 7,
        textAlign: 'center',
        minHeight: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      dangerouslySetInnerHTML={{ __html: toolVisuals[currentTool] || '' }}
    />
  );
}
