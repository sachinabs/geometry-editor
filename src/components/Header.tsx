import { useGeometryStore } from '../store/useGeometryStore';

export function Header() {
  const undo = useGeometryStore((s) => s.undo);
  const redo = useGeometryStore((s) => s.redo);
  const loadExample = useGeometryStore((s) => s.loadExample);
  const clearAll = useGeometryStore((s) => s.clearAll);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#16213e',
        padding: '10px 14px',
        borderBottom: '1px solid #0f3460',
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg,#0ea5a9,#14b8a6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: 16, color: '#e2e8f0', margin: 0 }}>Geometry Editor</h1>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <HeaderBtn onClick={undo} label="Undo" />
        <HeaderBtn onClick={redo} label="Redo" />
        <HeaderBtn onClick={loadExample} label="Example" />
        <HeaderBtn onClick={clearAll} label="Clear" danger />
      </div>
    </div>
  );
}

function HeaderBtn({ onClick, label, danger }: { onClick: () => void; label: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 6,
        border: 'none',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        background: danger ? '#3b1a1a' : '#1e3a5f',
        color: danger ? '#f87171' : '#94a3b8',
      }}
    >
      {label}
    </button>
  );
}

function ActionButton({
  onClick,
  label,
  shortcut,
  danger,
}: {
  onClick: () => void;
  label: string;
  shortcut: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 6,
        border: 'none',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        background: danger ? '#3b1a1a' : '#1e3a5f',
        color: danger ? '#f87171' : '#94a3b8',
      }}
    >
      {label}
    </button>
  );
}
