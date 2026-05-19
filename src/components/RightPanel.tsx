import { useRef } from 'react';
import { useGeometryStore } from '../store/useGeometryStore';
import { ToolVisual } from './ToolPanel';
import type { KeyBindings } from '../GeometryEditor';

interface RightPanelProps {
  onExportSVG: () => void;
  onExportJSON: () => void;
  onExportPNG: () => void;
  keyBindings: KeyBindings;
}

const toolNames: Record<string, string> = {
  ruler: 'Ruler',
  protractor: 'Protractor',
  compass: 'Compass',
  point: 'Point',
  text: 'Text',
  intersect: 'Intersection',
  hand: 'Hand',
  move: 'Move',
  eraser: 'Eraser',
};

export function RightPanel({ onExportSVG, onExportJSON, onExportPNG, keyBindings }: RightPanelProps) {
  const findIntersectionsAction = useGeometryStore((s) => s.findIntersectionsAction);
  const completeFullCircle = useGeometryStore((s) => s.completeFullCircle);
  const importJSON = useGeometryStore((s) => s.importJSON);
  const statusMessage = useGeometryStore((s) => s.statusMessage);
  const statusIsError = useGeometryStore((s) => s.statusIsError);
  const steps = useGeometryStore((s) => s.steps);
  const selection = useGeometryStore((s) => s.selection);
  const currentTool = useGeometryStore((s) => s.currentTool);
  const playbackActive = useGeometryStore((s) => s.playbackActive);
  const playbackStep = useGeometryStore((s) => s.playbackStep);
  const setPlaybackActive = useGeometryStore((s) => s.setPlaybackActive);
  const setPlaybackStep = useGeometryStore((s) => s.setPlaybackStep);
  const setStatus = useGeometryStore((s) => s.setStatus);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const startPlayback = () => {
    if (steps.length === 0) return;
    setPlaybackActive(true);
    setPlaybackStep(-1);
    let step = -1;
    const tick = () => {
      step++;
      if (step >= steps.length) {
        stopPlayback();
        return;
      }
      setPlaybackStep(step);
      setStatus(`Step ${step + 1}: ${steps[step].text}`);
      setTimeout(tick, 1800);
    };
    setTimeout(tick, 800);
  };

  const stopPlayback = () => {
    setPlaybackActive(false);
    setPlaybackStep(-1);
    setStatus('Stopped');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as string;
      importJSON(data);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const reverseKeys: { action: string; keys: string[] }[] = [];
  const seen = new Set<string>();
  for (const [key, action] of Object.entries(keyBindings)) {
    if (seen.has(action)) continue;
    seen.add(action);
    const allKeys = Object.entries(keyBindings)
      .filter(([, a]) => a === action)
      .map(([k]) => k);
    reverseKeys.push({ action, keys: allKeys });
  }

  return (
    <div
      style={{
        width: 260,
        background: '#16213e',
        borderLeft: '1px solid #0f3460',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 12,
        overflowY: 'auto',
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      <PanelCard title="Actions">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <ActionBtn label="Find Intersections" primary onClick={findIntersectionsAction} />
          {currentTool === 'compass' && selection.length === 2 && (
            <ActionBtn label="Draw Full Circle" onClick={completeFullCircle} />
          )}
          <ActionBtn label="Export SVG" onClick={onExportSVG} />
          <ActionBtn label="Export PNG" onClick={onExportPNG} />
          <ActionBtn label="Save JSON" onClick={onExportJSON} />
          <ActionBtn label="Load JSON" onClick={() => fileInputRef.current?.click()} />
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>
      </PanelCard>

      <PanelCard title="Current Tool">
        <ToolVisual />
        <div
          style={{
            padding: 8,
            borderRadius: 7,
            fontSize: 11,
            marginTop: 10,
            background: statusIsError ? '#3b1a1a' : '#0d3030',
            color: statusIsError ? '#f87171' : '#5eead4',
            textAlign: 'center',
          }}
        >
          {statusMessage}
        </div>
      </PanelCard>

      <PanelCard title="Keyboard Shortcuts">
        {reverseKeys.map(({ action, keys }) => {
          const label = toolNames[action] || action.charAt(0).toUpperCase() + action.slice(1);
          return <ShortcutRow key={action} label={label} value={keys.join(' / ')} />;
        })}
        <ShortcutRow label="Hand (temp)" value="Space" />
        <ShortcutRow label="Undo" value="Ctrl+Z" />
        <ShortcutRow label="Redo" value="Ctrl+Shift+Z / Ctrl+Y" />
        <ShortcutRow label="Select All" value="Ctrl+A" />
        <ShortcutRow label="Nudge" value="Arrows (Shift=10x)" />
        <ShortcutRow label="Constrain" value="Shift" />
        <ShortcutRow label="Pan" value="Middle-click / Alt+drag" />
      </PanelCard>

      {steps.length > 0 && (
        <PanelCard title="Construction Steps">
          <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
            {!playbackActive && (
              <button
                onClick={startPlayback}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#3b3510',
                  color: '#fbbf24',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </button>
            )}
            {playbackActive && (
              <button
                onClick={stopPlayback}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: 6,
                  border: 'none',
                  background: '#1e3a5f',
                  color: '#94a3b8',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h12v12H6z" />
                </svg>
                Stop
              </button>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              maxHeight: 250,
              overflowY: 'auto',
            }}
          >
            {steps.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 8,
                  padding: 7,
                  borderRadius: 5,
                  background: playbackActive && i === playbackStep ? '#0d3030' : '#0d1117',
                  border: playbackActive && i === playbackStep ? '1px solid #0ea5a9' : 'none',
                  color: playbackActive && i <= playbackStep ? '#e2e8f0' : '#94a3b8',
                  opacity: playbackActive && i > playbackStep ? 0.3 : 1,
                  fontSize: 11,
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: playbackActive && i === playbackStep ? '#10b981' : '#0ea5a9',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {s.num}
                </div>
                <div>{s.text}</div>
              </div>
            ))}
          </div>
        </PanelCard>
      )}
    </div>
  );
}

function PanelCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#1a2744',
        borderRadius: 10,
        border: '1px solid #1e3a5f',
        padding: 14,
      }}
    >
      <h3 style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: 0, marginBottom: 10 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ActionBtn({
  label,
  primary,
  onClick,
}: {
  label: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: 9,
        borderRadius: 7,
        border: 'none',
        fontSize: 12,
        fontWeight: 500,
        cursor: 'pointer',
        background: primary ? '#0ea5a9' : '#1e3a5f',
        color: primary ? 'white' : '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      {label}
    </button>
  );
}

function ShortcutRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 11,
        color: '#94a3b8',
        gap: 4,
      }}
    >
      <span>{label}</span>
      <span style={{ color: '#64748b' }}>{value}</span>
    </div>
  );
}
