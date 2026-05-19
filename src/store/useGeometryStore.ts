import { create } from 'zustand';
import type {
  Tool,
  PointData,
  LineData,
  RayData,
  ArcData,
  TextData,
  IntersectionData,
  StepData,
  Snapshot,
  CompassSelection,
} from '../types';
import { getNextLabel } from '../utils/geometry';
import { findIntersections } from '../utils/renderer';
import { exportSVG } from '../utils/renderer';

function renumberSteps(steps: StepData[]): StepData[] {
  return steps.map((s, i) => ({ ...s, num: i + 1 }));
}

const MAX_HISTORY = 50;

interface GeometryState {
  currentTool: Tool;
  points: PointData[];
  lines: LineData[];
  rays: RayData[];
  arcs: ArcData[];
  texts: TextData[];
  intersections: IntersectionData[];
  steps: StepData[];
  selection: (PointData | CompassSelection)[];
  selectedIds: Set<string>;
  labelCounter: number;
  stepCounter: number;
  labelPositions: Record<string, { x: number; y: number }>;
  undoHistory: Snapshot[];
  historyIndex: number;
  playbackActive: boolean;
  playbackStep: number;
  statusMessage: string;
  statusIsError: boolean;

  setTool: (tool: Tool) => void;
  addPoint: (pt: PointData) => void;
  addLine: (line: LineData) => void;
  addRay: (ray: RayData) => void;
  addArc: (arc: ArcData) => void;
  addText: (text: TextData) => void;
  setSelection: (sel: (PointData | CompassSelection)[]) => void;
  clearSelection: () => void;
  addToSelectedIds: (id: string) => void;
  toggleSelectedId: (id: string) => void;
  clearSelectedIds: () => void;
  setSelectedIds: (ids: Set<string>) => void;
  addStep: (text: string, elementIds?: string[]) => number;
  pushSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  deleteSelected: () => void;
  selectAll: () => void;
  findIntersectionsAction: () => void;
  completeFullCircle: () => void;
  updatePoint: (id: string, x: number, y: number) => void;
  updateText: (id: string, content: string) => void;
  updateTextPosition: (id: string, x: number, y: number) => void;
  setLabelPosition: (id: string, pos: { x: number; y: number }) => void;
  setStatus: (msg: string, isError?: boolean) => void;
  setPlaybackActive: (v: boolean) => void;
  setPlaybackStep: (v: number) => void;
  clearAll: () => void;
  loadExample: () => void;
  exportSVGAction: () => void;
  exportJSON: () => string;
  importJSON: (data: string) => void;
}

