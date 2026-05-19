import { useState, useRef, useEffect } from 'react';
import { useGeometryStore } from '../store/useGeometryStore';

interface TextInputOverlayProps {
  position: { x: number; y: number } | null;
  editId: string | null;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export function TextInputOverlay({ position, editId, onSubmit, onCancel }: TextInputOverlayProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (position) {
      setValue('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [position]);

  if (!position) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit(value);
    }
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x - 110,
        top: position.y - 50,
        background: '#16213e',
        border: '2px solid #38bdf8',
        borderRadius: 10,
        padding: 14,
        zIndex: 200,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>
        {editId ? 'Edit text' : 'Enter text'}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type here..."
        style={{
          width: 200,
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #1e3a5f',
          background: '#0d1117',
          color: '#e2e8f0',
          fontSize: 14,
          outline: 'none',
        }}
      />
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        <button
          onClick={() => onSubmit(value)}
          style={{
            flex: 1,
            padding: '7px',
            borderRadius: 6,
            border: 'none',
            background: '#0ea5a9',
            color: 'white',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Add
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '7px',
            borderRadius: 6,
            border: '1px solid #1e3a5f',
            background: 'transparent',
            color: '#94a3b8',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
