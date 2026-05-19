import { ForwardRefExoticComponent } from 'react';
import { RefAttributes } from 'react';
import { StoreApi } from 'zustand';
import { UseBoundStore } from 'zustand';

export declare interface ArcData {
    id: string;
    center: PointData;
    radius: number;
    startAngle: number;
    endAngle: number;
    type: 'arc' | 'circle';
    stepIndex?: number;
}

export declare interface CompassSelection {
    radius?: number;
    startAngle?: number;
}

export declare interface EditorData {
    points: PointData[];
    lines: LineData[];
    rays: RayData[];
    arcs: ArcData[];
    texts: TextData[];
    steps: StepData[];
}

export declare interface ExportHandle {
    toSVG: () => string;
    toJSON: () => string;
    toPNG: () => Promise<string>;
}

export declare const GeometryEditor: ForwardRefExoticComponent<GeometryEditorProps & RefAttributes<ExportHandle>>;

export declare interface GeometryEditorProps {
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

declare interface GeometryState {
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
    labelPositions: Record<string, {
        x: number;
        y: number;
    }>;
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
    setLabelPosition: (id: string, pos: {
        x: number;
        y: number;
    }) => void;
    setStatus: (msg: string, isError?: boolean) => void;
    setPlaybackActive: (v: boolean) => void;
    setPlaybackStep: (v: number) => void;
    clearAll: () => void;
    loadExample: () => void;
    exportSVGAction: () => void;
    exportJSON: () => string;
    importJSON: (data: string) => void;
}

export declare interface IntersectionData {
    id: string;
    x: number;
    y: number;
    stepIndex?: number;
}

export declare interface KeyBindings {
    [key: string]: string;
}

export declare interface LineData {
    id: string;
    a: string;
    b: string;
    stepIndex?: number;
}

export declare interface PointData {
    id: string;
    x: number;
    y: number;
    label: string;
    stepIndex?: number;
}

export declare interface RayData {
    id: string;
    from: string;
    to: string;
    angle: number;
    stepIndex?: number;
}

declare interface Snapshot {
    points: PointData[];
    lines: LineData[];
    rays: RayData[];
    arcs: ArcData[];
    texts: TextData[];
    steps: StepData[];
    labelPositions: Record<string, {
        x: number;
        y: number;
    }>;
    labelCounter: number;
    stepCounter: number;
}

export declare interface StepData {
    num: number;
    text: string;
    elementIds?: string[];
}

export declare interface TextData {
    id: string;
    x: number;
    y: number;
    content: string;
    fontSize: number;
    stepIndex?: number;
}

export declare type Tool = 'ruler' | 'protractor' | 'compass' | 'point' | 'text' | 'intersect' | 'hand' | 'move' | 'eraser';

export declare const useGeometryStore: UseBoundStore<StoreApi<GeometryState>>;

export { }