export const useGeometryStore = create<GeometryState>((set, get) => ({
  currentTool: 'ruler',
  points: [],
  lines: [],
  rays: [],
  arcs: [],
  texts: [],
  intersections: [],
  steps: [],
  selection: [],
  selectedIds: new Set(),
  labelCounter: 0,
  stepCounter: 0,
  labelPositions: {},
  undoHistory: [],
  historyIndex: -1,
  playbackActive: false,
  playbackStep: -1,
  statusMessage: 'Ready to draw',
  statusIsError: false,

  setTool: (tool) => {
    set({
      currentTool: tool,
      selection: [],
      selectedIds: new Set(),
      statusMessage: `Selected: ${tool.charAt(0).toUpperCase() + tool.slice(1)}`,
      statusIsError: false,
    });
  },

  addPoint: (pt) => set((s) => ({ points: [...s.points, pt] })),

  addLine: (line) => set((s) => ({ lines: [...s.lines, line] })),

  addRay: (ray) => set((s) => ({ rays: [...s.rays, ray] })),

  addArc: (arc) => set((s) => ({ arcs: [...s.arcs, arc] })),

  addText: (text) => set((s) => ({ texts: [...s.texts, text] })),

  setSelection: (sel) => set({ selection: sel }),

  clearSelection: () => set({ selection: [] }),

  addToSelectedIds: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      next.add(id);
      return { selectedIds: next };
    }),

  toggleSelectedId: (id) =>
    set((s) => {
      const next = new Set(s.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),

  clearSelectedIds: () => set({ selectedIds: new Set() }),

  setSelectedIds: (ids) => set({ selectedIds: ids }),

  addStep: (text, elementIds) => {
    const s = get();
    if (text.toLowerCase().startsWith('erased')) return -1;
    const stepCounter = s.stepCounter + 1;
    const si = s.steps.length;
    set({ stepCounter, steps: [...s.steps, { num: stepCounter, text, elementIds }] });
    return si;
  },

  pushSnapshot: () => {
    const s = get();
    const snap: Snapshot = {
      points: JSON.parse(JSON.stringify(s.points)),
      lines: JSON.parse(JSON.stringify(s.lines)),
      rays: JSON.parse(JSON.stringify(s.rays)),
      arcs: JSON.parse(JSON.stringify(s.arcs)),
      texts: JSON.parse(JSON.stringify(s.texts)),
      steps: JSON.parse(JSON.stringify(s.steps)),
      labelPositions: JSON.parse(JSON.stringify(s.labelPositions)),
      labelCounter: s.labelCounter,
      stepCounter: s.stepCounter,
    };
    set((st) => {
      const history = st.undoHistory.slice(0, st.historyIndex + 1);
      history.push(snap);
      if (history.length > MAX_HISTORY) history.shift();
      return { undoHistory: history, historyIndex: history.length - 1 };
    });
  },

  undo: () => {
    const s = get();
    if (s.historyIndex <= 0) return;
    const idx = s.historyIndex - 1;
    const snap = s.undoHistory[idx];
    if (!snap) return;
    set({
      points: JSON.parse(JSON.stringify(snap.points)),
      lines: JSON.parse(JSON.stringify(snap.lines)),
      rays: JSON.parse(JSON.stringify(snap.rays)),
      arcs: JSON.parse(JSON.stringify(snap.arcs)),
      texts: JSON.parse(JSON.stringify(snap.texts)),
      steps: JSON.parse(JSON.stringify(snap.steps)),
      labelPositions: JSON.parse(JSON.stringify(snap.labelPositions)),
      labelCounter: snap.labelCounter,
      stepCounter: snap.stepCounter,
      selectedIds: new Set(),
      historyIndex: idx,
      statusMessage: 'Undo',
      statusIsError: false,
    });
  },

  redo: () => {
    const s = get();
    if (s.historyIndex >= s.undoHistory.length - 1) return;
    const idx = s.historyIndex + 1;
    const snap = s.undoHistory[idx];
    if (!snap) return;
    set({
      points: JSON.parse(JSON.stringify(snap.points)),
      lines: JSON.parse(JSON.stringify(snap.lines)),
      rays: JSON.parse(JSON.stringify(snap.rays)),
      arcs: JSON.parse(JSON.stringify(snap.arcs)),
      texts: JSON.parse(JSON.stringify(snap.texts)),
      steps: JSON.parse(JSON.stringify(snap.steps)),
      labelPositions: JSON.parse(JSON.stringify(snap.labelPositions)),
      labelCounter: snap.labelCounter,
      stepCounter: snap.stepCounter,
      selectedIds: new Set(),
      historyIndex: idx,
      statusMessage: 'Redo',
      statusIsError: false,
    });
  },

  deleteSelected: () => {
    const s = get();
    if (s.selectedIds.size === 0) return;
    const idsToDelete = new Set(s.selectedIds);
    const orphanedPoints = new Set<string>();

    s.lines
      .filter((l) => idsToDelete.has(l.id))
      .forEach((l) => {
        orphanedPoints.add(l.a);
        orphanedPoints.add(l.b);
      });
    s.rays
      .filter((r) => idsToDelete.has(r.id))
      .forEach((r) => {
        orphanedPoints.add(r.from);
        orphanedPoints.add(r.to);
      });
    s.arcs
      .filter((a) => idsToDelete.has(a.id))
      .forEach((a) => {
        if (a.center && a.center.id) orphanedPoints.add(a.center.id);
      });

    const allToDelete = new Set([...idsToDelete, ...orphanedPoints]);

    const count = idsToDelete.size;
    const filteredSteps = renumberSteps(
      s.steps.filter((st) => !st.elementIds || !st.elementIds.some(id => allToDelete.has(id)))
    );

    const fp = s.points.filter((p) => !allToDelete.has(p.id));
    const fl = s.lines.filter((l) => !idsToDelete.has(l.id) && !idsToDelete.has(l.a) && !idsToDelete.has(l.b));
    const fr = s.rays.filter((r) => !idsToDelete.has(r.id) && !idsToDelete.has(r.from) && !idsToDelete.has(r.to));
    const fa = s.arcs.filter((a) => !idsToDelete.has(a.id) && !(a.center && idsToDelete.has(a.center.id)));
    const ft = s.texts.filter((t) => !idsToDelete.has(t.id));

    const hasElementIds = filteredSteps.some((st) => st.elementIds && st.elementIds.length > 0);
    set({
      points: fp,
      lines: fl,
      rays: fr,
      arcs: fa,
      texts: ft,
      steps: filteredSteps,
      stepCounter: filteredSteps.length,
      ...(hasElementIds
        ? (() => {
            const elemToStep = new Map<string, number>();
            filteredSteps.forEach((st, idx) => {
              if (st.elementIds) st.elementIds.forEach((id) => elemToStep.set(id, idx));
            });
            return {
              points: fp.map((p) => ({ ...p, stepIndex: elemToStep.get(p.id) })),
              lines: fl.map((l) => ({ ...l, stepIndex: elemToStep.get(l.id) })),
              rays: fr.map((r) => ({ ...r, stepIndex: elemToStep.get(r.id) })),
              arcs: fa.map((a) => ({ ...a, stepIndex: elemToStep.get(a.id) })),
              texts: ft.map((t) => ({ ...t, stepIndex: elemToStep.get(t.id) })),
            };
          })()
        : {}),
      selectedIds: new Set(),
      statusMessage: `Deleted ${count} element(s)`,
      statusIsError: false,
    });
    get().pushSnapshot();
  },

  selectAll: () => {
    const s = get();
    const ids = new Set<string>();
    s.points.forEach((p) => ids.add(p.id));
    s.lines.forEach((l) => ids.add(l.id));
    s.rays.forEach((r) => ids.add(r.id));
    s.arcs.forEach((a) => ids.add(a.id));
    s.texts.forEach((t) => ids.add(t.id));
    set({ selectedIds: ids, statusMessage: `${ids.size} elements selected`, statusIsError: false });
  },

  findIntersectionsAction: () => {
    const s = get();
    // Remove old intersections and their step
    const oldIntersectionIds = new Set(s.intersections.map((inter) => inter.id));
    let steps = s.steps;
    if (oldIntersectionIds.size > 0) {
      steps = steps.filter(
        (st) => !st.elementIds || !st.elementIds.some((id) => oldIntersectionIds.has(id))
      );
      set({ steps });
    }
    const hits = findIntersections(s.lines, s.rays, s.arcs, s.points);
    if (hits.length > 0) {
      const ids = hits.map((_, i) => 'int' + Date.now() + '_' + i);
      const si = get().addStep(`Found ${hits.length} intersection(s)`, ids);
      set({
        intersections: hits.map((h, i) => ({ ...h, stepIndex: si, id: ids[i] })),
        statusMessage: `Found ${hits.length} intersection(s)!`,
        statusIsError: false,
      });
    } else {
      set({
        intersections: [],
        statusMessage: 'No intersections found.',
        statusIsError: true,
      });
    }
  },

  completeFullCircle: () => {
    const s = get();
    if (s.selection.length !== 2) return;
    const center = s.selection[0] as PointData;
    const radiusData = s.selection[1] as CompassSelection;
    if (!radiusData.radius) return;
    const arcId = 'a' + Date.now();
    const si = get().addStep(
      `Full circle drawn at ${center.label} with radius ${(radiusData.radius / 20).toFixed(1)} cm`,
      [arcId]
    );
    const arc: ArcData = {
      id: arcId,
      center: { ...center },
      radius: radiusData.radius,
      startAngle: 0,
      endAngle: 360,
      type: 'circle',
      stepIndex: si,
    };
    set((st) => ({
      arcs: [...st.arcs, arc],
      selection: [],
    }));
    get().pushSnapshot();
  },

  updatePoint: (id, x, y) =>
    set((s) => ({
      points: s.points.map((p) => (p.id === id ? { ...p, x, y } : p)),
    })),

  updateText: (id, content) =>
    set((s) => ({
      texts: s.texts.map((t) => (t.id === id ? { ...t, content } : t)),
    })),

  updateTextPosition: (id, x, y) =>
    set((s) => ({
      texts: s.texts.map((t) => (t.id === id ? { ...t, x, y } : t)),
    })),

  setLabelPosition: (id, pos) =>
    set((s) => ({
      labelPositions: { ...s.labelPositions, [id]: pos },
    })),

  setStatus: (msg, isError = false) =>
    set({ statusMessage: msg, statusIsError: isError }),

  setPlaybackActive: (v) => set({ playbackActive: v }),

  setPlaybackStep: (v) => set({ playbackStep: v }),

  clearAll: () =>
    set({
      points: [],
      lines: [],
      rays: [],
      arcs: [],
      texts: [],
      intersections: [],
      steps: [],
      selection: [],
      selectedIds: new Set(),
      labelCounter: 0,
      stepCounter: 0,
      labelPositions: {},
      undoHistory: [],
      historyIndex: -1,
      playbackActive: false,
      playbackStep: -1,
      statusMessage: 'Cleared. Ready to draw!',
      statusIsError: false,
    }),

  loadExample: () => {
    const pts: PointData[] = [
      { id: 'p1', x: 100, y: 300, label: 'A' },
      { id: 'p2', x: 300, y: 300, label: 'B' },
      { id: 'p3', x: 200, y: 127, label: 'C' },
    ];
    const ls: LineData[] = [{ id: 'l1', a: 'p1', b: 'p2' }];
    const rs: RayData[] = [{ id: 'r1', from: 'p1', to: 'p3', angle: 60 }];
    set({
      points: pts,
      lines: ls,
      rays: rs,
      arcs: [],
      texts: [],
      intersections: [],
      steps: [],
      selection: [],
      selectedIds: new Set(),
      labelCounter: 3,
      stepCounter: 0,
      labelPositions: {},
      statusMessage: 'Example loaded!',
      statusIsError: false,
      historyIndex: -1,
      undoHistory: [],
    });
  },

  exportSVGAction: () => {
    const s = get();
    const svg = exportSVG(s.points, s.lines, s.rays, s.arcs);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'geometry.svg';
    a.click();
    set({ statusMessage: 'Exported!', statusIsError: false });
  },

  exportJSON: () => {
    const s = get();
    return JSON.stringify(
      {
        points: s.points,
        lines: s.lines,
        rays: s.rays,
        arcs: s.arcs,
        texts: s.texts,
        steps: s.steps,
        intersections: s.intersections,
        labelPositions: s.labelPositions,
      },
      null,
      2
    );
  },

  importJSON: (data) => {
    try {
      const d = JSON.parse(data);
      const loadedSteps = (d.steps || []).map((s: StepData, i: number) => ({ ...s, num: i + 1 }));
      set({
        points: d.points || [],
        lines: d.lines || [],
        rays: d.rays || [],
        arcs: d.arcs || [],
        texts: d.texts || [],
        steps: loadedSteps,
        labelPositions: d.labelPositions || {},
        labelCounter: (d.points || []).length,
        stepCounter: loadedSteps.length,
        intersections: d.intersections || [],
        playbackActive: false,
        playbackStep: -1,
        statusMessage: 'Loaded!',
        statusIsError: false,
      });
      get().pushSnapshot();
    } catch {
      set({ statusMessage: 'Invalid file', statusIsError: true });
    }
  },
}));
