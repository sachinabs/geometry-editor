import { useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { Header } from './components/Header';
import { ToolPanel } from './components/ToolPanel';
import { CanvasView } from './components/CanvasView';
import { RightPanel } from './components/RightPanel';
import { useGeometryStore } from './store/useGeometryStore';
import { exportSVG } from './utils/renderer';
import type { Tool, StepData, PointData, LineData, RayData, ArcData, TextData } from './types';

export interface KeyBindings {
  [key: string]: string;
}

export interface EditorData {
  points: PointData[];
  lines: LineData[];
  rays: RayData[];
  arcs: ArcData[];
  texts: TextData[];
  steps: StepData[];
}

export interface ExportHandle {
  toSVG: () => string;
  toJSON: () => string;
  toPNG: () => Promise<string>;
}

export interface GeometryEditorProps {
  className?: string;
  style?: React.CSSProperties;
  showHeader?: boolean;
  showToolPanel?: boolean;
  showRightPanel?: boolean;
  showInstructionBar?: boolean;
  keyBindings?: KeyBindings;
  onExportSVG?: (svg: string) => void;
  onExportJSON?: (data: string) => void;
  onExportPNG?: (dataUrl: string) => void;
  onStepsChange?: (steps: StepData[]) => void;
  onDataChange?: (data: EditorData) => void;
}

const toolList: Tool[] = ['ruler', 'protractor', 'compass', 'point', 'text', 'intersect', 'hand', 'move', 'eraser'];

const defaultKeyBindings: KeyBindings = {
  '1': 'ruler',
  '2': 'protractor',
  '3': 'compass',
  '4': 'point',
  '5': 'text',
  '6': 'intersect',
  '7': 'hand',
  '8': 'move',
  '9': 'eraser',
  '=': 'zoomIn',
  '+': 'zoomIn',
  '-': 'zoomOut',
  '_': 'zoomOut',
  '0': 'zoomReset',
  'Delete': 'delete',
  'Backspace': 'delete',
  'Escape': 'clearSelection',
};

export const GeometryEditor = forwardRef<ExportHandle, GeometryEditorProps>(function GeometryEditor(
  {
    className,
    style,
    showHeader = true,
    showToolPanel = true,
    showRightPanel = true,
    showInstructionBar = true,
    keyBindings: userKeyBindings,
    onExportSVG,
    onExportJSON,
    onExportPNG,
    onStepsChange,
    onDataChange,
  },
  ref
) {
  const setTool = useGeometryStore((s) => s.setTool);
  const undo = useGeometryStore((s) => s.undo);
  const redo = useGeometryStore((s) => s.redo);
  const selectAll = useGeometryStore((s) => s.selectAll);
  const deleteSelected = useGeometryStore((s) => s.deleteSelected);
  const clearSelectedIds = useGeometryStore((s) => s.clearSelectedIds);
  const clearSelection = useGeometryStore((s) => s.clearSelection);

  const spacePressed = useRef(false);
  const previousTool = useRef<Tool | null>(null);

  const mergedKeys = { ...defaultKeyBindings, ...userKeyBindings };

  const resolveKeyAction = useCallback(
    (e: KeyboardEvent): string | null => {
      const key = e.key;
      if (e.ctrlKey || e.metaKey) {
        if ((key === 'z' || key === 'Z') && !e.shiftKey) return 'undo';
        if ((key === 'z' || key === 'Z') && e.shiftKey) return 'redo';
        if (key === 'y' || key === 'Y') return 'redo';
        if (key === 'a' || key === 'A') return 'selectAll';
        return null;
      }
      return mergedKeys[key] || null;
    },
    [mergedKeys]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Shift') return;

      if (e.key === ' ' && !spacePressed.current) {
        e.preventDefault();
        spacePressed.current = true;
        previousTool.current = useGeometryStore.getState().currentTool;
        useGeometryStore.setState({ currentTool: 'hand' });
        return;
      }

      const action = resolveKeyAction(e);
      if (!action) return;
      e.preventDefault();

      switch (action) {
        case 'undo':
          undo();
          break;
        case 'redo':
          redo();
          break;
        case 'selectAll':
          selectAll();
          break;
        case 'delete':
          deleteSelected();
          break;
        case 'clearSelection':
          clearSelectedIds();
          clearSelection();
          break;
        case 'zoomIn':
          break;
        case 'zoomOut':
          break;
        case 'zoomReset':
          break;
        case 'hand':
          if (!spacePressed.current) {
            spacePressed.current = true;
            previousTool.current = useGeometryStore.getState().currentTool;
            useGeometryStore.setState({ currentTool: 'hand' });
          }
          break;
        default:
          if (toolList.includes(action as Tool)) {
            setTool(action as Tool);
          }
      }
    },
    [resolveKeyAction, setTool, undo, redo, selectAll, deleteSelected, clearSelectedIds, clearSelection]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === ' ' && spacePressed.current) {
      spacePressed.current = false;
      if (previousTool.current) {
        useGeometryStore.setState({ currentTool: previousTool.current });
        previousTool.current = null;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    useGeometryStore.getState().pushSnapshot();
  }, []);

  useEffect(() => {
    const unsub = useGeometryStore.subscribe((s) => {
      onStepsChange?.(s.steps);
      onDataChange?.({ points: s.points, lines: s.lines, rays: s.rays, arcs: s.arcs, texts: s.texts, steps: s.steps });
    });
    return unsub;
  }, [onStepsChange, onDataChange]);

  const getSVGString = useCallback(() => {
    const s = useGeometryStore.getState();
    return exportSVG(s.points, s.lines, s.rays, s.arcs);
  }, []);

  const getJSON = useCallback(() => {
    return useGeometryStore.getState().exportJSON();
  }, []);

  const getPNG = useCallback(async (): Promise<string> => {
    const svgStr = getSVGString();
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('No canvas context')); return; }
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
    });
  }, [getSVGString]);

  useImperativeHandle(ref, () => ({
    toSVG: getSVGString,
    toJSON: getJSON,
    toPNG: getPNG,
  }), [getSVGString, getJSON, getPNG]);

  const triggerExportSVG = useCallback(() => {
    const svg = getSVGString();
    onExportSVG?.(svg);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'geometry.svg';
    a.click();
    useGeometryStore.getState().setStatus('SVG exported!');
  }, [getSVGString, onExportSVG]);

  const triggerExportJSON = useCallback(() => {
    const data = getJSON();
    onExportJSON?.(data);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'geometry.json';
    a.click();
    useGeometryStore.getState().setStatus('JSON saved!');
  }, [getJSON, onExportJSON]);

  const triggerExportPNG = useCallback(async () => {
    try {
      const dataUrl = await getPNG();
      onExportPNG?.(dataUrl);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'geometry.png';
      a.click();
      useGeometryStore.getState().setStatus('PNG exported!');
    } catch {
      useGeometryStore.getState().setStatus('PNG export failed', true);
    }
  }, [getPNG, onExportPNG]);

  return (
    <div
      className={className}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: '#1a1a2e',
        overflow: 'hidden',
        ...style,
      }}
    >
      {showHeader && <Header />}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {showToolPanel && <ToolPanel />}
        <CanvasView showInstructionBar={showInstructionBar} />
        {showRightPanel && (
          <RightPanel
            onExportSVG={triggerExportSVG}
            onExportJSON={triggerExportJSON}
            onExportPNG={triggerExportPNG}
            keyBindings={mergedKeys}
          />
        )}
      </div>
    </div>
  );
});
