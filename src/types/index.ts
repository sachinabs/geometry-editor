export type Tool =
  | 'ruler'
  | 'protractor'
  | 'compass'
  | 'point'
  | 'text'
  | 'intersect'
  | 'hand'
  | 'move'
  | 'eraser';

export interface PointData {
  id: string;
  x: number;
  y: number;
  label: string;
  stepIndex?: number;
}

export interface LineData {
  id: string;
  a: string;
  b: string;
  stepIndex?: number;
}

export interface RayData {
  id: string;
  from: string;
  to: string;
  angle: number;
  stepIndex?: number;
}

export interface ArcData {
  id: string;
  center: PointData;
  radius: number;
  startAngle: number;
  endAngle: number;
  type: 'arc' | 'circle';
  stepIndex?: number;
}

export interface TextData {
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize: number;
  stepIndex?: number;
}

export interface IntersectionData {
  id: string;
  x: number;
  y: number;
  stepIndex?: number;
}

export interface StepData {
  num: number;
  text: string;
  elementIds?: string[];
}

export interface CompassSelection {
  radius?: number;
  startAngle?: number;
}

export interface Snapshot {
  points: PointData[];
  lines: LineData[];
  rays: RayData[];
  arcs: ArcData[];
  texts: TextData[];
  steps: StepData[];
  labelPositions: Record<string, { x: number; y: number }>;
  labelCounter: number;
  stepCounter: number;
}
